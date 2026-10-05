// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

export type AssistantIntent = 'brainstorm' | 'calculate' | 'explain' | 'general' | 'greeting' | 'plan' | 'rewrite' | 'summarize';

export interface AssistantResponse {
  intent: AssistantIntent;
  paragraphs: string[];
  bullets?: string[];
  followUps: string[];
}

function subjectAfter(prompt: string, markers: RegExp): string {
  const match = prompt.match(markers);
  return (match?.[1] || prompt).replace(/[?.!]+$/, '').trim();
}

function cleanText(value: string): string {
  const compact = value.replace(/\s+/g, ' ').trim();
  return compact ? compact.charAt(0).toUpperCase() + compact.slice(1) : compact;
}

function contentAfterInstruction(prompt: string): string {
  const separator = prompt.indexOf(':');
  if (separator >= 0) return prompt.slice(separator + 1).trim();
  const newline = prompt.indexOf('\n');
  if (newline >= 0) return prompt.slice(newline + 1).trim();
  return '';
}

function calculate(prompt: string): AssistantResponse | null {
  const normalized = prompt.toLowerCase().replace(/what is|calculate|compute|please|,/g, ' ');
  const match = normalized.match(/(-?\d+(?:\.\d+)?)\s*(plus|minus|times|multiplied by|divided by|[+\-*/])\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  const left = Number(match[1]);
  const right = Number(match[3]);
  const operator = match[2];
  let result: number;
  if (operator === '+' || operator === 'plus') result = left + right;
  else if (operator === '-' || operator === 'minus') result = left - right;
  else if (operator === '*' || operator === 'times' || operator === 'multiplied by') result = left * right;
  else result = right === 0 ? Number.NaN : left / right;
  if (!Number.isFinite(result)) {
    return { intent: 'calculate', paragraphs: ['That calculation is undefined because it divides by zero.'], followUps: ['Try another calculation'] };
  }
  return {
    intent: 'calculate',
    paragraphs: [`The result is ${Number.isInteger(result) ? result : Number(result.toFixed(6))}.`],
    followUps: ['Explain the calculation', 'Calculate another value'],
  };
}

export function generateAssistantResponse(rawPrompt: string): AssistantResponse {
  const prompt = rawPrompt.trim();
  const lower = prompt.toLowerCase();
  const calculation = calculate(prompt);
  if (calculation) return calculation;

  if (/^(hi|hello|hey|good morning|good afternoon)\b/.test(lower)) {
    return {
      intent: 'greeting',
      paragraphs: ['Hello! I can help you plan, rewrite, summarize, brainstorm, explain a topic, or work through a quick calculation.'],
      followUps: ['Plan my week', 'Brainstorm launch ideas', 'Help me rewrite a message'],
    };
  }

  if (lower.includes('summarize') || lower.includes('summary')) {
    const content = contentAfterInstruction(prompt);
    if (!content) {
      return {
        intent: 'summarize',
        paragraphs: ['Paste the text after a colon and I’ll turn it into a concise summary.'],
        followUps: ['Summarize: Our launch moved to Friday so the team can finish accessibility testing and update documentation.'],
      };
    }
    const sentences = content.match(/[^.!?]+[.!?]?/g)?.map(sentence => cleanText(sentence)) || [cleanText(content)];
    const keySentences = sentences.filter(Boolean).sort((a, b) => b.length - a.length).slice(0, 2);
    return {
      intent: 'summarize',
      paragraphs: [keySentences.join(' ')],
      bullets: sentences.slice(0, 3),
      followUps: ['Make it one sentence', 'Turn this into action items'],
    };
  }

  if (lower.includes('rewrite') || lower.includes('rephrase') || lower.includes('make this')) {
    const content = contentAfterInstruction(prompt);
    if (!content) {
      return {
        intent: 'rewrite',
        paragraphs: ['Add the text you want rewritten after a colon. You can also specify a tone such as concise, friendly, or professional.'],
        followUps: ['Rewrite professionally: we need a little more time and will send the update tomorrow'],
      };
    }
    let rewritten = cleanText(content)
      .replace(/\bcan't\b/gi, 'cannot')
      .replace(/\bwon't\b/gi, 'will not')
      .replace(/\bASAP\b/g, 'as soon as possible')
      .replace(/\bguys\b/gi, 'team');
    if (!/[.!?]$/.test(rewritten)) rewritten += '.';
    const intro = lower.includes('friendly') ? 'Here’s a warmer version:' : lower.includes('concise') ? 'Here’s a concise version:' : 'Here’s a polished version:';
    return { intent: 'rewrite', paragraphs: [intro, rewritten], followUps: ['Make it friendlier', 'Make it more concise', 'Turn it into an email'] };
  }

  if (lower.includes('brainstorm') || lower.includes('ideas')) {
    const topic = subjectAfter(prompt, /(?:brainstorm|ideas? for|ideas? about)\s+(.+)/i) || 'your goal';
    return {
      intent: 'brainstorm',
      paragraphs: [`Here are six directions for ${topic}:`],
      bullets: [
        `Start with a small pilot focused on the clearest user need.`,
        `Create a guided, interactive version that people can try in under five minutes.`,
        `Build a story around a before-and-after result rather than a feature list.`,
        `Invite users to contribute examples, templates, or feedback.`,
        `Pair the launch with a short educational series or live walkthrough.`,
        `Measure one adoption signal and one quality signal from day one.`,
      ],
      followUps: [`Turn these into a plan`, `Give me bolder ideas for ${topic}`, 'Rank these by effort'],
    };
  }

  if (lower.includes('plan') || lower.includes('roadmap') || lower.includes('steps')) {
    const topic = subjectAfter(prompt, /(?:plan|roadmap|steps)(?:\s+for|\s+to)?\s+(.+)/i) || 'this project';
    return {
      intent: 'plan',
      paragraphs: [`Here’s a practical plan for ${topic}:`],
      bullets: [
        'Define the outcome, audience, deadline, and one measurable success signal.',
        'List the constraints and separate must-haves from nice-to-haves.',
        'Break the work into a first usable version, review, and final delivery.',
        'Assign an owner and checkpoint to each major task.',
        'Run a short retrospective and capture the next iteration.',
      ],
      followUps: ['Turn this into a checklist', 'Add a timeline', 'Identify likely risks'],
    };
  }

  if (lower.startsWith('explain') || lower.includes('what is') || lower.includes('how does')) {
    const topic = subjectAfter(prompt, /(?:explain|what is|how does)\s+(.+)/i) || 'that topic';
    return {
      intent: 'explain',
      paragraphs: [
        `${cleanText(topic)} is easiest to understand by separating the goal, the mechanism, and the tradeoffs. The goal describes the problem it solves; the mechanism is the sequence of inputs, decisions, and outputs; the tradeoffs are the cost, complexity, speed, and reliability choices involved.`,
        'A useful next step is to pick one concrete example and trace it from start to finish.',
      ],
      followUps: [`Give me an example of ${topic}`, 'Explain it for a beginner', 'Compare the main alternatives'],
    };
  }

  const topic = prompt.length > 110 ? `${prompt.slice(0, 107)}…` : prompt;
  return {
    intent: 'general',
    paragraphs: [`A useful way to approach “${topic}” is to clarify the desired outcome first, then choose the smallest action that produces feedback.`],
    bullets: ['State the decision or result you need.', 'Collect only the information that changes that decision.', 'Try a small version, review the result, and iterate.'],
    followUps: ['Make this more specific', 'Turn this into a checklist', 'Show me an example'],
  };
}

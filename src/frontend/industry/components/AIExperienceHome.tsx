// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { CypressFields } from '../../utils/enums/CypressFields';
import { generateAssistantResponse, AssistantResponse } from '../aiAssistant';
import { AI_CHAT_RESET_EVENT, AI_CHAT_STORAGE_KEY } from '../aiStorage';
import { useIndustry } from '../IndustryProvider';
import { recordIndustryEvent, withIndustrySpan } from '../telemetry';
import ApiGateway from '../../gateways/Api.gateway';
import IndustrySettings from './IndustrySettings';
import MeridianMark from './MeridianMark';
import * as S from './AIExperience.styled';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  response?: AssistantResponse;
}

interface SavedChat {
  id: string;
  title: string;
  messages: ChatMessage[];
}

const suggestions = [
  { title: 'Plan a team offsite', prompt: 'Plan a three-day team offsite focused on strategy, trust, and clear next steps.' },
  { title: 'Rewrite a customer update', prompt: 'Rewrite professionally: we need a little more time and will send the product update tomorrow' },
  { title: 'Brainstorm launch ideas', prompt: 'Brainstorm ideas for launching a new customer education program.' },
  { title: 'Summarize an update', prompt: 'Summarize: Our launch moved to Friday so the team can finish accessibility testing and update the documentation. Customer support has been briefed and no customer commitments are affected.' },
];

function messageText(message: ChatMessage): string {
  if (!message.response) return message.content;
  return [...message.response.paragraphs, ...(message.response.bullets || [])].join('\n');
}

export default function AIExperienceHome() {
  const { industry } = useIndustry();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [activeChatId, setActiveChatId] = useState(() => `chat-${Date.now()}`);
  const [draft, setDraft] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [newChatNotice, setNewChatNotice] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestSequenceRef = useRef(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try { setSavedChats(JSON.parse(localStorage.getItem(AI_CHAT_STORAGE_KEY) || '[]')); } catch { setSavedChats([]); }
    recordIndustryEvent(industry.id, industry.primaryJourney, 'chat_opened');
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, [industry.id, industry.primaryJourney]);

  useEffect(() => {
    const resetChatHistory = () => {
      requestSequenceRef.current += 1;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
      setActiveChatId(`chat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
      setMessages([]);
      setSavedChats([]);
      setDraft('');
      setIsThinking(false);
      setCopiedId('');
      setNewChatNotice('Conversation history reset');
      noticeTimerRef.current = setTimeout(() => setNewChatNotice(''), 1600);
    };

    window.addEventListener(AI_CHAT_RESET_EVENT, resetChatHistory);
    return () => window.removeEventListener(AI_CHAT_RESET_EVENT, resetChatHistory);
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [isThinking, messages]);

  const persistChat = (nextMessages: ChatMessage[]) => {
    if (!nextMessages.length) return;
    const firstPrompt = nextMessages.find(message => message.role === 'user')?.content || 'New chat';
    const title = firstPrompt.length > 36 ? `${firstPrompt.slice(0, 36)}…` : firstPrompt;
    setSavedChats(current => {
      const updated = [{ id: activeChatId, title, messages: nextMessages }, ...current.filter(chat => chat.id !== activeChatId)].slice(0, 8);
      try { localStorage.setItem(AI_CHAT_STORAGE_KEY, JSON.stringify(updated)); } catch { /* storage is optional */ }
      return updated;
    });
  };

  const sendPrompt = async (value: string) => {
    const prompt = value.trim();
    if (!prompt || isThinking) return;
    const requestSequence = ++requestSequenceRef.current;
    const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: prompt };
    const pendingMessages = [...messages, userMessage];
    setMessages(pendingMessages);
    setDraft('');
    setIsThinking(true);
    setCopiedId('');
    const preview = generateAssistantResponse(prompt);
    const responseDelay = Math.min(1900, 1250 + prompt.length * 4);
    const minimumDelay = new Promise<void>(resolve => {
      timerRef.current = setTimeout(resolve, responseDelay);
    });

    let response = preview;
    let responseMode: 'agent' | 'embedded_backend' | 'agent_fallback' | 'client_fallback' = 'client_fallback';
    try {
      const [result] = await Promise.all([
        withIndustrySpan(
          industry.id,
          industry.primaryJourney,
          'prompt_submitted',
          () => ApiGateway.respondToAssistant(
            prompt,
            pendingMessages.slice(0, -1).map(message => ({ role: message.role, content: messageText(message) }))
          ),
          { 'app.ai.intent': preview.intent }
        ),
        minimumDelay,
      ]);
      response = result.response;
      responseMode = result.backend;
    } catch {
      await minimumDelay;
    }

    if (requestSequence === requestSequenceRef.current) {
      const assistantMessage: ChatMessage = { id: `assistant-${Date.now()}`, role: 'assistant', content: response.paragraphs.join('\n\n'), response };
      const completed = [...pendingMessages, assistantMessage];
      setMessages(completed);
      setIsThinking(false);
      timerRef.current = null;
      persistChat(completed);
      recordIndustryEvent(industry.id, industry.primaryJourney, 'response_completed', {
        'app.ai.intent': response.intent,
        'app.ai.response_mode': responseMode,
      });
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void sendPrompt(draft);
  };

  const newChat = () => {
    requestSequenceRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setActiveChatId(`chat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
    setMessages([]);
    setDraft('');
    setIsThinking(false);
    setCopiedId('');
    setNewChatNotice('New conversation started');
    noticeTimerRef.current = setTimeout(() => setNewChatNotice(''), 1600);
    requestAnimationFrame(() => composerRef.current?.focus());
    recordIndustryEvent(industry.id, industry.primaryJourney, 'new_chat_started');
  };

  const loadChat = (chat: SavedChat) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages);
    setIsThinking(false);
    recordIndustryEvent(industry.id, industry.primaryJourney, 'conversation_loaded');
  };

  const copyMessage = async (message: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(messageText(message));
      setCopiedId(message.id);
      recordIndustryEvent(industry.id, industry.primaryJourney, 'response_copied');
    } catch { setCopiedId(''); }
  };

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendPrompt(draft);
    }
  };

  const composer = (
    <S.Composer onSubmit={submit}>
      <button aria-label="Add context" type="button">＋</button>
      <textarea
        aria-label="Message Meridian"
        autoComplete="off"
        data-cy={CypressFields.AiChatInput}
        onChange={event => setDraft(event.target.value)}
        onKeyDown={onComposerKeyDown}
        placeholder="Message Meridian"
        ref={composerRef}
        rows={1}
        value={draft}
      />
      <S.SendButton aria-label="Send message" data-cy={CypressFields.AiChatSend} disabled={!draft.trim() || isThinking} type="submit">↑</S.SendButton>
    </S.Composer>
  );

  return (
    <S.Page data-cy={CypressFields.HomePage}>
      <S.Sidebar aria-label="AI assistant navigation">
        <S.Brand><S.BrandMark aria-hidden="true"><MeridianMark /></S.BrandMark><strong>Meridian</strong></S.Brand>
        <S.NewChatButton onClick={newChat} type="button"><span>＋</span>New chat</S.NewChatButton>
        <S.NavItem type="button"><span>⌕</span>Search chats</S.NavItem>
        <S.History>
          <strong>Recent</strong>
          {savedChats.length ? savedChats.map(chat => (
            <button aria-current={chat.id === activeChatId ? 'page' : undefined} key={chat.id} onClick={() => loadChat(chat)} type="button">{chat.title}</button>
          )) : <p>Your conversations will appear here.</p>}
        </S.History>
        <S.SidebarBottom>
          <IndustrySettings />
        </S.SidebarBottom>
      </S.Sidebar>

      <S.Main>
        <S.Topbar>
          <S.TopbarBrand><S.CompactMark aria-hidden="true"><MeridianMark /></S.CompactMark><strong>Meridian <span>⌄</span></strong></S.TopbarBrand>
          <S.MobileSettings><IndustrySettings /></S.MobileSettings>
        </S.Topbar>
        {newChatNotice ? <S.NewChatNotice role="status">{newChatNotice}</S.NewChatNotice> : null}
        <S.Chat aria-live="polite" ref={chatRef}>
          {messages.length === 0 ? (
            <S.Welcome>
              <h1>How can I help?</h1>
              <S.WelcomeComposer>{composer}</S.WelcomeComposer>
              <S.Suggestions>
                {suggestions.map(suggestion => (
                  <button key={suggestion.title} onClick={() => void sendPrompt(suggestion.prompt)} type="button">{suggestion.title}</button>
                ))}
              </S.Suggestions>
              <S.Disclosure>Meridian can make mistakes. Check important information.</S.Disclosure>
            </S.Welcome>
          ) : (
            <S.Messages>
              {messages.map(message => message.role === 'user' ? (
                <S.UserRow data-cy={CypressFields.AiMessage} key={message.id}><div>{message.content}</div></S.UserRow>
              ) : (
                <S.AssistantRow data-cy={CypressFields.AiMessage} key={message.id}>
                  <S.AssistantMark aria-hidden="true"><MeridianMark /></S.AssistantMark>
                  <S.Answer>
                    <strong>Meridian</strong>
                    {message.response?.paragraphs.map((paragraph, index) => <p key={`${message.id}-p-${index}`}>{paragraph}</p>)}
                    {message.response?.bullets?.length ? <ul>{message.response.bullets.map(item => <li key={item}>{item}</li>)}</ul> : null}
                    <S.AnswerActions>
                      <button aria-label="Copy response" onClick={() => copyMessage(message)} type="button">{copiedId === message.id ? '✓ Copied' : 'Copy'}</button>
                      {message.response?.followUps.slice(0, 2).map(followUp => <button key={followUp} onClick={() => void sendPrompt(followUp)} type="button">{followUp}</button>)}
                    </S.AnswerActions>
                  </S.Answer>
                </S.AssistantRow>
              ))}
              {isThinking ? <S.AssistantRow aria-label="Meridian is thinking"><S.AssistantMark aria-hidden="true"><MeridianMark /></S.AssistantMark><S.Thinking><i /><i /><i /><span>Thinking…</span></S.Thinking></S.AssistantRow> : null}
            </S.Messages>
          )}
        </S.Chat>

        {messages.length > 0 ? <S.ComposerArea>{composer}<small>Meridian can make mistakes. Check important information.</small></S.ComposerArea> : <span />}
      </S.Main>
    </S.Page>
  );
}

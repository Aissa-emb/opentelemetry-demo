// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { context, Span, trace } from '@opentelemetry/api';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { AssistantGatewayResponse } from '../../../gateways/Api.gateway';
import { generateAssistantResponse } from '../../../industry/aiAssistant';
import InstrumentationMiddleware from '../../../utils/telemetry/InstrumentationMiddleware';
import { AttributeNames } from '../../../utils/enums/AttributeNames';

interface AssistantRequest {
  message?: unknown;
  history?: unknown;
}

const handler = async (request: NextApiRequest, response: NextApiResponse<AssistantGatewayResponse | { error: string }>) => {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const body = request.body as AssistantRequest;
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 8_000) : '';
  if (!message) return response.status(400).json({ error: 'A message is required' });

  // History is retained in the browser experience but deliberately not sent to the stock
  // shopping Agent service. That service can call the product catalog, which would make a
  // Meridian trace semantically incorrect.
  void body.history;
  const generated = generateAssistantResponse(message);
  const span = trace.getSpan(context.active()) as Span;

  span.setAttribute(AttributeNames.AI_RESPONSE_MODE, 'embedded_backend');
  return response.status(200).json({ backend: 'embedded_backend', response: generated });
};

export default InstrumentationMiddleware(handler);

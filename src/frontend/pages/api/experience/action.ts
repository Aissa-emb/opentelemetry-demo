// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';
import { requestDomainIndustry, withDomainBackendSpan } from '../../../industry/backendContext';
import InstrumentationMiddleware from '../../../utils/telemetry/InstrumentationMiddleware';

interface GuidedActionRequest {
  actionId: string;
  fields?: Record<string, string>;
}

interface GuidedActionResponse {
  eventId: string;
  notificationSent: boolean;
  status: 'accepted';
}

const handler = async (request: NextApiRequest, response: NextApiResponse<GuidedActionResponse | string>) => {
  if (request.method !== 'POST') return response.status(405).send('');

  const industry = requestDomainIndustry(request);
  if (!industry) return response.status(400).send('A supported domain experience is required');

  const { actionId, fields = {} } = request.body as GuidedActionRequest;
  if (!actionId || actionId.length > 64) return response.status(400).send('A valid action is required');

  const result = await withDomainBackendSpan(industry, 'guided_action', actionId, async () => {
    const eventId = uuid();
    // The frontend BFF accepts the guided workflow. It deliberately does not
    // invent a downstream dependency when the stock backend has no matching domain service.
    void fields;
    return { eventId, notificationSent: false, status: 'accepted' as const };
  }, { 'app.action.name': actionId });

  return response.status(200).json(result);
};

export default InstrumentationMiddleware(handler);

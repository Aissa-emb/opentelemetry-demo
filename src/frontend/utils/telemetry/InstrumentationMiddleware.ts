// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { NextApiHandler } from 'next';
import {context, Exception, propagation, Span, SpanStatusCode, trace} from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { AttributeNames } from '../enums/AttributeNames';
import { isIndustryId } from '../../industry/registry';

const InstrumentationMiddleware = (handler: NextApiHandler): NextApiHandler => {
  return async (request, response) => {
    const span = trace.getSpan(context.active()) as Span;
    const baggage = propagation.getBaggage(context.active());
    const industry = baggage?.getEntry(AttributeNames.INDUSTRY)?.value || request.headers['x-app-experience'];
    const journey = baggage?.getEntry(AttributeNames.JOURNEY)?.value || request.headers['x-app-journey'];
    const step = baggage?.getEntry(AttributeNames.STEP)?.value || request.headers['x-app-workflow-step'];
    const operation = baggage?.getEntry(AttributeNames.OPERATION)?.value || request.headers['x-app-operation'];
    const backendDomain = request.headers['x-app-backend-domain'];
    const backendResource = request.headers['x-app-backend-resource'];
    const backendOriginalRoute = request.headers['x-app-backend-original-route'];
    const sessionId = baggage?.getEntry(AttributeNames.SESSION_ID)?.value || request.headers['x-session-id'];
    const endUserId = baggage?.getEntry(AttributeNames.ENDUSER_ID)?.value || request.headers['x-enduser-id'];

    if (typeof industry === 'string' && isIndustryId(industry)) span.setAttribute(AttributeNames.INDUSTRY, industry);
    if (typeof journey === 'string' && journey.length <= 64) span.setAttribute(AttributeNames.JOURNEY, journey);
    if (typeof step === 'string' && step.length <= 64) span.setAttribute(AttributeNames.STEP, step);
    if (typeof operation === 'string' && operation.length <= 96) span.setAttribute(AttributeNames.OPERATION, operation);
    if (typeof backendDomain === 'string' && backendDomain.length <= 32) span.setAttribute(AttributeNames.BACKEND_DOMAIN, backendDomain);
    if (typeof backendResource === 'string' && backendResource.length <= 64) span.setAttribute(AttributeNames.BACKEND_RESOURCE, backendResource);
    if (typeof backendOriginalRoute === 'string' && backendOriginalRoute.length <= 128) span.setAttribute(AttributeNames.BACKEND_ORIGINAL_ROUTE, backendOriginalRoute);
    if (typeof sessionId === 'string' && sessionId.length <= 128) span.setAttribute(AttributeNames.SESSION_ID, sessionId);
    if (typeof endUserId === 'string' && endUserId.length <= 128) span.setAttribute(AttributeNames.ENDUSER_ID, endUserId);

    let httpStatus = 200;
    try {
      await runWithSpan(span, async () => handler(request, response));
      httpStatus = response.statusCode;
    } catch (error) {
      span.recordException(error as Exception);
      span.setStatus({ code: SpanStatusCode.ERROR });
      httpStatus = 500;
      throw error;
    } finally {
      span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, httpStatus);
    }
  };
};

async function runWithSpan(parentSpan: Span, fn: () => Promise<unknown>) {
  const ctx = trace.setSpan(context.active(), parentSpan);
  return await context.with(ctx, fn);
}

export default InstrumentationMiddleware;

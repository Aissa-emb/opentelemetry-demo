// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { context, propagation } from '@opentelemetry/api';
import { createEmbraceSpan, finishEmbraceSpan, logError } from './embrace';
import { experienceApiRoute } from '../industry/apiRoutes';
import { isIndustryId } from '../industry/registry';

interface IRequestParams {
  url: string;
  body?: object;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  queryParams?: Record<string, any>;
  headers?: Record<string, string>;
}

export class RequestError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'RequestError';
  }
}

const request = async <T>({
  url = '',
  method = 'GET',
  body,
  queryParams = {},
  headers = {
    'content-type': 'application/json',
  },
}: IRequestParams): Promise<T> => {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 20_000);
  let response: Response;
  const baggage = propagation.getBaggage(context.active());
  const industry = baggage?.getEntry('app.experience.name')?.value;
  const journey = baggage?.getEntry('app.user_journey')?.value;
  const step = baggage?.getEntry('app.workflow.step')?.value;
  const operation = baggage?.getEntry('app.operation.name')?.value;
  const sessionId = baggage?.getEntry('session.id')?.value;
  const endUserId = baggage?.getEntry('enduser.id')?.value;
  const route = experienceApiRoute(industry && isIndustryId(industry) ? industry : undefined, url);
  const requestQuery = { ...queryParams };
  const requestHeaders = { ...headers };
  if (industry) {
    requestQuery.experience = industry;
    requestHeaders['x-app-experience'] = industry;
  }
  if (operation) {
    requestQuery.operation = operation;
    requestHeaders['x-app-operation'] = operation;
  }
  if (journey) requestHeaders['x-app-journey'] = journey;
  if (step) requestHeaders['x-app-workflow-step'] = step;
  requestHeaders['x-app-backend-domain'] = route.domain;
  requestHeaders['x-app-backend-resource'] = route.resource;
  if (route.domain === 'shared') requestHeaders['x-app-backend-original-route'] = route.originalUrl;
  if (sessionId) requestHeaders['x-session-id'] = sessionId;
  if (endUserId) requestHeaders['x-enduser-id'] = endUserId;
  const spanName = industry && operation ? `${industry}.api.${operation}` : `shared.api.${method.toLowerCase()}`;
  const embraceSpan = createEmbraceSpan(spanName, {
    'app.experience.name': industry,
    'app.user_journey': journey,
    'app.workflow.step': step,
    'app.operation.name': operation,
    'app.backend.domain': route.domain,
    'app.backend.resource': route.resource,
    'app.backend.original_route': route.domain === 'shared' ? route.originalUrl : undefined,
    'session.id': sessionId,
    'enduser.id': endUserId,
    'http.request.method': method,
    'url.path': route.url,
  });

  try {
    response = await fetch(`${route.url}?${new URLSearchParams(requestQuery).toString()}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: requestHeaders,
      signal: controller.signal,
    });
  } catch (error) {
    finishEmbraceSpan(embraceSpan, false, error);
    logError(`${spanName}_failed`, { 'app.experience.name': industry, 'app.operation.name': operation, 'url.path': route.url }, error);
    if ((error as Error).name === 'AbortError') {
      throw new RequestError(`Request timed out: ${method} ${route.url}`);
    }
    throw new RequestError(`Network request failed: ${method} ${route.url}`);
  } finally {
    globalThis.clearTimeout(timeout);
  }

  const responseText = await response.text();

  if (!response.ok) {
    finishEmbraceSpan(embraceSpan, false);
    logError(`${spanName}_failed`, { 'app.experience.name': industry, 'app.operation.name': operation, 'http.response.status_code': response.status, 'url.path': route.url });
    throw new RequestError(`Request failed with status ${response.status}: ${method} ${route.url}`, response.status);
  }

  finishEmbraceSpan(embraceSpan, true);

  if (responseText) {
    try {
      return JSON.parse(responseText);
    } catch {
      throw new RequestError(`Response was not valid JSON: ${method} ${route.url}`, response.status);
    }
  }

  return undefined as unknown as T;
};

export default request;

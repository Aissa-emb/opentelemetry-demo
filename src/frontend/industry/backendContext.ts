// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { Attributes, SpanStatusCode, trace } from '@opentelemetry/api';
import type { NextApiRequest } from 'next';
import { AttributeNames } from '../utils/enums/AttributeNames';
import { isIndustryId } from './registry';
import { IndustryId } from './types';

export type DomainIndustryId = Exclude<IndustryId, 'astronomy' | 'ai'>;

const domainIndustries: DomainIndustryId[] = ['banking', 'healthcare', 'travel', 'insurance'];

export function requestDomainIndustry(request: NextApiRequest): DomainIndustryId | undefined {
  const header = request.headers['x-app-experience'];
  const query = request.query.experience;
  const value = Array.isArray(header)
    ? header[0]
    : (header || (Array.isArray(query) ? query[0] : query));

  return isIndustryId(value) && domainIndustries.includes(value as DomainIndustryId)
    ? value as DomainIndustryId
    : undefined;
}

export async function withDomainBackendSpan<T>(
  industry: DomainIndustryId,
  resource: string,
  operation: string,
  fn: () => Promise<T> | T,
  attributes: Attributes = {}
): Promise<T> {
  const tracer = trace.getTracer('frontend-industry-backend');

  return tracer.startActiveSpan(`${industry}.${resource}.${operation}`, async span => {
    span.setAttributes({
      [AttributeNames.INDUSTRY]: industry,
      [AttributeNames.BACKEND_DOMAIN]: industry,
      [AttributeNames.BACKEND_RESOURCE]: resource,
      [AttributeNames.OPERATION]: `${industry}_${operation}`,
      ...attributes,
    });

    try {
      return await fn();
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}

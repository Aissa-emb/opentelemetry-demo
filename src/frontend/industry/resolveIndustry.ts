// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { defaultIndustry, isIndustryId } from './registry';
import { IndustryId } from './types';

export const INDUSTRY_COOKIE = 'otel_demo_industry';
export const INDUSTRY_STORAGE_KEY = 'otel-demo-industry';

function firstQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? undefined : value;
}

export function readIndustryCookie(cookieHeader = ''): IndustryId | undefined {
  const value = cookieHeader
    .split(';')
    .map(part => part.trim().split('='))
    .find(([key]) => key === INDUSTRY_COOKIE)?.[1];

  if (!value) return undefined;

  try {
    const decoded = decodeURIComponent(value);
    return isIndustryId(decoded) ? decoded : undefined;
  } catch {
    return undefined;
  }
}

export function resolveIndustry(
  queryValue?: string | string[],
  persistedValue?: string
): IndustryId {
  const explicitValue = firstQueryValue(queryValue);
  if (isIndustryId(explicitValue)) return explicitValue;
  if (isIndustryId(persistedValue)) return persistedValue;
  return defaultIndustry.id;
}

export function readStoredIndustry(): IndustryId | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    const value = window.localStorage.getItem(INDUSTRY_STORAGE_KEY);
    return isIndustryId(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function persistIndustry(industry: IndustryId): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(INDUSTRY_STORAGE_KEY, industry);
  } catch {
    // Explicit URL selection remains available when storage is blocked.
  }

  try {
    document.cookie = `${INDUSTRY_COOKIE}=${encodeURIComponent(industry)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  } catch {
    // Industry-aware URLs remain authoritative when cookies are blocked.
  }
}

// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { UrlObject } from 'url';
import { IndustryId } from './types';

export const experienceRoots: Record<IndustryId, string> = {
  astronomy: '/',
  banking: '/accounts',
  healthcare: '/patient',
  travel: '/flights',
  insurance: '/policies',
  ai: '/chat',
};

const experienceRoutes: Record<Exclude<IndustryId, 'astronomy' | 'ai'>, {
  detail: string;
  review: string;
  confirmation: string;
}> = {
  banking: {
    detail: '/accounts/bills',
    review: '/accounts/payments/review',
    confirmation: '/accounts/payments/confirmation',
  },
  healthcare: {
    detail: '/patient/statements',
    review: '/patient/billing/review',
    confirmation: '/patient/billing/confirmation',
  },
  travel: {
    detail: '/flights/options',
    review: '/flights/trips/review',
    confirmation: '/flights/trips/confirmation',
  },
  insurance: {
    detail: '/policies/coverage',
    review: '/policies/coverage/review',
    confirmation: '/policies/coverage/confirmation',
  },
};

function cleanPath(value: string): string {
  const path = value.split(/[?#]/)[0] || '/';
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

export function experienceHomePath(industry: IndustryId): string {
  return experienceRoots[industry];
}

export function industryFromPath(value: string): IndustryId | undefined {
  const path = cleanPath(value);

  return (Object.entries(experienceRoots) as [IndustryId, string][])
    .filter(([industry]) => industry !== 'astronomy')
    .find(([, root]) => path === root || path.startsWith(`${root}/`))?.[0];
}

export function experienceHref(industry: IndustryId, value: string, hash?: string): UrlObject {
  const pathname = cleanPath(value);
  const withHash = (target: string): UrlObject => ({ pathname: target, ...(hash ? { hash } : {}) });

  if (industry === 'astronomy') return withHash(pathname);
  if (industry === 'ai') return withHash(experienceRoots.ai);
  if (industryFromPath(pathname) === industry) return withHash(pathname);
  if (pathname === '/') return withHash(experienceRoots[industry]);

  const detailMatch = pathname.match(/^\/product\/([^/]+)$/);
  if (detailMatch) return withHash(`${experienceRoutes[industry].detail}/${encodeURIComponent(detailMatch[1])}`);
  if (pathname === '/cart') return withHash(experienceRoutes[industry].review);

  const confirmationMatch = pathname.match(/^\/cart\/checkout\/([^/]+)$/);
  if (confirmationMatch) {
    return withHash(`${experienceRoutes[industry].confirmation}/${encodeURIComponent(confirmationMatch[1])}`);
  }

  return withHash(experienceRoots[industry]);
}

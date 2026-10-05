// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { IndustryId } from './types';

interface ExperienceApiRoute {
  url: string;
  resource: string;
  domain: string;
  originalUrl: string;
}

const routes: Partial<Record<IndustryId, Record<string, string>>> = {
  banking: {
    cart: '/api/accounts/payment-selection',
    checkout: '/api/accounts/payments',
    currency: '/api/accounts/currencies',
    data: '/api/accounts/guidance',
    products: '/api/accounts/bills',
    recommendations: '/api/accounts/related-bills',
    shipping: '/api/accounts/payment-fees',
    action: '/api/accounts/service-requests',
  },
  healthcare: {
    cart: '/api/patient/payment-selection',
    checkout: '/api/patient/payments',
    currency: '/api/patient/currencies',
    data: '/api/patient/resources',
    products: '/api/patient/statements',
    recommendations: '/api/patient/related-statements',
    shipping: '/api/patient/service-fees',
    action: '/api/patient/requests',
  },
  travel: {
    cart: '/api/flights/trip-selection',
    checkout: '/api/flights/bookings',
    currency: '/api/flights/currencies',
    data: '/api/flights/offers',
    products: '/api/flights/search',
    recommendations: '/api/flights/alternatives',
    shipping: '/api/flights/booking-fees',
    action: '/api/flights/service-requests',
  },
  insurance: {
    cart: '/api/policies/coverage-selection',
    checkout: '/api/policies/confirmations',
    currency: '/api/policies/currencies',
    data: '/api/policies/guidance',
    products: '/api/policies/coverage',
    recommendations: '/api/policies/related-coverage',
    shipping: '/api/policies/service-fees',
    action: '/api/policies/service-requests',
  },
};

const resources: Record<string, string> = {
  cart: 'selection',
  checkout: 'transaction',
  currency: 'currency',
  data: 'guidance',
  products: 'records',
  recommendations: 'related_records',
  shipping: 'fee_quote',
  action: 'guided_action',
};

function genericResource(url: string): { key: string; suffix: string } | undefined {
  if (url === '/api/experience/action') return { key: 'action', suffix: '' };
  const match = url.match(/^\/api\/(cart|checkout|currency|data|products|recommendations|shipping)(\/.*)?$/);
  return match ? { key: match[1], suffix: match[2] || '' } : undefined;
}

export function experienceApiRoute(industry: IndustryId | undefined, originalUrl: string): ExperienceApiRoute {
  const generic = genericResource(originalUrl);
  const semanticBase = industry && generic ? routes[industry]?.[generic.key] : undefined;
  return {
    url: semanticBase ? `${semanticBase}${generic?.suffix || ''}` : originalUrl,
    resource: generic ? resources[generic.key] : originalUrl === '/api/chat/respond' ? 'assistant_response' : 'frontend_api',
    domain: industry || 'shared',
    originalUrl,
  };
}

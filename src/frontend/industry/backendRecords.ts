// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import CurrencyGateway from '../gateways/rpc/Currency.gateway';
import { Money, Product } from '../protos/demo';
import { getIndustry } from './registry';
import { DomainIndustryId, withDomainBackendSpan } from './backendContext';

const prices: Record<string, Money> = {
  OLJCESPC7Z: { currencyCode: 'USD', units: 101, nanos: 960_000_000 },
  '66VCHSJNUP': { currencyCode: 'USD', units: 349, nanos: 950_000_000 },
  '1YMWWN1N4O': { currencyCode: 'USD', units: 129, nanos: 950_000_000 },
  L9ECAV7KIM: { currencyCode: 'USD', units: 21, nanos: 950_000_000 },
  '2ZYFJ3GM2N': { currencyCode: 'USD', units: 209, nanos: 950_000_000 },
  '0PUK6V6EV0': { currencyCode: 'USD', units: 175, nanos: 0 },
  LS4PSXUNUM: { currencyCode: 'USD', units: 57, nanos: 80_000_000 },
  '9SIQT8TOJO': { currencyCode: 'USD', units: 3599, nanos: 0 },
  '6E92ZMYYFZ': { currencyCode: 'USD', units: 69, nanos: 950_000_000 },
};

const fallbackPrice: Money = { currencyCode: 'USD', units: 49, nanos: 0 };

async function localizedPrice(productId: string, currencyCode: string): Promise<Money> {
  // The Currency service is intentionally used for every domain price, including USD-to-USD.
  // This creates a truthful frontend-to-backend trace without touching the retail catalog.
  return CurrencyGateway.convert(prices[productId] || fallbackPrice, currencyCode || 'USD');
}

export async function getDomainRecord(
  industry: DomainIndustryId,
  productId: string,
  currencyCode = 'USD'
): Promise<Product> {
  const profile = getIndustry(industry);
  const presentation = profile.products[productId];

  return withDomainBackendSpan(industry, 'records', 'record_read', async () => ({
    id: productId,
    name: presentation?.name || `Demo ${profile.terminology.item}`,
    description: presentation?.description || `Additional ${profile.terminology.item} available in this demonstration.`,
    picture: presentation?.image || '',
    priceUsd: await localizedPrice(productId, currencyCode),
    categories: [presentation?.category || 'Additional item'],
  }), { 'app.record.id': productId });
}

export async function listDomainRecords(
  industry: DomainIndustryId,
  currencyCode = 'USD'
): Promise<Product[]> {
  const profile = getIndustry(industry);

  return withDomainBackendSpan(industry, 'records', 'records_list', () => Promise.all(
    profile.productOrder.map(productId => getDomainRecord(industry, productId, currencyCode))
  ));
}

export function baseDomainFee(industry: DomainIndustryId): Money {
  const amounts: Record<DomainIndustryId, Money> = {
    banking: { currencyCode: 'USD', units: 0, nanos: 0 },
    healthcare: { currencyCode: 'USD', units: 2, nanos: 500_000_000 },
    travel: { currencyCode: 'USD', units: 24, nanos: 0 },
    insurance: { currencyCode: 'USD', units: 0, nanos: 0 },
  };

  return amounts[industry];
}

export async function getDomainFee(industry: DomainIndustryId, currencyCode = 'USD'): Promise<Money> {
  return withDomainBackendSpan(
    industry,
    'fee_quote',
    'fee_calculation',
    () => CurrencyGateway.convert(baseDomainFee(industry), currencyCode || 'USD')
  );
}

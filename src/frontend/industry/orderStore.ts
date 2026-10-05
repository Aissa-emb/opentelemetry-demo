// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { IProductCheckout } from '../types/Cart';
import { IndustryId } from './types';

const RECEIPT_PREFIX = 'otel-demo-receipt';

function receiptKey(industry: IndustryId, orderId: string): string {
  return `${RECEIPT_PREFIX}:${industry}:${orderId}`;
}

function isReceipt(value: unknown, orderId: string): value is IProductCheckout {
  if (!value || typeof value !== 'object') return false;
  const receipt = value as Partial<IProductCheckout>;
  return receipt.orderId === orderId && Array.isArray(receipt.items) && Boolean(receipt.shippingCost);
}

export function storeIndustryReceipt(industry: IndustryId, order: IProductCheckout): void {
  if (typeof window === 'undefined' || !order.orderId) return;

  try {
    window.sessionStorage.setItem(receiptKey(industry, order.orderId), JSON.stringify(order));
  } catch {
    // The confirmation page will show a truthful unavailable state if storage is blocked.
  }
}

export function readIndustryReceipt(industry: IndustryId, orderId: string): IProductCheckout | null {
  if (typeof window === 'undefined') return null;

  try {
    const value = window.sessionStorage.getItem(receiptKey(industry, orderId));
    if (!value) return null;
    const parsed: unknown = JSON.parse(value);
    return isReceipt(parsed, orderId) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearIndustryReceipts(industry: IndustryId): void {
  if (typeof window === 'undefined') return;

  try {
    Object.keys(window.sessionStorage)
      .filter(key => key.startsWith(`${RECEIPT_PREFIX}:${industry}:`))
      .forEach(key => window.sessionStorage.removeItem(key));
  } catch {
    // Resetting the backend cart remains useful when browser storage is blocked.
  }
}

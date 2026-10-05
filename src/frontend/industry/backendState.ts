// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { CartItem } from '../protos/demo';

type DemoGlobal = typeof globalThis & {
  __otelIndustryDrafts?: Map<string, CartItem[]>;
};

const demoGlobal = globalThis as DemoGlobal;
const drafts = demoGlobal.__otelIndustryDrafts || new Map<string, CartItem[]>();
demoGlobal.__otelIndustryDrafts = drafts;

export function getDomainDraft(userId: string): CartItem[] {
  return [...(drafts.get(userId) || [])];
}

export function addDomainDraftItem(userId: string, item: CartItem): CartItem[] {
  const current = getDomainDraft(userId);
  const existing = current.find(value => value.productId === item.productId);

  if (existing) {
    existing.quantity += item.quantity;
  } else if (item.quantity > 0) {
    current.push({ ...item });
  }

  const next = current.filter(value => value.quantity > 0);
  drafts.set(userId, next);
  return [...next];
}

export function clearDomainDraft(userId: string): void {
  drafts.delete(userId);
}

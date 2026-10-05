// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { industryProfiles } from './profiles';
import { IndustryDefinition, IndustryId } from './types';

export const industryIds: IndustryId[] = ['astronomy', 'banking', 'healthcare', 'travel', 'insurance', 'ai'];

export const industryRegistry = industryProfiles.reduce<Record<IndustryId, IndustryDefinition>>(
  (registry, profile) => {
    registry[profile.id] = profile;
    return registry;
  },
  {} as Record<IndustryId, IndustryDefinition>
);

export const defaultIndustry = industryRegistry.astronomy;

export function isIndustryId(value: unknown): value is IndustryId {
  return typeof value === 'string' && industryIds.includes(value as IndustryId);
}

export function getIndustry(value: unknown): IndustryDefinition {
  return isIndustryId(value) ? industryRegistry[value] : defaultIndustry;
}

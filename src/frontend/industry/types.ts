// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

export type IndustryId = 'astronomy' | 'banking' | 'healthcare' | 'travel' | 'insurance' | 'ai';

export type ExperienceLayout = 'original' | 'retail' | 'portal' | 'editorial' | 'workspace';

export type ArtworkKind =
  | 'telescope'
  | 'headphones'
  | 'camera'
  | 'speaker'
  | 'watch'
  | 'utility'
  | 'card'
  | 'mobile'
  | 'insurance'
  | 'clinic'
  | 'dental'
  | 'therapy'
  | 'lab'
  | 'coast'
  | 'mountain'
  | 'city'
  | 'island'
  | 'laptop'
  | 'chair'
  | 'conference'
  | 'security'
  | 'auto'
  | 'home'
  | 'identity'
  | 'roadside';

export interface IndustryColors {
  accent: string;
  accentDark: string;
  accentSoft: string;
  background: string;
  border: string;
  ink: string;
  muted: string;
  surface: string;
}

export interface IndustryNavigationItem {
  label: string;
  anchor?: string;
}

export interface IndustryProductPresentation {
  artwork: ArtworkKind;
  category: string;
  description: string;
  eyebrow: string;
  image?: string;
  imagePosition?: string;
  name: string;
}

export interface IndustryStat {
  label: string;
  value: string;
  detail: string;
}

export interface IndustryActivity {
  title: string;
  detail: string;
  status: string;
}

export interface IndustryDefinition {
  id: IndustryId;
  displayName: string;
  description: string;
  brandName: string;
  brandMark: string;
  brandDescriptor?: string;
  heroImage?: string;
  layout: ExperienceLayout;
  colors: IndustryColors;
  navigation: IndustryNavigationItem[];
  hero: {
    kicker: string;
    title: string;
    description: string;
    action: string;
  };
  terminology: {
    item: string;
    items: string;
    collection: string;
    cart: string;
    cartEmpty: string;
    review: string;
    submit: string;
    clear: string;
    continue: string;
    confirmationTitle: string;
    confirmationDescription: string;
    fee: string;
  };
  primaryJourney: string;
  demoNotice: string;
  supportsQuantity: boolean;
  productOrder: string[];
  products: Record<string, IndustryProductPresentation>;
  stats: IndustryStat[];
  activity: IndustryActivity[];
}

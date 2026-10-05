// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { IndustryDefinition } from './types';

const productIds = {
  explorascope: 'OLJCESPC7Z',
  starsense: '66VCHSJNUP',
  travelScope: '1YMWWN1N4O',
  cleaningKit: 'L9ECAV7KIM',
  binoculars: '2ZYFJ3GM2N',
  imager: '0PUK6V6EV0',
  flashlight: 'LS4PSXUNUM',
  opticalTube: '9SIQT8TOJO',
  solarFilter: '6E92ZMYYFZ',
  cometBook: 'HQTGWGPNH4',
} as const;

const sharedProductOrder = Object.values(productIds);

export const astronomyProfile: IndustryDefinition = {
  id: 'astronomy',
  displayName: 'Astronomy',
  description: 'The original OpenTelemetry Astronomy Shop experience.',
  brandName: 'Astronomy Shop',
  brandMark: 'OT',
  layout: 'original',
  colors: {
    accent: '#5262a8', accentDark: '#343f78', accentSoft: '#eceefe', background: '#ffffff',
    border: '#d8dbea', ink: '#29293e', muted: '#78788c', surface: '#ffffff',
  },
  navigation: [{ label: 'Shop', anchor: 'hot-products' }],
  hero: {
    kicker: 'OpenTelemetry demo',
    title: 'The best telescopes to see the world closer',
    description: 'Explore the original observability demo storefront.',
    action: 'Go shopping',
  },
  terminology: {
    item: 'product', items: 'products', collection: 'Hot Products', cart: 'Shopping Cart',
    cartEmpty: 'Your shopping cart is empty', review: 'Shipping Address', submit: 'Place Order',
    clear: 'Empty Cart', continue: 'Continue Shopping', confirmationTitle: 'Your order is complete!',
    confirmationDescription: "We've sent you a confirmation email.", fee: 'Shipping',
  },
  primaryJourney: 'browse_to_purchase',
  demoNotice: 'This website is hosted for demo purposes only. It is not an actual shop.',
  supportsQuantity: true,
  productOrder: sharedProductOrder,
  products: {},
  stats: [],
  activity: [],
};

export const bankingProfile: IndustryDefinition = {
  id: 'banking',
  displayName: 'Banking',
  description: 'A secure personal finance dashboard for accounts, payments, and activity.',
  brandName: 'Harbor Financial',
  brandMark: 'HF',
  brandDescriptor: 'Personal banking',
  heroImage: '/industry/banking-hero.jpg',
  layout: 'portal',
  colors: {
    accent: '#1769aa', accentDark: '#0a3761', accentSoft: '#e4f1fb', background: '#f3f6f9',
    border: '#d4dee8', ink: '#10283d', muted: '#607487', surface: '#ffffff',
  },
  navigation: [{ label: 'Overview' }, { label: 'Payments', anchor: 'collection' }, { label: 'Activity', anchor: 'activity' }],
  hero: {
    kicker: 'Good afternoon, Jordan',
    title: 'Money management that feels effortless.',
    description: 'See every account, upcoming payment, and recent transaction in one secure financial home.',
    action: 'Make a payment',
  },
  terminology: {
    item: 'bill', items: 'bills', collection: 'Bills ready to pay', cart: 'Payment review',
    cartEmpty: 'No bills are selected for payment.', review: 'Payment authorization', submit: 'Authorize payment',
    clear: 'Remove selected bills', continue: 'Back to accounts', confirmationTitle: 'Payment submitted',
    confirmationDescription: 'The demo payment was accepted and a backend confirmation was returned.', fee: 'Processing and delivery fee',
  },
  primaryJourney: 'bill_payment',
  demoNotice: 'All balances, bills, and activity are fictional demo data. Harbor Financial is not a real bank.',
  supportsQuantity: false,
  productOrder: [productIds.explorascope, productIds.starsense, productIds.travelScope, productIds.binoculars],
  products: {
    [productIds.explorascope]: { name: 'Bay City Utilities', category: 'Utilities', eyebrow: 'Due Oct 18', artwork: 'utility', description: 'Synthetic electricity and water statement for the current demo billing cycle.' },
    [productIds.starsense]: { name: 'Harbor Rewards Card', category: 'Credit', eyebrow: 'Due Oct 22', artwork: 'card', description: 'Predefined demo card payment with a stable amount from the banking records response.' },
    [productIds.travelScope]: { name: 'Northline Mobile', category: 'Phone', eyebrow: 'Due Oct 26', artwork: 'mobile', description: 'Synthetic mobile service bill returned by the banking records response.' },
    [productIds.binoculars]: { name: 'Evergreen Auto Coverage', category: 'Insurance', eyebrow: 'Due Nov 1', artwork: 'insurance', description: 'Fictional monthly coverage bill for demonstrating a backend-connected payment.' },
  },
  stats: [
    { label: 'Everyday checking', value: '$8,420.16', detail: 'Synthetic available balance' },
    { label: 'Reserve savings', value: '$24,805.40', detail: 'Synthetic balance · 4.10% demo APY' },
    { label: 'Upcoming bills', value: '4', detail: 'Backend-priced payment options' },
  ],
  activity: [
    { title: 'Payroll deposit', detail: 'Oct 2 · Everyday checking', status: '+$3,240.00' },
    { title: 'Metro Market', detail: 'Oct 1 · Card ending 2048', status: '−$86.42' },
    { title: 'Savings transfer', detail: 'Sep 30 · Internal transfer', status: '−$500.00' },
  ],
};

export const healthcareProfile: IndustryDefinition = {
  id: 'healthcare',
  displayName: 'Healthcare',
  description: 'A patient portal for care, records, appointments, and billing.',
  brandName: 'Willow Health',
  brandMark: 'WH',
  brandDescriptor: 'Patient portal',
  heroImage: '/industry/healthcare-hero.jpg',
  layout: 'portal',
  colors: {
    accent: '#167a78', accentDark: '#0a4b4a', accentSoft: '#e1f3f0', background: '#f4f8f7',
    border: '#d3e3df', ink: '#193a39', muted: '#617b78', surface: '#ffffff',
  },
  navigation: [{ label: 'Patient home' }, { label: 'Billing', anchor: 'collection' }, { label: 'Care team', anchor: 'activity' }],
  hero: {
    kicker: 'Patient home',
    title: 'Your care, connected around you.',
    description: 'Manage appointments, connect with your care team, and review statements from one private patient home.',
    action: 'View my care',
  },
  terminology: {
    item: 'statement', items: 'statements', collection: 'Billing statements', cart: 'Payment review',
    cartEmpty: 'No statements are selected for payment.', review: 'Payment details', submit: 'Submit demo payment',
    clear: 'Remove statements', continue: 'Return to patient home', confirmationTitle: 'Payment received',
    confirmationDescription: 'The shared transaction service returned a successful confirmation.', fee: 'Statement service fee',
  },
  primaryJourney: 'patient_bill_payment',
  demoNotice: 'All patient, appointment, and billing information is fictional. Do not enter real health information.',
  supportsQuantity: false,
  productOrder: [productIds.explorascope, productIds.travelScope, productIds.cleaningKit, productIds.solarFilter],
  products: {
    [productIds.explorascope]: { name: 'Primary Care Visit', category: 'Office visit', eyebrow: 'Statement WH-1842', artwork: 'clinic', description: 'Synthetic patient responsibility for a fictional routine office visit.' },
    [productIds.travelScope]: { name: 'Diagnostic Imaging', category: 'Imaging', eyebrow: 'Statement WH-1904', artwork: 'lab', description: 'Fictional outpatient imaging statement mapped to the backend price without alteration.' },
    [productIds.cleaningKit]: { name: 'Laboratory Services', category: 'Laboratory', eyebrow: 'Statement WH-1921', artwork: 'lab', description: 'Synthetic routine laboratory balance for observability demonstration purposes.' },
    [productIds.solarFilter]: { name: 'Physical Therapy', category: 'Rehabilitation', eyebrow: 'Statement WH-1936', artwork: 'therapy', description: 'Fictional rehabilitation visit balance with no real patient or clinical data.' },
  },
  stats: [
    { label: 'Next appointment', value: 'Oct 14 · 9:30 AM', detail: 'Fictional appointment · North Clinic' },
    { label: 'Care team', value: '3 members', detail: 'Synthetic read-only context' },
    { label: 'Open statements', value: '4', detail: 'Supported demo payment options' },
  ],
  activity: [
    { title: 'Dr. Maya Chen', detail: 'Primary care · North Clinic', status: 'Care team' },
    { title: 'Jordan Rivera, PT', detail: 'Physical therapy · Wellness Center', status: 'Care team' },
    { title: 'Upcoming annual visit', detail: 'Oct 14 · 9:30 AM', status: 'Scheduled' },
  ],
};

export const travelProfile: IndustryDefinition = {
  id: 'travel',
  displayName: 'Travel',
  description: 'A flight search and booking experience with clear route comparisons.',
  brandName: 'Roam',
  brandMark: 'R',
  brandDescriptor: 'Flights & stays',
  heroImage: '/industry/travel-hero.jpg',
  layout: 'editorial',
  colors: {
    accent: '#b15c2c', accentDark: '#613016', accentSoft: '#f6eadf', background: '#f6f2e9',
    border: '#ddd3c3', ink: '#2e3029', muted: '#6e7166', surface: '#fffdf7',
  },
  navigation: [{ label: 'Flights', anchor: 'collection' }, { label: 'Stays' }, { label: 'Trips', anchor: 'activity' }],
  hero: {
    kicker: 'Search hundreds of routes',
    title: 'Go somewhere worth remembering.',
    description: 'Compare clear flight options, flexible dates, and trusted routes in one fast search.',
    action: 'Search flights',
  },
  terminology: {
    item: 'flight', items: 'flights', collection: 'Recommended flights', cart: 'Trip review',
    cartEmpty: 'No flight has been selected.', review: 'Traveler and payment details', submit: 'Confirm trip',
    clear: 'Remove flight', continue: 'Search more flights', confirmationTitle: 'Your trip is confirmed',
    confirmationDescription: 'The booking was accepted by the shared demo transaction service.', fee: 'Booking service fee',
  },
  primaryJourney: 'flight_search_booking',
  demoNotice: 'Roam is fictional. Routes, dates, fares, and availability are deterministic demo content—not live inventory.',
  supportsQuantity: false,
  productOrder: [productIds.travelScope, productIds.binoculars, productIds.starsense, productIds.imager],
  products: {
    [productIds.travelScope]: { name: 'CoastAir 218', category: 'Nonstop', eyebrow: 'JFK 8:10 AM → SFO 11:26 AM', artwork: 'coast', image: '/industry/travel-hero.jpg', imagePosition: '0% 0%', description: 'Morning nonstop with standard seat selection and one carry-on included.' },
    [productIds.binoculars]: { name: 'Summit 604', category: '1 stop', eyebrow: 'EWR 9:35 AM → SFO 2:18 PM', artwork: 'mountain', image: '/industry/travel-hero.jpg', imagePosition: '100% 100%', description: 'A flexible daytime itinerary with a short Denver connection and free changes.' },
    [productIds.starsense]: { name: 'Aster 441', category: 'Nonstop', eyebrow: 'JFK 1:20 PM → SFO 4:42 PM', artwork: 'city', image: '/industry/travel-hero.jpg', imagePosition: '100% 0%', description: 'An afternoon nonstop with streaming entertainment and advance seat selection.' },
    [productIds.imager]: { name: 'Horizon 907', category: '1 stop', eyebrow: 'LGA 3:45 PM → SFO 9:08 PM', artwork: 'island', image: '/industry/travel-hero.jpg', imagePosition: '0% 100%', description: 'An evening value fare with a relaxed connection and carry-on included.' },
  },
  stats: [
    { label: 'Popular route', value: 'NYC → SFO', detail: '4 curated demo itineraries' },
    { label: 'Flexible dates', value: 'Oct 18–25', detail: 'Deterministic search window' },
    { label: 'Price confidence', value: 'Fixed fares', detail: 'No live inventory calculations' },
  ],
  activity: [
    { title: 'San Francisco weekend guide', detail: 'Neighborhoods, food, and transit', status: 'City guide' },
    { title: 'Smart packing for the coast', detail: 'A carry-on checklist for changing weather', status: 'Travel tip' },
  ],
};

export const insuranceProfile: IndustryDefinition = {
  id: 'insurance',
  displayName: 'Insurance',
  description: 'A modern policyholder portal for coverage and claims.',
  brandName: 'Evergreen Mutual',
  brandMark: 'EM',
  brandDescriptor: 'Policyholder portal',
  heroImage: '/industry/insurance-hero.jpg',
  layout: 'portal',
  colors: {
    accent: '#1d6b57', accentDark: '#123f36', accentSoft: '#e2f1eb', background: '#f4f7f4',
    border: '#d3dfda', ink: '#18342d', muted: '#62766f', surface: '#ffffff',
  },
  navigation: [{ label: 'Overview' }, { label: 'Policies', anchor: 'collection' }, { label: 'Claims', anchor: 'activity' }],
  hero: {
    kicker: 'Welcome back, Taylor',
    title: 'Protection made easier to manage.',
    description: 'See your coverage, review renewal options, and start a claim from one dependable account.',
    action: 'Review coverage',
  },
  terminology: {
    item: 'coverage option', items: 'coverage options', collection: 'Policies and protection', cart: 'Coverage review',
    cartEmpty: 'No coverage option is selected for review.', review: 'Policy and payment details', submit: 'Confirm coverage',
    clear: 'Remove selection', continue: 'Return to policies', confirmationTitle: 'Coverage confirmed',
    confirmationDescription: 'The selected demo coverage was accepted and a confirmation was returned.', fee: 'Policy service fee',
  },
  primaryJourney: 'coverage_selection',
  demoNotice: 'Evergreen Mutual, policies, people, vehicles, properties, and claims are fictional. No real coverage is issued.',
  supportsQuantity: false,
  productOrder: [productIds.opticalTube, productIds.imager, productIds.binoculars, productIds.flashlight],
  products: {
    [productIds.opticalTube]: { name: 'Auto protection', category: 'Vehicle', eyebrow: 'Policy EM-4821 · Active', artwork: 'auto', description: 'Liability, collision, comprehensive, and roadside protection for a fictional family vehicle.' },
    [productIds.imager]: { name: 'Home protection', category: 'Property', eyebrow: 'Policy EM-1938 · Renews Nov 12', artwork: 'home', description: 'Dwelling, belongings, and personal liability coverage for a fictional primary residence.' },
    [productIds.binoculars]: { name: 'Identity restoration', category: 'Identity', eyebrow: 'Recommended add-on', artwork: 'identity', description: 'Monitoring and guided recovery support presented as an optional demo coverage selection.' },
    [productIds.flashlight]: { name: 'Roadside Plus', category: 'Mobility', eyebrow: 'Optional protection', artwork: 'roadside', description: 'Towing, battery assistance, lockout support, and trip interruption for the demo policy.' },
  },
  stats: [
    { label: 'Active policies', value: '2', detail: 'Auto and home protection' },
    { label: 'Next renewal', value: 'Nov 12', detail: 'Home policy · 39 days' },
    { label: 'Open claims', value: '0', detail: 'No action needed' },
  ],
  activity: [
    { title: 'Auto policy documents', detail: 'Updated Sep 28 · Policy EM-4821', status: 'Ready' },
    { title: 'Home renewal review', detail: 'Available Oct 18 · Policy EM-1938', status: 'Upcoming' },
    { title: 'Safe-driver review', detail: 'Completed Sep 12', status: 'Complete' },
  ],
};

export const aiProfile: IndustryDefinition = {
  id: 'ai',
  displayName: 'AI Assistant',
  description: 'A clean, conversational assistant for writing, planning, and everyday questions.',
  brandName: 'Meridian',
  brandMark: 'AI',
  brandDescriptor: 'AI assistant',
  layout: 'workspace',
  colors: {
    accent: '#171717', accentDark: '#000000', accentSoft: '#f1f1f1', background: '#f7f7f7',
    border: '#d4d4d4', ink: '#171717', muted: '#737373', surface: '#ffffff',
  },
  navigation: [{ label: 'Chat' }],
  hero: {
    kicker: 'Your local assistant',
    title: 'Where should we begin?',
    description: 'Plan, write, summarize, brainstorm, explain, and calculate without an external API key.',
    action: 'Start a chat',
  },
  terminology: {
    item: 'chat', items: 'chats', collection: 'Recent chats', cart: 'Conversation',
    cartEmpty: 'No messages yet.', review: 'Review response', submit: 'Send message',
    clear: 'New chat', continue: 'Return to chat', confirmationTitle: 'Response ready',
    confirmationDescription: 'A local response was generated.', fee: 'Not applicable',
  },
  primaryJourney: 'ai_assistant_chat',
  demoNotice: 'Meridian generates prompt-specific responses inside the demo with a deterministic programmatic engine. It uses no external model, account, or API key.',
  supportsQuantity: false,
  productOrder: [],
  products: {},
  stats: [],
  activity: [],
};

export const industryProfiles: IndustryDefinition[] = [
  astronomyProfile,
  bankingProfile,
  healthcareProfile,
  travelProfile,
  insuranceProfile,
  aiProfile,
];

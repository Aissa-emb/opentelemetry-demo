// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { resolveIndustry } from '../../industry/resolveIndustry';
import { industryFromPath } from '../../industry/routes';
import { CypressFields } from '../../utils/enums/CypressFields';

const experienceRoutes = {
  banking: { home: '/accounts', review: '/accounts/payments/review', confirmation: '/accounts/payments/confirmation/' },
  healthcare: { home: '/patient', review: '/patient/billing/review', confirmation: '/patient/billing/confirmation/' },
  travel: { home: '/flights', review: '/flights/trips/review', confirmation: '/flights/trips/confirmation/' },
  insurance: { home: '/policies', review: '/policies/coverage/review', confirmation: '/policies/coverage/confirmation/' },
} as const;

function expectProductionRequest(interception: Cypress.Interception) {
  expect(interception.request.url.toLowerCase()).not.to.contain('demo');
  expect(Object.keys(interception.request.headers).join(' ').toLowerCase()).not.to.contain('demo');
}

describe('Industry experience resolution', () => {
  it('accepts every supported industry and safely resolves unsupported values', () => {
    const supported = ['astronomy', 'banking', 'healthcare', 'travel', 'insurance', 'ai'];
    supported.forEach(industry => expect(resolveIndustry(industry)).to.equal(industry));
    expect(resolveIndustry(undefined)).to.equal('astronomy');
    expect(resolveIndustry('unsupported')).to.equal('astronomy');
    expect(resolveIndustry(['banking', 'travel'])).to.equal('astronomy');
    expect(resolveIndustry(['<script>', 'banking'])).to.equal('astronomy');
    expect(resolveIndustry('travel', 'banking')).to.equal('travel');
    expect(resolveIndustry('unsupported', 'healthcare')).to.equal('healthcare');
    expect(industryFromPath('/accounts/payments/review')).to.equal('banking');
    expect(industryFromPath('/chat')).to.equal('ai');
    expect(industryFromPath('/')).to.equal(undefined);
  });
});

describe('Industry experiences', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('always treats the root URL as the Astronomy Shop', () => {
    cy.visit('/chat');
    cy.get('[data-industry="ai"]').should('exist');
    cy.visit('/');
    cy.location('pathname').should('eq', '/');
    cy.location('search').should('eq', '');
    cy.get('[data-industry="astronomy"]').should('exist');
    cy.contains('The best telescopes to see the world closer').should('be.visible');
  });

  it('opens a direct banking link, keeps it through navigation and refresh, and renders a portal', () => {
    cy.visit('/accounts');
    cy.get('[data-industry="banking"]').should('exist');
    cy.contains('Harbor Financial').should('exist');
    cy.contains('Bills ready to pay').should('exist');
    cy.get(`[data-cy="${CypressFields.ProductCard}"]`).should('have.length', 4).first().click();
    cy.location('pathname').should('contain', '/accounts/bills/');
    cy.location('search').should('eq', '');
    cy.get(`[data-cy="${CypressFields.ProductDetail}"]`).should('exist');
    cy.reload();
    cy.get('[data-industry="banking"]').should('exist');
    cy.go('back');
    cy.location('pathname').should('eq', '/accounts');
    cy.get('[data-industry="banking"]').should('exist');
  });

  it('previews and applies a travel experience from accessible settings', () => {
    cy.visit('/');
    cy.get(`[data-cy="${CypressFields.IndustrySettings}"]`).click();
    cy.get('[role="dialog"]').should('be.visible').and('have.attr', 'aria-modal', 'true');
    cy.get(`[data-cy="${CypressFields.IndustryChoice}-travel"]`).click().should('have.attr', 'aria-pressed', 'true');
    cy.contains('Previewing Roam').should('exist');
    cy.get(`[data-cy="${CypressFields.IndustryApply}"]`).click();
    cy.location('pathname').should('eq', '/flights');
    cy.location('search').should('eq', '');
    cy.get('[data-industry="travel"]').should('exist');
    cy.contains('Recommended flights').should('exist');
  });

  it('updates a travel search and swaps the route', () => {
    const relativeDate = (days: number) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() + days);
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };
    const expectedDeparture = relativeDate(14);
    const expectedReturn = relativeDate(21);
    cy.intercept('GET', '/api/flights/search*').as('flightSearch');
    cy.visit('/flights');
    cy.wait('@flightSearch');
    cy.get('[aria-label="Departure date"]').should('have.value', expectedDeparture);
    cy.get('[aria-label="Return date"]').should('have.value', expectedReturn);
    cy.contains(`${expectedDeparture}–${expectedReturn}`).should('be.visible');
    cy.get('[aria-label="Origin"]').should('have.value', 'New York (NYC)');
    cy.get('[aria-label="Destination"]').should('have.value', 'San Francisco (SFO)');
    cy.get(`[data-cy="${CypressFields.TravelSwap}"]`).click();
    cy.get('[aria-label="Origin"]').should('have.value', 'San Francisco (SFO)');
    cy.get('[aria-label="Destination"]').should('have.value', 'New York (NYC)');
    cy.get('[aria-label="Travelers"]').select('2');
    cy.get(`[data-cy="${CypressFields.TravelSearch}"]`).click();
    cy.wait('@flightSearch').then(interception => {
      expectProductionRequest(interception);
      expect(interception.request.headers['x-app-operation']).to.equal('flight_search_submitted');
    });
    cy.contains('San Francisco (SFO) to New York (NYC)').should('be.visible');
    cy.contains('2 travelers · Economy').should('be.visible');
  });

  [
    { industry: 'banking', action: 'Move money', endpoint: '/api/accounts/service-requests*', submit: 'Schedule transfer', success: 'Transfer scheduled' },
    { industry: 'healthcare', action: 'Schedule a visit', endpoint: '/api/patient/requests*', submit: 'Request appointment', success: 'Appointment requested' },
    { industry: 'insurance', action: 'Start a claim', endpoint: '/api/policies/service-requests*', submit: 'Create claim draft', success: 'Claim draft created' },
    { industry: 'travel', action: 'Stays', endpoint: '/api/flights/service-requests*', submit: 'Search stays', success: 'Four stays found' },
  ].forEach(({ industry, action, endpoint, submit, success }) => {
    it(`completes a short guided ${industry} action`, () => {
      cy.intercept('POST', endpoint).as('guidedAction');
      cy.visit(experienceRoutes[industry as keyof typeof experienceRoutes].home);
      cy.contains('button', action).click();
      cy.get(`[data-cy="${CypressFields.IndustryAction}"]`).should('be.visible');
      cy.contains('button', submit).click();
      cy.wait('@guidedAction').then(interception => {
        expectProductionRequest(interception);
        expect(interception.request.headers['x-app-experience']).to.equal(industry);
        expect(interception.request.headers['x-app-backend-resource']).to.equal('guided_action');
        expect(interception.response?.statusCode).to.equal(200);
      });
      cy.get(`[data-cy="${CypressFields.IndustryActionComplete}"]`).should('contain', success);
      cy.contains('button', 'Done').click();
      cy.get(`[data-cy="${CypressFields.IndustryAction}"]`).should('not.exist');
    });
  });

  it('filters insurance coverage with a working search control', () => {
    cy.visit('/policies');
    cy.get(`[data-cy="${CypressFields.ProductCard}"]`).should('have.length', 4);
    cy.get(`[data-cy="${CypressFields.IndustrySearch}"]`).type('identity');
    cy.get(`[data-cy="${CypressFields.ProductCard}"]`).should('have.length', 1).and('contain', 'Identity restoration');
  });

  it('runs a prompt-specific backend AI chat', () => {
    cy.intercept('POST', '/api/chat/respond*').as('assistantResponse');
    cy.visit('/chat');
    cy.get('[data-industry="ai"]').should('exist');
    cy.contains('Meridian').should('be.visible');
    cy.contains('How can I help?').should('be.visible');
    cy.get(`[data-cy="${CypressFields.CartIcon}"]`).should('not.exist');
    cy.get(`[data-cy="${CypressFields.CurrencySwitcher}"]`).should('not.exist');
    cy.get(`[data-cy="${CypressFields.AiChatInput}"]`).type('Plan a customer workshop');
    cy.get(`[data-cy="${CypressFields.AiChatSend}"]`).click();
    cy.wait('@assistantResponse').then(interception => {
      expectProductionRequest(interception);
      expect(interception.request.headers['x-app-experience']).to.equal('ai');
      expect(interception.request.headers['x-app-operation']).to.equal('ai_prompt_submitted');
      expect(interception.request.headers['x-app-backend-resource']).to.equal('assistant_response');
      expect(interception.response?.statusCode).to.equal(200);
    });
    cy.contains('Thinking').should('be.visible');
    cy.wait(700);
    cy.contains('Thinking').should('be.visible');
    cy.contains('Here’s a practical plan for a customer workshop').should('be.visible');
    cy.contains('Define the outcome, audience, deadline').should('be.visible');
    cy.contains('Meridian can make mistakes').should('be.visible');
    cy.contains('button', 'New chat').click();
    cy.contains('New conversation started').should('be.visible');
    cy.contains('How can I help?').should('be.visible');
    cy.get(`[data-cy="${CypressFields.AiChatInput}"]`).should('be.focused').and('have.value', '');
  });

  it('resets Meridian locally without emitting a cart-service request', () => {
    const localApiRequests: string[] = [];
    cy.intercept('/api/**', request => {
      localApiRequests.push(new URL(request.url).pathname);
    });
    cy.visit('/chat');
    cy.get(`[data-cy="${CypressFields.IndustrySettings}"]:visible`).first().click();
    cy.contains('button', 'Reset current experience').click();
    cy.contains('AI Assistant conversation history reset.').should('be.visible');
    cy.then(() => {
      expect(localApiRequests).to.deep.equal([]);
    });
  });

  it('switches from Meridian to another experience through settings', () => {
    cy.visit('/chat');
    cy.get(`[data-cy="${CypressFields.IndustrySettings}"]:visible`).first().click();
    cy.get(`[data-cy="${CypressFields.IndustryChoice}-insurance"]`).click();
    cy.get(`[data-cy="${CypressFields.IndustryApply}"]`).click();
    cy.location('pathname').should('eq', '/policies');
    cy.location('search').should('eq', '');
    cy.get('[data-industry="insurance"]').should('exist');
  });

  it('uses distinct backend cart identities for different industries', () => {
    const observedUserIds: string[] = [];
    cy.intercept('POST', '/api/policies/coverage-selection*', request => {
      observedUserIds.push(request.body.userId);
    }).as('addInsuranceSelection');
    cy.intercept('POST', '/api/patient/payment-selection*', request => {
      observedUserIds.push(request.body.userId);
    }).as('addPatientSelection');

    cy.visit('/policies');
    cy.get(`[data-cy="${CypressFields.ProductCard}"]`).first().click();
    cy.get(`[data-cy="${CypressFields.ProductAddToCart}"]`).click();
    cy.wait('@addInsuranceSelection');

    cy.visit('/patient');
    cy.get(`[data-cy="${CypressFields.ProductCard}"]`).first().click();
    cy.get(`[data-cy="${CypressFields.ProductAddToCart}"]`).click();
    cy.wait('@addPatientSelection').then(() => {
      expect(observedUserIds).to.have.length(2);
      expect(observedUserIds[0]).to.match(/:insurance$/);
      expect(observedUserIds[1]).to.match(/:healthcare$/);
      expect(observedUserIds[0]).not.to.equal(observedUserIds[1]);
    });
  });

  it('shows a truthful records failure instead of an empty success', () => {
    cy.intercept('GET', '/api/flights/search*', { statusCode: 503, body: 'unavailable' }).as('recordsFailure');
    cy.visit('/flights');
    cy.wait('@recordsFailure');
    cy.contains('The requested records could not be loaded').should('be.visible');
    cy.contains('No matches').should('not.exist');
  });

  it('uses a neutral fallback for an unmapped direct product link', () => {
    cy.visit('/accounts/bills/HQTGWGPNH4');
    cy.get(`[data-cy="${CypressFields.ProductDetail}"]`).should('contain', 'Demo bill');
    cy.contains('The Comet Book').should('not.exist');
  });
});

describe('Backend-connected industry transactions', () => {
  const industries = [
    { industry: 'banking', list: '/api/accounts/bills*', selection: '/api/accounts/payment-selection*', transaction: '/api/accounts/payments*' },
    { industry: 'healthcare', list: '/api/patient/statements*', selection: '/api/patient/payment-selection*', transaction: '/api/patient/payments*' },
    { industry: 'travel', list: '/api/flights/search*', selection: '/api/flights/trip-selection*', transaction: '/api/flights/bookings*' },
    { industry: 'insurance', list: '/api/policies/coverage*', selection: '/api/policies/coverage-selection*', transaction: '/api/policies/confirmations*' },
  ] as const;

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  industries.forEach(({ industry, list, selection, transaction }) => {
    it(`completes the ${industry} primary journey with a backend receipt`, () => {
      cy.intercept('GET', list).as('loadDomainData');
      cy.intercept('POST', selection).as('addSelection');
      cy.intercept('POST', transaction).as('submitTransaction');
      const route = experienceRoutes[industry as keyof typeof experienceRoutes];
      cy.visit(route.home);
      cy.wait('@loadDomainData').then(interception => {
        expectProductionRequest(interception);
        expect(interception.request.headers['x-app-experience']).to.equal(industry);
        expect(interception.request.headers['x-app-backend-resource']).to.equal('records');
      });
      cy.get(`[data-cy="${CypressFields.ProductCard}"]`).first().click();
      cy.get(`[data-cy="${CypressFields.ProductAddToCart}"]`).click();
      cy.wait('@addSelection').then(interception => {
        expectProductionRequest(interception);
        expect(interception.request.headers['x-app-experience']).to.equal(industry);
        expect(interception.request.headers['x-app-backend-resource']).to.equal('selection');
        expect(interception.response?.statusCode).to.equal(200);
      });
      cy.location('pathname').should('eq', route.review);
      cy.get(`[data-cy="${CypressFields.CheckoutPlaceOrder}"]`).click();
      cy.wait('@submitTransaction').then(interception => {
        expectProductionRequest(interception);
        expect(interception.request.headers['x-app-experience']).to.equal(industry);
        expect(interception.request.headers['x-app-backend-resource']).to.equal('transaction');
        expect(interception.request.headers['x-session-id']).to.be.a('string').and.not.be.empty;
        expect(interception.request.headers['x-enduser-id']).to.match(new RegExp(`:${industry}$`));
        expect(interception.response?.statusCode).to.equal(200);
      });
      cy.location('pathname').should('contain', route.confirmation);
      cy.location('search').should('eq', '');
      cy.get(`[data-cy="${CypressFields.CheckoutItem}"]`).should('have.length.at.least', 1);
      cy.contains('Confirmation reference:').should('be.visible');
    });
  });

  it('does not render a travel confirmation when checkout fails', () => {
    cy.intercept('POST', '/api/flights/trip-selection*').as('addSelection');
    cy.intercept('POST', '/api/flights/bookings*', { statusCode: 503, body: 'payment unavailable', delay: 500 }).as('submitTransaction');
    cy.visit('/flights');
    cy.get(`[data-cy="${CypressFields.ProductCard}"]`).first().click();
    cy.get(`[data-cy="${CypressFields.ProductAddToCart}"]`).click();
    cy.wait('@addSelection');
    cy.get(`[data-cy="${CypressFields.CheckoutPlaceOrder}"]`).click().should('be.disabled');
    cy.get(`[data-cy="${CypressFields.IndustrySettings}"]`).click();
    cy.get(`[data-cy="${CypressFields.IndustryApply}"]`).should('be.disabled');
    cy.contains('button', 'Cancel').click();
    cy.wait('@submitTransaction');
    cy.location('pathname').should('eq', '/flights/trips/review');
    cy.contains('could not be confirmed').should('be.visible');
    cy.contains('Your journey is confirmed').should('not.exist');
  });
});

export {};

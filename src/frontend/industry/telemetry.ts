// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { Attributes, SpanStatusCode, context, propagation, trace } from '@opentelemetry/api';
import { addBreadcrumb, createEmbraceSpan, finishEmbraceSpan, logError, logInfo } from '../utils/embrace';
import { IndustryId } from './types';

const tracer = trace.getTracer('industry-experiences');

const stepVocabulary: Record<IndustryId, Record<string, string>> = {
  astronomy: {
    home_viewed: 'home_viewed', catalog_load: 'product_list_viewed', detail_load: 'product_viewed', selection_add: 'product_added_to_cart',
    cart_state_sync: 'shopping_cart_state_synced',
    cart_load: 'cart_viewed', fee_calculation: 'shipping_quote_calculated', transaction_submit: 'payment_submitted',
    confirmation_rendered: 'order_confirmed', confirmation_unavailable: 'order_confirmation_unavailable',
    draft_reset: 'shopping_cart_emptied', ad_load: 'store_ad_loaded', recommendations_load: 'product_recommendations_loaded', currency_load: 'supported_currencies_loaded',
  },
  banking: {
    home_viewed: 'banking_dashboard_viewed', records_load: 'bills_list_viewed', detail_load: 'bill_details_viewed', selection_add: 'bill_selected_for_payment',
    selection_state_sync: 'payment_selection_state_synced',
    review_load: 'payment_review_viewed', fee_calculation: 'payment_delivery_fee_calculated', transaction_submit: 'bill_payment_submitted',
    confirmation_rendered: 'payment_confirmation_viewed', confirmation_unavailable: 'payment_confirmation_unavailable',
    draft_reset: 'payment_selection_cleared', guidance_load: 'financial_guidance_loaded', related_records_load: 'related_bills_loaded',
    guided_action_open: 'banking_action_opened', guided_action_complete: 'banking_action_completed', currency_load: 'account_currencies_loaded',
  },
  healthcare: {
    home_viewed: 'patient_home_viewed', records_load: 'billing_statements_viewed', detail_load: 'patient_statement_viewed', selection_add: 'statement_selected_for_payment',
    selection_state_sync: 'statement_selection_state_synced',
    review_load: 'patient_payment_review_viewed', fee_calculation: 'statement_service_fee_calculated', transaction_submit: 'patient_payment_submitted',
    confirmation_rendered: 'patient_payment_receipt_viewed', confirmation_unavailable: 'patient_payment_receipt_unavailable',
    draft_reset: 'statement_selection_cleared', guidance_load: 'patient_resources_loaded', related_records_load: 'related_statements_loaded',
    guided_action_open: 'patient_action_opened', guided_action_complete: 'patient_action_completed', currency_load: 'patient_currencies_loaded',
  },
  travel: {
    home_viewed: 'flight_search_home_viewed', records_load: 'flight_results_viewed', detail_load: 'flight_itinerary_viewed', selection_add: 'flight_selected',
    selection_state_sync: 'trip_selection_state_synced',
    review_load: 'trip_review_viewed', fee_calculation: 'booking_fee_calculated', transaction_submit: 'flight_booking_submitted',
    confirmation_rendered: 'booking_confirmation_viewed', confirmation_unavailable: 'booking_confirmation_unavailable',
    draft_reset: 'flight_selection_cleared', guidance_load: 'travel_offer_loaded', related_records_load: 'alternate_flights_loaded',
    search_submit: 'flight_search_submitted', route_swap: 'flight_route_swapped',
    guided_action_open: 'travel_action_opened', guided_action_complete: 'travel_action_completed', currency_load: 'flight_currencies_loaded',
  },
  insurance: {
    home_viewed: 'policyholder_home_viewed', records_load: 'policy_coverage_list_viewed', detail_load: 'coverage_details_viewed', selection_add: 'coverage_selected',
    selection_state_sync: 'coverage_selection_state_synced',
    review_load: 'coverage_review_viewed', fee_calculation: 'policy_service_fee_calculated', transaction_submit: 'coverage_confirmation_submitted',
    confirmation_rendered: 'coverage_confirmation_viewed', confirmation_unavailable: 'coverage_confirmation_unavailable',
    draft_reset: 'coverage_selection_cleared', guidance_load: 'policy_guidance_loaded', related_records_load: 'related_coverage_loaded',
    guided_action_open: 'insurance_action_opened', guided_action_complete: 'insurance_action_completed', currency_load: 'policy_currencies_loaded',
  },
  ai: {
    chat_opened: 'ai_chat_opened', prompt_submitted: 'ai_prompt_submitted', response_completed: 'ai_response_generated',
    response_copied: 'ai_response_copied', new_chat_started: 'ai_new_chat_started', conversation_loaded: 'ai_conversation_loaded',
  },
};

export function experienceOperation(industry: IndustryId, step: string): string {
  return stepVocabulary[industry][step] || `${industry}_${step}`;
}

function startedOperation(industry: IndustryId, step: string): string | undefined {
  if (step !== 'transaction_submit') return undefined;
  return {
    astronomy: 'checkout_started',
    banking: 'bill_payment_authorization_started',
    healthcare: 'patient_payment_started',
    travel: 'flight_booking_started',
    insurance: 'coverage_confirmation_started',
    ai: 'ai_request_started',
  }[industry];
}

function failedOperation(industry: IndustryId, step: string, operation: string): string {
  if (step !== 'transaction_submit') return `${operation}_failed`;
  return {
    astronomy: 'checkout_failed',
    banking: 'bill_payment_failed',
    healthcare: 'patient_payment_failed',
    travel: 'flight_booking_failed',
    insurance: 'coverage_confirmation_failed',
    ai: 'ai_request_failed',
  }[industry];
}

function industryAttributes(industry: IndustryId, journey: string, step: string, attributes: Attributes = {}): Attributes {
  return {
    'app.experience.name': industry,
    'app.user_journey': journey,
    'app.workflow.step': step,
    'app.operation.name': experienceOperation(industry, step),
    ...attributes,
  };
}

function embraceAttributes(attributes: Attributes): Record<string, string | number | boolean | undefined> {
  return Object.entries(attributes).reduce<Record<string, string | number | boolean | undefined>>((result, [key, value]) => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') result[key] = value;
    return result;
  }, {});
}

export async function withIndustrySpan<T>(
  industry: IndustryId,
  journey: string,
  step: string,
  operation: () => Promise<T>,
  attributes: Attributes = {}
): Promise<T> {
  const telemetryOperation = experienceOperation(industry, step);
  const allAttributes = industryAttributes(industry, journey, step, attributes);
  const span = tracer.startSpan(`${industry}.${telemetryOperation}`, { attributes: allAttributes });
  const embraceSpan = createEmbraceSpan(`${industry}.${telemetryOperation}`, embraceAttributes(allAttributes));
  const startEvent = startedOperation(industry, step);
  if (startEvent) {
    addBreadcrumb(`${industry}.${startEvent}`);
    logInfo(`${industry}.${startEvent}`, embraceAttributes(allAttributes));
  }
  const baggage = (propagation.getBaggage(context.active()) || propagation.createBaggage())
    .setEntry('app.experience.name', { value: industry })
    .setEntry('app.user_journey', { value: journey })
    .setEntry('app.workflow.step', { value: step })
    .setEntry('app.operation.name', { value: telemetryOperation });
  const spanContext = trace.setSpan(propagation.setBaggage(context.active(), baggage), span);

  try {
    const result = await context.with(spanContext, operation);
    span.setStatus({ code: SpanStatusCode.OK });
    finishEmbraceSpan(embraceSpan, true);
    addBreadcrumb(`${industry}.${telemetryOperation}`);
    logInfo(`${industry}.${telemetryOperation}`, embraceAttributes(allAttributes));
    return result;
  } catch (error) {
    span.recordException(error as Error);
    span.setStatus({ code: SpanStatusCode.ERROR });
    finishEmbraceSpan(embraceSpan, false, error);
    const failureEvent = failedOperation(industry, step, telemetryOperation);
    addBreadcrumb(`${industry}.${failureEvent}`);
    logError(`${industry}.${failureEvent}`, embraceAttributes(allAttributes), error);
    throw error;
  } finally {
    span.end();
  }
}

export function recordIndustryEvent(
  industry: IndustryId,
  journey: string,
  step: string,
  attributes: Attributes = {}
): void {
  const telemetryOperation = experienceOperation(industry, step);
  const allAttributes = industryAttributes(industry, journey, step, attributes);
  const span = tracer.startSpan(`${industry}.${telemetryOperation}`, { attributes: allAttributes });
  span.setStatus({ code: SpanStatusCode.OK });
  span.end();
  const name = `${industry}.${telemetryOperation}`;
  addBreadcrumb(name);
  logInfo(name, embraceAttributes(allAttributes));
}

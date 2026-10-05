// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { initSDK } from '@embrace-io/web-sdk';
import type { ExtendedSpan } from '@embrace-io/web-sdk';
import { Span, SpanStatusCode, trace as otelTrace } from '@opentelemetry/api';

type AttributeValue = string | number | boolean;
export type EmbraceAttributes = Record<string, AttributeValue | undefined>;
type FrontendEnv = Record<string, string | undefined>;
type EmbraceSDK = Exclude<ReturnType<typeof initSDK>, false>;

export interface EmbraceSpanHandle {
  embraceSpan?: ExtendedSpan;
  otelSpan: Span;
  name: string;
}

const activeSpans = new Map<string, EmbraceSpanHandle>();
const tracerName = 'embrace-product-flows';
let sdk: EmbraceSDK | undefined;
let initialized = false;
let missingConfigWarningShown = false;

function getWindowEnv(): FrontendEnv {
  if (typeof window === 'undefined') return {};
  return ((window as Window & { ENV?: FrontendEnv }).ENV || {});
}

function readEnv(key: string): string {
  const windowValue = getWindowEnv()[key];
  if (windowValue) return windowValue;
  return typeof process !== 'undefined' ? process.env[key] || '' : '';
}

function getEmbraceConfig() {
  return {
    appId: readEnv('NEXT_PUBLIC_EMBRACE_APP_ID') || 'omhea',
    appVersion: readEnv('NEXT_PUBLIC_EMBRACE_APP_VERSION') || readEnv('NEXT_PUBLIC_APP_VERSION') || 'web-local',
    environment: readEnv('NEXT_PUBLIC_EMBRACE_ENVIRONMENT') || readEnv('NEXT_PUBLIC_PLATFORM') || 'local',
  };
}

function normalizeAttributes(attributes: EmbraceAttributes = {}): Record<string, AttributeValue> {
  return Object.entries(attributes).reduce<Record<string, AttributeValue>>((result, [key, value]) => {
    if (value !== undefined) result[key] = value;
    return result;
  }, {});
}

function normalizeSpanAttributes(attributes: EmbraceAttributes = {}): Record<string, string> {
  return Object.entries(attributes).reduce<Record<string, string>>((result, [key, value]) => {
    if (value !== undefined) result[key] = String(value);
    return result;
  }, {});
}

function storageValue(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export function initEmbrace(): boolean {
  if (initialized || typeof window === 'undefined') return initialized;
  const { appId, appVersion, environment } = getEmbraceConfig();

  if (!appId) {
    if (!missingConfigWarningShown) {
      console.warn('[embrace] NEXT_PUBLIC_EMBRACE_APP_ID not set; skipping Embrace Web SDK init');
      missingConfigWarningShown = true;
    }
    return false;
  }

  const result = initSDK({ appID: appId, appVersion, registerGlobally: false });
  if (!result) return false;

  sdk = result;
  initialized = true;
  const params = new URLSearchParams(window.location.search);
  const properties = {
    app_version: appVersion,
    environment,
    run_source: params.get('run_source') || storageValue('embrace_run_source', 'organic'),
    user_persona: params.get('persona') || storageValue('embrace_persona', 'visitor'),
  };
  Object.entries(properties).forEach(([key, value]) => setSessionProperty(key, value));
  return true;
}

export function setSessionProperty(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try { sdk?.session.addProperty(key, value); } catch { /* best effort */ }
}

export function addBreadcrumb(message: string): void {
  if (typeof window === 'undefined') return;
  try { sdk?.session.addBreadcrumb(message); } catch { /* best effort */ }
}

export function logInfo(message: string, attributes?: EmbraceAttributes): void {
  if (typeof window === 'undefined') return;
  try { sdk?.log.message(message, 'info', { attributes: normalizeAttributes(attributes) }); } catch { /* best effort */ }
}

export function logWarning(message: string, attributes?: EmbraceAttributes): void {
  if (typeof window === 'undefined') return;
  try { sdk?.log.message(message, 'warning', { attributes: normalizeAttributes(attributes) }); } catch { /* best effort */ }
}

export function logError(message: string, attributes?: EmbraceAttributes, error?: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    const normalized = normalizeAttributes(attributes);
    if (error) {
      sdk?.log.logException(error, { handled: true, attributes: { ...normalized, log_message: message } });
    } else {
      sdk?.log.message(message, 'error', { attributes: normalized, includeStacktrace: true });
    }
  } catch { /* best effort */ }
}

export function createEmbraceSpan(name: string, attributes?: EmbraceAttributes): EmbraceSpanHandle | undefined {
  if (typeof window === 'undefined') return undefined;
  const otelSpan = otelTrace.getTracer(tracerName).startSpan(name, { attributes: normalizeAttributes(attributes) });
  let embraceSpan: ExtendedSpan | undefined;
  try { embraceSpan = sdk?.trace.startSpan(name, { attributes: normalizeSpanAttributes(attributes) }); } catch { /* OTel remains */ }
  return { embraceSpan, otelSpan, name };
}

export function finishEmbraceSpan(handle: EmbraceSpanHandle | undefined, success = true, error?: unknown): void {
  if (!handle) return;
  const status = { code: success ? SpanStatusCode.OK : SpanStatusCode.ERROR, message: success ? undefined : `${handle.name} failed` };
  if (error) handle.otelSpan.recordException(error as Error);
  handle.otelSpan.setStatus(status);
  handle.otelSpan.end();
  try {
    if (success) handle.embraceSpan?.setStatus(status).end();
    else handle.embraceSpan?.setStatus(status).fail({ code: 'failure' });
  } catch { /* OTel span already ended */ }
}

export function startEmbraceSpan(name: string, attributes?: EmbraceAttributes): void {
  if (activeSpans.has(name)) return;
  const handle = createEmbraceSpan(name, attributes);
  if (handle) activeSpans.set(name, handle);
}

export function endEmbraceSpan(name: string, success = true): void {
  const handle = activeSpans.get(name);
  if (!handle) return;
  finishEmbraceSpan(handle, success);
  activeSpans.delete(name);
}

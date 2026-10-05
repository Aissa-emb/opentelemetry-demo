// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

/** @type {import('next').NextConfig} */

const dotEnv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const { resolve } = require('path');

const myEnv = dotEnv.config({
  path: resolve(__dirname, '../../.env'),
});
dotenvExpand.expand(myEnv);

const {
  AD_ADDR = '',
  CART_ADDR = '',
  CHECKOUT_ADDR = '',
  CURRENCY_ADDR = '',
  PAYMENT_ADDR = 'payment:50051',
  PRODUCT_CATALOG_ADDR = '',
  RECOMMENDATION_ADDR = '',
  SHIPPING_ADDR = '',
  ENV_PLATFORM = '',
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = '',
  OTEL_SERVICE_NAME = 'frontend',
  PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = '',
} = process.env;

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      { source: '/api/accounts/bills', destination: '/api/products' },
      { source: '/api/accounts/bills/:productId', destination: '/api/products/:productId' },
      { source: '/api/accounts/payment-selection', destination: '/api/cart' },
      { source: '/api/accounts/payments', destination: '/api/checkout' },
      { source: '/api/accounts/payment-fees', destination: '/api/shipping' },
      { source: '/api/accounts/related-bills', destination: '/api/recommendations' },
      { source: '/api/accounts/guidance', destination: '/api/data' },
      { source: '/api/accounts/currencies', destination: '/api/currency' },
      { source: '/api/accounts/service-requests', destination: '/api/experience/action' },
      { source: '/api/patient/statements', destination: '/api/products' },
      { source: '/api/patient/statements/:productId', destination: '/api/products/:productId' },
      { source: '/api/patient/payment-selection', destination: '/api/cart' },
      { source: '/api/patient/payments', destination: '/api/checkout' },
      { source: '/api/patient/service-fees', destination: '/api/shipping' },
      { source: '/api/patient/related-statements', destination: '/api/recommendations' },
      { source: '/api/patient/resources', destination: '/api/data' },
      { source: '/api/patient/currencies', destination: '/api/currency' },
      { source: '/api/patient/requests', destination: '/api/experience/action' },
      { source: '/api/flights/search', destination: '/api/products' },
      { source: '/api/flights/search/:productId', destination: '/api/products/:productId' },
      { source: '/api/flights/trip-selection', destination: '/api/cart' },
      { source: '/api/flights/bookings', destination: '/api/checkout' },
      { source: '/api/flights/booking-fees', destination: '/api/shipping' },
      { source: '/api/flights/alternatives', destination: '/api/recommendations' },
      { source: '/api/flights/offers', destination: '/api/data' },
      { source: '/api/flights/currencies', destination: '/api/currency' },
      { source: '/api/flights/service-requests', destination: '/api/experience/action' },
      { source: '/api/policies/coverage', destination: '/api/products' },
      { source: '/api/policies/coverage/:productId', destination: '/api/products/:productId' },
      { source: '/api/policies/coverage-selection', destination: '/api/cart' },
      { source: '/api/policies/confirmations', destination: '/api/checkout' },
      { source: '/api/policies/service-fees', destination: '/api/shipping' },
      { source: '/api/policies/related-coverage', destination: '/api/recommendations' },
      { source: '/api/policies/guidance', destination: '/api/data' },
      { source: '/api/policies/currencies', destination: '/api/currency' },
      { source: '/api/policies/service-requests', destination: '/api/experience/action' },
      { source: '/accounts', destination: '/?industry=banking' },
      { source: '/accounts/bills/:productId', destination: '/product/:productId?industry=banking' },
      { source: '/accounts/payments/review', destination: '/cart?industry=banking' },
      { source: '/accounts/payments/confirmation/:orderId', destination: '/cart/checkout/:orderId?industry=banking' },
      { source: '/patient', destination: '/?industry=healthcare' },
      { source: '/patient/statements/:productId', destination: '/product/:productId?industry=healthcare' },
      { source: '/patient/billing/review', destination: '/cart?industry=healthcare' },
      { source: '/patient/billing/confirmation/:orderId', destination: '/cart/checkout/:orderId?industry=healthcare' },
      { source: '/flights', destination: '/?industry=travel' },
      { source: '/flights/options/:productId', destination: '/product/:productId?industry=travel' },
      { source: '/flights/trips/review', destination: '/cart?industry=travel' },
      { source: '/flights/trips/confirmation/:orderId', destination: '/cart/checkout/:orderId?industry=travel' },
      { source: '/policies', destination: '/?industry=insurance' },
      { source: '/policies/coverage/review', destination: '/cart?industry=insurance' },
      { source: '/policies/coverage/confirmation/:orderId', destination: '/cart/checkout/:orderId?industry=insurance' },
      { source: '/policies/coverage/:productId', destination: '/product/:productId?industry=insurance' },
      { source: '/chat', destination: '/?industry=ai' },
    ];
  },
  compiler: {
    styledComponents: true,
  },
  // Turbopack configuration (Next.js 16 default bundler)
  // Turbopack automatically handles Node.js polyfills for client bundles
  turbopack: {
    // Set root to current directory to avoid confusion with parent lockfile
    root: __dirname,
  },
  // Keep webpack config for backwards compatibility if --webpack flag is used
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.http2 = false;
      config.resolve.fallback.tls = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.dns = false;
      config.resolve.fallback.fs = false;
    }

    return config;
  },
  env: {
    AD_ADDR,
    CART_ADDR,
    CHECKOUT_ADDR,
    CURRENCY_ADDR,
    PAYMENT_ADDR,
    PRODUCT_CATALOG_ADDR,
    RECOMMENDATION_ADDR,
    SHIPPING_ADDR,
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
    NEXT_PUBLIC_PLATFORM: ENV_PLATFORM,
    NEXT_PUBLIC_OTEL_SERVICE_NAME: OTEL_SERVICE_NAME,
    NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
  },
  images: {
    loader: "custom",
    loaderFile: "./utils/imageLoader.js"
  }
};

module.exports = nextConfig;

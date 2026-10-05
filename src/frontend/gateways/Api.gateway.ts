// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { Ad, Address, Cart, CartItem, Money, PlaceOrderRequest, Product } from '../protos/demo';
import { IProductCart, IProductCartItem, IProductCheckout } from '../types/Cart';
import request from '../utils/Request';
import { AttributeNames } from '../utils/enums/AttributeNames';
import SessionGateway from './Session.gateway';
import { context, propagation } from "@opentelemetry/api";
import { isIndustryId } from '../industry/registry';
import { AssistantResponse } from '../industry/aiAssistant';

interface AssistantMessage {
  role: 'assistant' | 'user';
  content: string;
}

export interface AssistantGatewayResponse {
  response: AssistantResponse;
  backend: 'agent' | 'embedded_backend' | 'agent_fallback';
}

const basePath = '/api';

const Apis = () => ({
  getCart(currencyCode: string, userId = SessionGateway.getSession().userId) {
    return request<IProductCart>({
      url: `${basePath}/cart`,
      queryParams: { sessionId: userId, currencyCode },
    });
  },
  addCartItem({ currencyCode, userId, ...item }: CartItem & { currencyCode: string; userId: string }) {
    return request<Cart>({
      url: `${basePath}/cart`,
      body: { item, userId },
      queryParams: { currencyCode },
      method: 'POST',
    });
  },
  emptyCart(userId = SessionGateway.getSession().userId) {
    return request<undefined>({
      url: `${basePath}/cart`,
      method: 'DELETE',
      body: { userId },
    });
  },

  getSupportedCurrencyList() {
    return request<string[]>({
      url: `${basePath}/currency`,
    });
  },

  getShippingCost(itemList: IProductCartItem[], currencyCode: string, address: Address) {
    return request<Money>({
      url: `${basePath}/shipping`,
      queryParams: {
        itemList: JSON.stringify(itemList.map(({ productId, quantity }) => ({ productId, quantity }))),
        currencyCode,
        address: JSON.stringify(address),
      },
    });
  },

  placeOrder({ currencyCode, ...order }: PlaceOrderRequest & { currencyCode: string }) {
    return request<IProductCheckout>({
      url: `${basePath}/checkout`,
      method: 'POST',
      queryParams: { currencyCode },
      body: order,
    });
  },

  listProducts(currencyCode: string) {
    return request<Product[]>({
      url: `${basePath}/products`,
      queryParams: { currencyCode },
    });
  },
  getProduct(productId: string, currencyCode: string) {
    return request<Product>({
      url: `${basePath}/products/${productId}`,
      queryParams: { currencyCode },
    });
  },
  listRecommendations(productIds: string[], currencyCode: string, userId = SessionGateway.getSession().userId) {
    return request<Product[]>({
      url: `${basePath}/recommendations`,
      queryParams: {
        productIds,
        sessionId: userId,
        currencyCode,
      },
    });
  },
  listAds(contextKeys: string[]) {
    return request<Ad[]>({
      url: `${basePath}/data`,
      queryParams: {
        contextKeys,
      },
    });
  },
  respondToAssistant(message: string, history: AssistantMessage[]) {
    return request<AssistantGatewayResponse>({
      url: `${basePath}/chat/respond`,
      body: { message, history },
      method: 'POST',
    });
  },
  completeGuidedAction(actionId: string, fields: Record<string, string>) {
    return request<{ eventId: string; notificationSent: boolean; status: 'accepted' }>({
      url: `${basePath}/experience/action`,
      body: { actionId, fields },
      method: 'POST',
    });
  },
});

/**
 * Extends all the API calls to set baggage automatically.
 */
const ApiGateway = new Proxy(Apis(), {
  get(target, prop, receiver) {
    const originalFunction = Reflect.get(target, prop, receiver);

    if (typeof originalFunction !== 'function') {
      return originalFunction;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (...args: any[]) {
      const { userId } = SessionGateway.getSession();
      const baggage = propagation.getActiveBaggage() || propagation.createBaggage();
      const industryValue = baggage.getEntry(AttributeNames.INDUSTRY)?.value;
      const effectiveUserId = industryValue && isIndustryId(industryValue)
        ? SessionGateway.getScopedCartUserId(industryValue)
        : userId;
      const newBaggage = baggage
        .setEntry(AttributeNames.SESSION_ID, { value: userId })
        .setEntry(AttributeNames.ENDUSER_ID, { value: effectiveUserId });
      const newContext = propagation.setBaggage(context.active(), newBaggage);
      return context.with(newContext, () => {
        return Reflect.apply(originalFunction, undefined, args);
      });
    };
  },
});

export default ApiGateway;

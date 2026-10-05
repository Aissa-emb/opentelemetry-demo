// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiGateway from '../gateways/Api.gateway';
import { CartItem, PlaceOrderRequest } from '../protos/demo';
import { IProductCart, IProductCheckout } from '../types/Cart';
import { useCurrency } from './Currency.provider';
import SessionGateway from '../gateways/Session.gateway';
import { useIndustry } from '../industry/IndustryProvider';
import { withIndustrySpan } from '../industry/telemetry';

interface IContext {
  cart: IProductCart;
  cartError: Error | null;
  effectiveUserId: string;
  isMutationPending: boolean;
  mutationError: Error | null;
  addItem(item: CartItem): Promise<unknown>;
  updateItemQuantity(productId: string, newQuantity: number): Promise<unknown>;
  emptyCart(): Promise<unknown>;
  resetExperience(): Promise<unknown>;
  placeOrder(order: PlaceOrderRequest): Promise<IProductCheckout>;
}

export const Context = createContext<IContext>({
  cart: { userId: '', items: [] },
  cartError: null,
  effectiveUserId: '',
  isMutationPending: false,
  mutationError: null,
  addItem: () => Promise.resolve(),
  updateItemQuantity: () => Promise.resolve(),
  emptyCart: () => Promise.resolve(),
  resetExperience: () => Promise.resolve(),
  placeOrder: () => Promise.resolve({} as IProductCheckout),
});

interface IProps {
  children: React.ReactNode;
}

export const useCart = () => useContext(Context);

const CartProvider = ({ children }: IProps) => {
  const { industry } = useIndustry();
  const { selectedCurrency } = useCurrency();
  const queryClient = useQueryClient();
  const [sessionUserId, setSessionUserId] = useState('');

  useEffect(() => {
    setSessionUserId(SessionGateway.getSession().userId);
  }, []);

  const effectiveUserId = sessionUserId
    ? (industry.id === 'astronomy' ? sessionUserId : `${sessionUserId}:${industry.id}`)
    : '';

  const cartQueryKey = useMemo(
    () => ['cart', industry.id, effectiveUserId, selectedCurrency],
    [effectiveUserId, industry.id, selectedCurrency]
  );
  const mutationOptions = useMemo(
    () => ({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: cartQueryKey });
      },
      retry: false,
    }),
    [cartQueryKey, queryClient]
  );

  const { data: cart = { userId: effectiveUserId, items: [] }, error: cartError } = useQuery({
    queryKey: cartQueryKey,
    queryFn: () => withIndustrySpan(
      industry.id,
      industry.primaryJourney,
      industry.id === 'astronomy' ? 'cart_state_sync' : 'selection_state_sync',
      () => ApiGateway.getCart(selectedCurrency, effectiveUserId)
    ),
    enabled: industry.id !== 'ai' && Boolean(effectiveUserId && selectedCurrency),
  });
  const addCartMutation = useMutation({
    mutationFn: (item: CartItem & { currencyCode: string; userId: string }) => withIndustrySpan(
      industry.id,
      industry.primaryJourney,
      'selection_add',
      () => ApiGateway.addCartItem(item),
      { [industry.id === 'astronomy' ? 'app.product.id' : 'app.record.id']: item.productId }
    ),
    ...mutationOptions,
  });

  const emptyCartMutation = useMutation({
    mutationFn: (userId: string) => withIndustrySpan(
      industry.id,
      industry.primaryJourney,
      'draft_reset',
      () => ApiGateway.emptyCart(userId)
    ),
    ...mutationOptions,
  });

  const placeOrderMutation = useMutation({
    mutationFn: (order: PlaceOrderRequest & { currencyCode: string }) => withIndustrySpan(
      industry.id,
      industry.primaryJourney,
      'transaction_submit',
      () => ApiGateway.placeOrder(order)
    ),
    ...mutationOptions,
  });

  const addItem = useCallback(
    (item: CartItem) => {
      if (!effectiveUserId) return Promise.reject(new Error('Session identity is not ready'));
      return addCartMutation.mutateAsync({ ...item, currencyCode: selectedCurrency, userId: effectiveUserId });
    },
    [addCartMutation, effectiveUserId, selectedCurrency]
  );

  const updateItemQuantity = useCallback(
    async (productId: string, newQuantity: number) => {
      const existing = cart.items.find(i => i.productId === productId);
      const delta = newQuantity - (existing?.quantity ?? 0);
      if (delta !== 0) {
        if (!effectiveUserId) return Promise.reject(new Error('Session identity is not ready'));
        return addCartMutation.mutateAsync({ productId, quantity: delta, currencyCode: selectedCurrency, userId: effectiveUserId });
      }
      return Promise.resolve();
    },
    [addCartMutation, cart.items, effectiveUserId, selectedCurrency]
  );
  const emptyCart = useCallback(() => {
    if (!effectiveUserId) return Promise.reject(new Error('Session identity is not ready'));
    return emptyCartMutation.mutateAsync(effectiveUserId);
  }, [effectiveUserId, emptyCartMutation]);
  const placeOrder = useCallback(
    (order: PlaceOrderRequest) => {
      if (!effectiveUserId) return Promise.reject(new Error('Session identity is not ready'));
      return placeOrderMutation.mutateAsync({ ...order, currencyCode: selectedCurrency });
    },
    [effectiveUserId, placeOrderMutation, selectedCurrency]
  );
  const isMutationPending = addCartMutation.isPending || emptyCartMutation.isPending || placeOrderMutation.isPending;
  const mutationError = addCartMutation.error || emptyCartMutation.error || placeOrderMutation.error;

  const value = useMemo(() => ({
    cart,
    cartError: cartError as Error | null,
    effectiveUserId,
    isMutationPending,
    mutationError,
    addItem,
    updateItemQuantity,
    emptyCart,
    resetExperience: emptyCart,
    placeOrder,
  }), [cart, cartError, effectiveUserId, isMutationPending, mutationError, addItem, updateItemQuantity, emptyCart, placeOrder]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default CartProvider;

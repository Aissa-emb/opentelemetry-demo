// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useState } from 'react';
import CartItems from '../CartItems';
import CheckoutForm from '../CheckoutForm';
import { IFormData } from '../CheckoutForm/CheckoutForm';
import { useCart } from '../../providers/Cart.provider';
import { useCurrency } from '../../providers/Currency.provider';
import * as S from '../../styles/Cart.styled';

const CartDetail = () => {
  const {
    cart: { items },
    effectiveUserId,
    emptyCart,
    isMutationPending,
    placeOrder,
  } = useCart();
  const { selectedCurrency } = useCurrency();
  const { push } = useRouter();
  const [submitError, setSubmitError] = useState('');

  const onPlaceOrder = useCallback(
    async ({
      email,
      state,
      streetAddress,
      country,
      city,
      zipCode,
      creditCardCvv,
      creditCardExpirationMonth,
      creditCardExpirationYear,
      creditCardNumber,
    }: IFormData) => {
      if (isMutationPending) return;
      setSubmitError('');
      try {
        const order = await placeOrder({
          userId: effectiveUserId,
          email,
          address: {
            streetAddress,
            state,
            country,
            city,
            zipCode,
          },
          userCurrency: selectedCurrency,
          creditCard: {
            creditCardCvv,
            creditCardExpirationMonth,
            creditCardExpirationYear,
            creditCardNumber,
          },
        });

        if (!order.orderId) throw new Error('Checkout response did not include an order ID');
        await push({
          pathname: `/cart/checkout/${order.orderId}`,
          query: { order: JSON.stringify(order) },
        });
      } catch {
        setSubmitError('The order could not be confirmed. No success receipt was created.');
      }
    },
    [effectiveUserId, isMutationPending, placeOrder, push, selectedCurrency]
  );

  return (
    <S.Container>
      <div>
        <S.Header>
          <S.CarTitle>Shopping Cart</S.CarTitle>
          <S.EmptyCartButton
            onClick={async () => {
              setSubmitError('');
              try {
                await emptyCart();
              } catch {
                setSubmitError('The cart could not be emptied. Its existing items are still shown.');
              }
            }}
            $type="link"
          >
            Empty Cart
          </S.EmptyCartButton>
        </S.Header>
        <CartItems productList={items} />
      </div>
      {submitError ? <S.ErrorMessage role="alert">{submitError}</S.ErrorMessage> : null}
      <CheckoutForm isSubmitting={isMutationPending} onSubmit={onPlaceOrder} />
    </S.Container>
  );
};

export default CartDetail;

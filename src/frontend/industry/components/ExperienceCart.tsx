// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import ApiGateway from '../../gateways/Api.gateway';
import ProductPrice from '../../components/ProductPrice';
import { useCart } from '../../providers/Cart.provider';
import { useCurrency } from '../../providers/Currency.provider';
import { Address, PlaceOrderRequest } from '../../protos/demo';
import { CypressFields } from '../../utils/enums/CypressFields';
import { useIndustry } from '../IndustryProvider';
import { presentProduct } from '../adapters/productPresentation';
import { addMoney, multiplyMoney } from '../money';
import { storeIndustryReceipt } from '../orderStore';
import { recordIndustryEvent, withIndustrySpan } from '../telemetry';
import ExperienceArtwork from './ExperienceArtwork';
import * as S from './IndustryExperience.styled';

const demoAddress: Address = {
  streetAddress: '1600 Amphitheatre Parkway',
  city: 'Mountain View',
  state: 'CA',
  country: 'United States',
  zipCode: '94043',
};

const demoCard = {
  creditCardNumber: '4432-8015-6152-0454',
  creditCardCvv: 672,
  creditCardExpirationYear: 2030,
  creditCardExpirationMonth: 1,
};

function CheckoutFields({ email, onEmailChange }: { email: string; onEmailChange(value: string): void }) {
  const { industry } = useIndustry();

  if (industry.id === 'banking') {
    return (
      <S.Field $colors={industry.colors}>Pay from
        <select defaultValue="checking-2048"><option value="checking-2048">Everyday checking ····2048</option></select>
      </S.Field>
    );
  }

  if (industry.id === 'healthcare') {
    return (
      <S.Field $colors={industry.colors}>Demo payment method
        <select defaultValue="card-0454"><option value="card-0454">Card ending 0454</option></select>
      </S.Field>
    );
  }

  if (industry.id === 'insurance') {
    return (
      <>
        <S.Field $colors={industry.colors}>Policyholder email
          <input onChange={event => onEmailChange(event.target.value)} required type="email" value={email} />
        </S.Field>
        <S.Field $colors={industry.colors}>Policy account
          <select defaultValue="policy-4821"><option value="policy-4821">Household account ····4821</option></select>
        </S.Field>
        <S.Field $colors={industry.colors}>Demo payment method
          <select defaultValue="card-0454"><option value="card-0454">Card ending 0454</option></select>
        </S.Field>
      </>
    );
  }

  return (
    <>
      <S.Field $colors={industry.colors}>{industry.id === 'travel' ? 'Traveler email' : 'Receipt email'}
        <input onChange={event => onEmailChange(event.target.value)} required type="email" value={email} />
      </S.Field>
      {industry.id !== 'travel' && (
        <S.Field $colors={industry.colors}>Delivery address
          <input readOnly value="1600 Amphitheatre Parkway, Mountain View, CA" />
        </S.Field>
      )}
      <S.Field $colors={industry.colors}>Demo payment method
        <select defaultValue="card-0454"><option value="card-0454">Card ending 0454</option></select>
      </S.Field>
    </>
  );
}

export default function ExperienceCart() {
  const router = useRouter();
  const { industry, industryHref } = useIndustry();
  const { selectedCurrency } = useCurrency();
  const {
    cart: { items },
    cartError,
    effectiveUserId,
    emptyCart,
    isMutationPending,
    mutationError,
    placeOrder,
    updateItemQuantity,
  } = useCart();
  const [email, setEmail] = useState('demo@example.com');
  const [submitError, setSubmitError] = useState('');
  useEffect(() => {
    recordIndustryEvent(industry.id, industry.primaryJourney, 'review_load');
  }, [industry.id, industry.primaryJourney]);
  const { data: shippingCost = { units: 0, nanos: 0, currencyCode: selectedCurrency }, error: shippingError } = useQuery({
    queryKey: ['shipping', industry.id, effectiveUserId, items, selectedCurrency, demoAddress],
    queryFn: () => withIndustrySpan(
      industry.id,
      industry.primaryJourney,
      'fee_calculation',
      () => ApiGateway.getShippingCost(items, selectedCurrency, demoAddress)
    ),
    enabled: Boolean(items.length && selectedCurrency && effectiveUserId),
  });
  const presentedItems = useMemo(
    () => items.map(item => ({ ...item, presented: presentProduct(item.product, industry) })),
    [industry, items]
  );
  const itemTotals = presentedItems.map(item => multiplyMoney(item.product.priceUsd!, item.quantity));
  const total = addMoney([...itemTotals, shippingCost], selectedCurrency || 'USD');

  if (cartError) {
    return (
      <S.Page $colors={industry.colors}><S.Content><S.Empty $colors={industry.colors}>
        <h1>{industry.terminology.cart} unavailable</h1>
        <p>The saved selection could not be loaded; no empty result is being reported as a success.</p>
        <S.PrimaryLink $colors={industry.colors} href={industryHref('/')}>Return home</S.PrimaryLink>
      </S.Empty></S.Content></S.Page>
    );
  }

  if (items.length === 0) {
    return (
      <S.Page $colors={industry.colors}><S.Content><S.Empty $colors={industry.colors}>
        <h1>{industry.terminology.cart}</h1>
        <p>{industry.terminology.cartEmpty}</p>
        <S.PrimaryLink $colors={industry.colors} href={industryHref('/')}>{industry.terminology.continue}</S.PrimaryLink>
      </S.Empty></S.Content></S.Page>
    );
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (isMutationPending) return;
    setSubmitError('');

    const order: PlaceOrderRequest = {
      userId: effectiveUserId,
      email,
      address: demoAddress,
      userCurrency: selectedCurrency,
      creditCard: demoCard,
    };

    try {
      const result = await placeOrder(order);
      if (!result.orderId) throw new Error('Checkout response did not include an order ID');
      storeIndustryReceipt(industry.id, result);
      await router.push(industryHref(`/cart/checkout/${result.orderId}`));
    } catch {
      setSubmitError(`The ${industry.primaryJourney.replaceAll('_', ' ')} could not be confirmed. The demo has not created a local success receipt.`);
    }
  };

  return (
    <S.Page $colors={industry.colors}>
      <S.Content>
        <S.CartLayout>
          <section>
            <S.CartHeading>
              <div><S.Kicker $colors={industry.colors}>Review</S.Kicker><h1>{industry.terminology.cart}</h1></div>
              <S.SecondaryButton
                $colors={industry.colors}
                disabled={isMutationPending}
                onClick={async () => {
                  setSubmitError('');
                  try {
                    await emptyCart();
                  } catch {
                    setSubmitError(`The ${industry.terminology.cart.toLowerCase()} could not be cleared.`);
                  }
                }}
                type="button"
              >
                {industry.terminology.clear}
              </S.SecondaryButton>
            </S.CartHeading>
            {presentedItems.map(({ productId, quantity, product, presented }) => (
              <S.LineItem $colors={industry.colors} key={productId} data-cy={CypressFields.CheckoutItem}>
                <S.MiniArtwork $colors={industry.colors}><ExperienceArtwork colors={industry.colors} image={presented.image} imagePosition={presented.imagePosition} kind={presented.artwork} /></S.MiniArtwork>
                <div><h3>{presented.name}</h3><p>{presented.category} · Reference {productId}</p></div>
                <S.LineActions>
                  <strong><ProductPrice price={multiplyMoney(product.priceUsd!, quantity)} /></strong>
                  {industry.supportsQuantity ? (
                    <S.Quantity
                      aria-label={`Quantity for ${presented.name}`}
                      $colors={industry.colors}
                      disabled={isMutationPending}
                      onChange={async event => {
                        setSubmitError('');
                        try {
                          await updateItemQuantity(productId, Number(event.target.value));
                        } catch {
                          setSubmitError(`The quantity for ${presented.name} could not be updated.`);
                        }
                      }}
                      value={quantity}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => <option key={value} value={value}>{value}</option>)}
                    </S.Quantity>
                  ) : <small>Quantity 1</small>}
                </S.LineActions>
              </S.LineItem>
            ))}
            <S.Notice $colors={industry.colors}>{industry.demoNotice}</S.Notice>
          </section>

          <S.Summary $colors={industry.colors}>
            <h2>{industry.terminology.review}</h2>
            <p>The frontend records layer, currency service, and payment service determine the final values and result.</p>
            <S.SummaryRow $colors={industry.colors}><span>{industry.terminology.items}</span><strong><ProductPrice price={addMoney(itemTotals, selectedCurrency)} /></strong></S.SummaryRow>
            <S.SummaryRow $colors={industry.colors}><span>{industry.terminology.fee}</span><strong>{shippingError ? 'Unavailable' : <ProductPrice price={shippingCost} />}</strong></S.SummaryRow>
            <S.SummaryRow $colors={industry.colors} $total><span>Total</span><strong><ProductPrice price={total} /></strong></S.SummaryRow>
            {shippingError ? <S.ErrorMessage role="alert">The required fee could not be calculated. Submission is disabled until the fee request recovers.</S.ErrorMessage> : null}
            {mutationError && !submitError ? <S.ErrorMessage role="alert">The latest selection action failed and was not recorded.</S.ErrorMessage> : null}
            {submitError ? <S.ErrorMessage role="alert">{submitError}</S.ErrorMessage> : null}
            <S.Form onSubmit={submit}>
              <CheckoutFields email={email} onEmailChange={setEmail} />
              <S.PrimaryButton
                $colors={industry.colors}
                data-cy={CypressFields.CheckoutPlaceOrder}
                disabled={isMutationPending || Boolean(shippingError)}
                type="submit"
              >
                {isMutationPending ? 'Submitting…' : industry.terminology.submit}
              </S.PrimaryButton>
            </S.Form>
          </S.Summary>
        </S.CartLayout>
      </S.Content>
    </S.Page>
  );
}

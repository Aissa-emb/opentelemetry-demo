// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import ProductPrice from '../../components/ProductPrice';
import { IProductCheckout } from '../../types/Cart';
import { CypressFields } from '../../utils/enums/CypressFields';
import { useIndustry } from '../IndustryProvider';
import { presentProduct } from '../adapters/productPresentation';
import { addMoney, multiplyMoney } from '../money';
import { readIndustryReceipt } from '../orderStore';
import { recordIndustryEvent } from '../telemetry';
import ExperienceArtwork from './ExperienceArtwork';
import * as S from './IndustryExperience.styled';

export default function ExperienceConfirmation() {
  const router = useRouter();
  const { industry, industryHref } = useIndustry();
  const orderId = Array.isArray(router.query.orderId) ? router.query.orderId[0] : router.query.orderId;
  const [receipt, setReceipt] = useState<IProductCheckout | null | undefined>(undefined);

  useEffect(() => {
    if (!orderId) return;
    const storedReceipt = readIndustryReceipt(industry.id, orderId);
    setReceipt(storedReceipt);
    recordIndustryEvent(industry.id, industry.primaryJourney, storedReceipt ? 'confirmation_rendered' : 'confirmation_unavailable', {
      'app.transaction.id': orderId,
    });
  }, [industry.id, industry.primaryJourney, orderId]);

  const total = useMemo(() => {
    if (!receipt) return null;
    const itemTotals = receipt.items.map(({ item, cost }) => multiplyMoney(cost!, item.quantity));
    return addMoney([...itemTotals, receipt.shippingCost!], receipt.shippingCost?.currencyCode || 'USD');
  }, [receipt]);

  if (receipt === undefined) {
    return <S.Page $colors={industry.colors}><S.Content><S.Loading>Loading backend confirmation…</S.Loading></S.Content></S.Page>;
  }

  if (!receipt || !total) {
    return (
      <S.Page $colors={industry.colors}><S.Content><S.Empty $colors={industry.colors}>
        <h1>Confirmation unavailable</h1>
        <p>The order reference is {orderId || 'unknown'}, but its tab-scoped receipt is unavailable. No replacement success was manufactured.</p>
        <S.PrimaryLink $colors={industry.colors} href={industryHref('/')}>{industry.terminology.continue}</S.PrimaryLink>
      </S.Empty></S.Content></S.Page>
    );
  }

  return (
    <S.Page $colors={industry.colors}>
      <S.Content>
        <S.ConfirmationHero $colors={industry.colors}>
          <S.Checkmark $colors={industry.colors} aria-hidden="true">✓</S.Checkmark>
          <h1>{industry.terminology.confirmationTitle}</h1>
          <p>{industry.terminology.confirmationDescription}</p>
          <S.Notice $colors={industry.colors}>Confirmation reference: {receipt.orderId}</S.Notice>
        </S.ConfirmationHero>
        <S.Receipt $colors={industry.colors}>
          <h2>Confirmed {industry.terminology.items}</h2>
          {receipt.items.map(({ item, cost }) => {
            const presented = presentProduct(item.product, industry);
            return (
              <S.LineItem $colors={industry.colors} data-cy={CypressFields.CheckoutItem} key={item.productId}>
                <S.MiniArtwork $colors={industry.colors}><ExperienceArtwork colors={industry.colors} image={presented.image} imagePosition={presented.imagePosition} kind={presented.artwork} /></S.MiniArtwork>
                <div><h3>{presented.name}</h3><p>Quantity {item.quantity} · Reference {item.productId}</p></div>
                <strong><ProductPrice price={multiplyMoney(cost!, item.quantity)} /></strong>
              </S.LineItem>
            );
          })}
          <S.SummaryRow $colors={industry.colors}><span>{industry.terminology.fee}</span><strong><ProductPrice price={receipt.shippingCost!} /></strong></S.SummaryRow>
          <S.SummaryRow $colors={industry.colors} $total><span>Confirmed total</span><strong><ProductPrice price={total} /></strong></S.SummaryRow>
          <S.ActionRow>
            <S.PrimaryLink $colors={industry.colors} href={industryHref('/')}>{industry.terminology.continue}</S.PrimaryLink>
          </S.ActionRow>
        </S.Receipt>
      </S.Content>
    </S.Page>
  );
}

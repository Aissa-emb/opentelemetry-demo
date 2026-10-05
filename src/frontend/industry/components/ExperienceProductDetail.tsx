// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import AdProvider from '../../providers/Ad.provider';
import { useAd } from '../../providers/Ad.provider';
import ApiGateway from '../../gateways/Api.gateway';
import ProductPrice from '../../components/ProductPrice';
import { useCart } from '../../providers/Cart.provider';
import { useCurrency } from '../../providers/Currency.provider';
import { CypressFields } from '../../utils/enums/CypressFields';
import { useIndustry } from '../IndustryProvider';
import { presentProduct, presentSupportedProducts } from '../adapters/productPresentation';
import { withIndustrySpan } from '../telemetry';
import ExperienceArtwork from './ExperienceArtwork';
import * as S from './IndustryExperience.styled';

function selectionLabel(industryId: string): string {
  if (industryId === 'banking') return 'Select bill for payment';
  if (industryId === 'healthcare') return 'Select statement';
  if (industryId === 'travel') return 'Select this flight';
  if (industryId === 'insurance') return 'Select coverage option';
  return 'Add to bag';
}

const experienceOfferCopy = {
  banking: {
    label: 'Account insight',
    text: 'Set up a balance alert before this payment is scheduled.',
  },
  healthcare: {
    label: 'Billing support',
    text: 'Payment-plan and coverage-support options are available for this statement.',
  },
  travel: {
    label: 'Trip update',
    text: 'Flexible change protection is available for this itinerary.',
  },
  insurance: {
    label: 'Protection review',
    text: 'A policy specialist can review related protection options with you.',
  },
} as const;

function ExperienceRecommendations() {
  const { recommendedProductList, adList } = useAd();
  const { industry, industryHref } = useIndustry();
  const recommendations = useMemo(
    () => presentSupportedProducts(recommendedProductList, industry).slice(0, 3),
    [industry, recommendedProductList]
  );
  const offer = industry.id === 'ai' || industry.id === 'astronomy' ? undefined : experienceOfferCopy[industry.id];

  if (recommendations.length === 0 && adList.length === 0) return null;

  return (
    <S.Section>
      <S.SectionHeader>
        <div>
          <h2>{industry.id === 'travel' ? 'Other flight options' : industry.id === 'insurance' ? 'More ways to protect what matters' : industry.layout === 'portal' ? 'Other supported payments' : 'You may also consider'}</h2>
          <p>{adList.length > 0 ? 'A relevant next step is available for this selection.' : 'Related options based on this selection.'}</p>
        </div>
      </S.SectionHeader>
      {adList[0]?.text && offer ? <S.AdCallout $colors={industry.colors}><strong>{offer.label}</strong>{offer.text}</S.AdCallout> : null}
      <S.ProductGrid $layout={industry.layout} data-cy={CypressFields.RecommendationList}>
        {recommendations.map(product => (
          <S.ProductLink href={industryHref(`/product/${product.id}`)} key={product.id}>
            <S.ProductCard $colors={industry.colors} $layout={industry.layout} data-cy={CypressFields.ProductCard}>
              <ExperienceArtwork colors={industry.colors} compact={industry.layout === 'portal' || industry.layout === 'workspace'} image={product.image} imagePosition={product.imagePosition} kind={product.artwork} />
              <S.CardBody $layout={industry.layout}><S.Eyebrow $colors={industry.colors}>{product.category}</S.Eyebrow><h3>{product.name}</h3></S.CardBody>
              <S.CardFooter $colors={industry.colors} $layout={industry.layout}><strong><ProductPrice price={product.backend.priceUsd!} /></strong><span>Review →</span></S.CardFooter>
            </S.ProductCard>
          </S.ProductLink>
        ))}
      </S.ProductGrid>
    </S.Section>
  );
}

export default function ExperienceProductDetail() {
  const router = useRouter();
  const productId = Array.isArray(router.query.productId) ? router.query.productId[0] : router.query.productId;
  const { industry, industryHref } = useIndustry();
  const { selectedCurrency } = useCurrency();
  const { addItem, isMutationPending } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [submitError, setSubmitError] = useState('');
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId, 'selectedCurrency', selectedCurrency, 'industry', industry.id],
    queryFn: () => withIndustrySpan(
      industry.id,
      industry.primaryJourney,
      'detail_load',
      () => ApiGateway.getProduct(productId!, selectedCurrency),
      { 'app.record.id': productId! }
    ),
    enabled: Boolean(productId && selectedCurrency),
  });

  useEffect(() => setQuantity(1), [productId]);

  if (error) {
    return <S.Page $colors={industry.colors}><S.Content><S.Empty $colors={industry.colors}><h1>Details unavailable</h1><p>The record request failed. Inspect the frontend records trace and try again.</p><S.PrimaryLink $colors={industry.colors} href={industryHref('/')}>Return home</S.PrimaryLink></S.Empty></S.Content></S.Page>;
  }

  if (isLoading || !product) {
    return <S.Page $colors={industry.colors}><S.Content><S.Loading>Loading {industry.terminology.item} details…</S.Loading></S.Content></S.Page>;
  }

  const presented = presentProduct(product, industry);

  return (
    <AdProvider productIds={[product.id]} contextKeys={product.categories || []}>
      <S.Page $colors={industry.colors} data-cy={CypressFields.ProductDetail}>
        <S.Content>
          <S.DetailGrid>
            <div data-cy={CypressFields.ProductPicture}>
              <ExperienceArtwork colors={industry.colors} image={presented.image} imagePosition={presented.imagePosition} kind={presented.artwork} large />
            </div>
            <S.DetailCopy>
              <S.Eyebrow $colors={industry.colors}>{presented.eyebrow}</S.Eyebrow>
              <h1 data-cy={CypressFields.ProductName}>{presented.name}</h1>
              <p data-cy={CypressFields.ProductDescription}>{presented.description}</p>
              <S.Notice $colors={industry.colors}>Reference number: {product.id}. The displayed amount reflects the current statement.</S.Notice>
              <S.Amount><ProductPrice price={product.priceUsd!} /></S.Amount>
              {submitError ? <S.ErrorMessage role="alert">{submitError}</S.ErrorMessage> : null}
              <S.ActionRow>
                {industry.supportsQuantity && (
                  <S.Quantity
                    aria-label="Quantity"
                    $colors={industry.colors}
                    data-cy={CypressFields.ProductQuantity}
                    onChange={event => setQuantity(Number(event.target.value))}
                    value={quantity}
                  >
                    {[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>{value}</option>)}
                  </S.Quantity>
                )}
                <S.PrimaryButton
                  $colors={industry.colors}
                  data-cy={CypressFields.ProductAddToCart}
                  disabled={isMutationPending}
                  onClick={async () => {
                    setSubmitError('');
                    try {
                      await addItem({ productId: product.id, quantity: industry.supportsQuantity ? quantity : 1 });
                      await router.push(industryHref('/cart'));
                    } catch {
                      setSubmitError(`This ${industry.terminology.item} could not be added. No successful selection has been recorded.`);
                    }
                  }}
                  type="button"
                >
                  {isMutationPending ? 'Adding…' : selectionLabel(industry.id)}
                </S.PrimaryButton>
              </S.ActionRow>
            </S.DetailCopy>
          </S.DetailGrid>
          <ExperienceRecommendations />
          <S.Notice $colors={industry.colors}>{industry.demoNotice}</S.Notice>
        </S.Content>
      </S.Page>
    </AdProvider>
  );
}

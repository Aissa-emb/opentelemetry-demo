// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Recommendations from '../../components/Recommendations';
import * as S from '../../styles/Cart.styled';
import CartDetail from '../../components/Cart/CartDetail';
import EmptyCart from '../../components/Cart/EmptyCart';
import { useCart } from '../../providers/Cart.provider';
import AdProvider from '../../providers/Ad.provider';
import { useIndustry } from '../../industry/IndustryProvider';
import ExperienceCart from '../../industry/components/ExperienceCart';
import { useEffect } from 'react';
import { recordIndustryEvent } from '../../industry/telemetry';

const AstronomyCart = () => {
  const {
    cart: { items },
  } = useCart();
  const { industry } = useIndustry();
  useEffect(() => {
    recordIndustryEvent(industry.id, industry.primaryJourney, 'cart_load');
  }, [industry.id, industry.primaryJourney]);

  return (
    <AdProvider
      productIds={items.map(({ productId }) => productId)}
      contextKeys={[...new Set(items.flatMap(({ product }) => product.categories))]}
    >
      <Head>
        <title>Otel Demo - Cart</title>
      </Head>
      <Layout>
        <S.Cart>
          {(!!items.length && <CartDetail />) || <EmptyCart />}
          <Recommendations />
        </S.Cart>
      </Layout>
    </AdProvider>
  );
};

const Cart: NextPage = () => {
  const { industry } = useIndustry();
  return industry.id === 'astronomy' ? <AstronomyCart /> : <Layout><Head><title>{industry.brandName} - {industry.terminology.cart}</title></Head><ExperienceCart /></Layout>;
};

export default Cart;

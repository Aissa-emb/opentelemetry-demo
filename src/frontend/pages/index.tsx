// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import ProductList from '../components/ProductList';
import * as S from '../styles/Home.styled';
import { useQuery } from '@tanstack/react-query';
import ApiGateway from '../gateways/Api.gateway';
import Banner from '../components/Banner';
import { CypressFields } from '../utils/enums/CypressFields';
import { useCurrency } from '../providers/Currency.provider';
import { useIndustry } from '../industry/IndustryProvider';
import ExperienceHome from '../industry/components/ExperienceHome';
import AIExperienceHome from '../industry/components/AIExperienceHome';
import { useEffect } from 'react';
import { recordIndustryEvent, withIndustrySpan } from '../industry/telemetry';

const AstronomyHome = () => {
  const { selectedCurrency } = useCurrency();
  const { industry } = useIndustry();
  useEffect(() => {
    recordIndustryEvent(industry.id, industry.primaryJourney, 'home_viewed');
  }, [industry.id, industry.primaryJourney]);
  const { data: productList = [] } = useQuery({
    queryKey: ['products', selectedCurrency],
    queryFn: () => withIndustrySpan(industry.id, industry.primaryJourney, 'catalog_load', () => ApiGateway.listProducts(selectedCurrency)),
  });

  return (
    <Layout>
      <Head>
        <title>Otel Demo - Home</title>
      </Head>
      <S.Home data-cy={CypressFields.HomePage}>
        <Banner />
        <S.Container>
          <S.Row>
            <S.Content>
              <S.HotProducts>
                <S.HotProductsTitle data-cy={CypressFields.HotProducts} id="hot-products">
                  Hot Products
                </S.HotProductsTitle>
                <ProductList productList={productList} />
              </S.HotProducts>
            </S.Content>
          </S.Row>
        </S.Container>
      </S.Home>
    </Layout>
  );
};

const Home: NextPage = () => {
  const { industry } = useIndustry();
  if (industry.id === 'astronomy') return <AstronomyHome />;

  return (
    <Layout>
      <Head>
        <title>{industry.brandName} - Home</title>
      </Head>
      {industry.id === 'ai' ? <AIExperienceHome /> : <ExperienceHome />}
    </Layout>
  );
};

export default Home;

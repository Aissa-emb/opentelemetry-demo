// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ApiGateway from '../gateways/Api.gateway';
import { Ad, Money, Product } from '../protos/demo';
import { useCurrency } from './Currency.provider';
import { useCart } from './Cart.provider';
import { useIndustry } from '../industry/IndustryProvider';
import { withIndustrySpan } from '../industry/telemetry';

interface IContext {
  recommendedProductList: Product[];
  adList: Ad[];
}

export const Context = createContext<IContext>({
  recommendedProductList: [],
  adList: [],
});

interface IProps {
  children: React.ReactNode;
  productIds: string[];
  contextKeys: string[];
}

export const useAd = () => useContext(Context);

const AdProvider = ({ children, productIds, contextKeys }: IProps) => {
  const { selectedCurrency } = useCurrency();
  const { effectiveUserId } = useCart();
  const { industry } = useIndustry();
  const { data: adList = [] } = useQuery({
    queryKey: ['ads', industry.id, contextKeys],
    queryFn: async () => {
      if (contextKeys.length === 0) {
        return [];
      } else {
        return withIndustrySpan(industry.id, industry.primaryJourney, industry.id === 'astronomy' ? 'ad_load' : 'guidance_load', () => ApiGateway.listAds(contextKeys));
      }
    },
    refetchOnWindowFocus: false,
  });
  const { data: recommendedProductList = [] } = useQuery({
    queryKey: ['recommendations', industry.id, effectiveUserId, productIds, 'selectedCurrency', selectedCurrency],
    queryFn: () => withIndustrySpan(
      industry.id,
      industry.primaryJourney,
      industry.id === 'astronomy' ? 'recommendations_load' : 'related_records_load',
      () => ApiGateway.listRecommendations(productIds, selectedCurrency, effectiveUserId)
    ),
    enabled: Boolean(effectiveUserId && selectedCurrency),
    refetchOnWindowFocus: false,
  });

  const value = useMemo(
    () => ({
      adList,
      recommendedProductList,
    }),
    [adList, recommendedProductList]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default AdProvider;

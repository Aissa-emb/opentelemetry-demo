// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ApiGateway from '../gateways/Api.gateway';
import SessionGateway from '../gateways/Session.gateway';
import { useIndustry } from '../industry/IndustryProvider';
import { withIndustrySpan } from '../industry/telemetry';

interface IContext {
  currencyCodeList: string[];
  setSelectedCurrency(currency: string): void;
  selectedCurrency: string;
}

export const Context = createContext<IContext>({
  currencyCodeList: [],
  selectedCurrency: 'USD',
  setSelectedCurrency: () => ({}),
});

interface IProps {
  children: React.ReactNode;
}

export const useCurrency = () => useContext(Context);

const CurrencyProvider = ({ children }: IProps) => {
  const { industry } = useIndustry();
  const { data: currencyCodeListUnsorted = [] } = useQuery({
    queryKey: ['currency', industry.id],
    queryFn: () => withIndustrySpan(
      industry.id,
      industry.primaryJourney,
      'currency_load',
      ApiGateway.getSupportedCurrencyList
    ),
    enabled: industry.id !== 'ai',
  });
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  useEffect(() => {
    setSelectedCurrency(SessionGateway.getSession().currencyCode);
  }, []);

  const onSelectCurrency = useCallback((currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    SessionGateway.setSessionValue('currencyCode', currencyCode);
  }, []);

  const currencyCodeList = currencyCodeListUnsorted.sort();

  const value = useMemo(
      () => ({
        currencyCodeList,
        selectedCurrency,
        setSelectedCurrency: onSelectCurrency,
      }),
      [currencyCodeList, selectedCurrency, onSelectCurrency]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default CurrencyProvider;

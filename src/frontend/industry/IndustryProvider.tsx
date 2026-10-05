// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { UrlObject } from 'url';
import { useRouter } from 'next/router';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getIndustry, isIndustryId } from './registry';
import { persistIndustry } from './resolveIndustry';
import { IndustryDefinition, IndustryId } from './types';
import { recordIndustryEvent } from './telemetry';
import { addBreadcrumb, setSessionProperty } from '../utils/embrace';
import { experienceHref, industryFromPath } from './routes';
import SessionGateway from '../gateways/Session.gateway';

interface IndustryContextValue {
  industry: IndustryDefinition;
  applyIndustry(industry: IndustryId): Promise<void>;
  industryHref(pathname: string, hash?: string): UrlObject;
}

const IndustryContext = createContext<IndustryContextValue>({
  industry: getIndustry('astronomy'),
  applyIndustry: async () => {},
  industryHref: pathname => ({ pathname }),
});

interface IndustryProviderProps {
  children: React.ReactNode;
  initialIndustry: IndustryId;
}

export const useIndustry = () => useContext(IndustryContext);

export default function IndustryProvider({ children, initialIndustry }: IndustryProviderProps) {
  const router = useRouter();
  const [activeIndustry, setActiveIndustry] = useState<IndustryId>(initialIndustry);

  useEffect(() => {
    const queryValue = typeof router.query.industry === 'string' ? router.query.industry : undefined;
    const pathValue = industryFromPath(router.asPath);
    const requestedIndustry = pathValue || (isIndustryId(queryValue) ? queryValue : undefined);

    if (requestedIndustry && requestedIndustry !== activeIndustry) {
      setActiveIndustry(requestedIndustry);
      persistIndustry(requestedIndustry);
    }

    if (!router.isReady || pathValue) return;

    const legacyPath = router.asPath.split(/[?#]/)[0] || '/';
    if (isIndustryId(queryValue)) {
      void router.replace(experienceHref(queryValue, legacyPath), undefined, { scroll: false });
    } else if (legacyPath === '/' && activeIndustry !== 'astronomy') {
      setActiveIndustry('astronomy');
      persistIndustry('astronomy');
    }
  }, [activeIndustry, router, router.asPath, router.isReady, router.query.industry]);

  useEffect(() => {
    persistIndustry(activeIndustry);
    const profile = getIndustry(activeIndustry);
    setSessionProperty('experience', profile.id);
    setSessionProperty('experience_name', profile.displayName);
    setSessionProperty('primary_journey', profile.primaryJourney);
    const { userId } = SessionGateway.getSession();
    setSessionProperty('session_id', userId);
    setSessionProperty('backend_user_id', SessionGateway.getScopedCartUserId(profile.id));
    addBreadcrumb(`${profile.id}.experience_activated`);
  }, [activeIndustry]);

  const industryHref = useCallback(
    (pathname: string, hash?: string): UrlObject => experienceHref(activeIndustry, pathname, hash),
    [activeIndustry]
  );

  const applyIndustry = useCallback(
    async (industry: IndustryId) => {
      recordIndustryEvent(activeIndustry, 'experience_switch', 'apply', {
        'app.experience.next': industry,
      });
      addBreadcrumb(`experience_switched.${activeIndustry}_to_${industry}`);
      persistIndustry(industry);
      setActiveIndustry(industry);
      await router.push(experienceHref(industry, '/'));
    },
    [activeIndustry, router]
  );

  const value = useMemo(
    () => ({
      industry: getIndustry(activeIndustry),
      applyIndustry,
      industryHref,
    }),
    [activeIndustry, applyIndustry, industryHref]
  );

  return <IndustryContext.Provider value={value}>{children}</IndustryContext.Provider>;
}

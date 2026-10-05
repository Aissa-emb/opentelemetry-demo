// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import CartIcon from '../CartIcon';
import CurrencySwitcher from '../CurrencySwitcher';
import IndustrySettings from '../../industry/components/IndustrySettings';
import { useIndustry } from '../../industry/IndustryProvider';
import * as S from './Header.styled';

const Header = () => {
  const { industry, industryHref } = useIndustry();
  const original = industry.id === 'astronomy';
  const aiExperience = industry.id === 'ai';

  return (
    <S.Header $colors={industry.colors}>
      <S.NavBar $colors={industry.colors} $original={original}>
        <S.Container>
          <S.NavBarBrand href={industryHref('/')}>
            {original ? <S.BrandImg /> : (
              <S.BrandLockup>
                <S.BrandMark $colors={industry.colors}>{industry.brandMark}</S.BrandMark>
                <S.BrandCopy><strong>{industry.brandName}</strong>{industry.brandDescriptor ? <small>{industry.brandDescriptor}</small> : null}</S.BrandCopy>
              </S.BrandLockup>
            )}
          </S.NavBarBrand>
          {!original && (
            <S.NavLinks aria-label={`${industry.displayName} navigation`}>
              {industry.navigation.map(item => (
                <S.NavLink href={industryHref('/', item.anchor)} key={item.label}>{item.label}</S.NavLink>
              ))}
            </S.NavLinks>
          )}
          <S.Controls>
            {!aiExperience ? <CurrencySwitcher /> : <S.EnvironmentBadge><i />Demo environment</S.EnvironmentBadge>}
            {!aiExperience ? <CartIcon /> : null}
            <IndustrySettings />
          </S.Controls>
        </S.Container>
      </S.NavBar>
    </S.Header>
  );
};

export default Header;

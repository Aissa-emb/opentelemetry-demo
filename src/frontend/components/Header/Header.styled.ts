// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link';
import styled from 'styled-components';
import { IndustryColors } from '../../industry/types';

export const Header = styled.header<{ $colors: IndustryColors }>`
  background-color: ${({ $colors }) => $colors.accentDark};
  color: white;
`;

export const NavBar = styled.nav<{ $colors: IndustryColors; $original: boolean }>`
  height: 80px;
  background-color: ${({ $colors }) => $colors.surface};
  font-size: 15px;
  color: ${({ $colors }) => $colors.ink};
  border-bottom: 1px solid ${({ $colors, $original, theme }) => $original ? theme.colors.textGray : $colors.border};
  z-index: 1;
  padding: 0;

  ${({ theme }) => theme.breakpoints.desktop} {
    height: 100px;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 18px clamp(30px, 6vw, 100px);
  }
`;

export const NavBarBrand = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0;
  color: inherit;
  text-decoration: none;
`;

export const BrandImg = styled.img.attrs({
  src: '/images/opentelemetry-demo-logo.png',
})`
  max-width: min(280px, 52vw);
  width: 280px;
  height: auto;
  @media (max-width: 480px) { max-width: 130px; }
`;

export const BrandLockup = styled.span`
  align-items: center;
  display: flex;
  gap: 11px;
`;

export const BrandMark = styled.span<{ $colors: IndustryColors }>`
  align-items: center;
  background: ${({ $colors }) => $colors.accent};
  border-radius: 9px;
  color: white;
  display: flex;
  font-size: 14px;
  height: 42px;
  justify-content: center;
  letter-spacing: .05em;
  width: 42px;
`;

export const BrandCopy = styled.span`
  display: flex;
  flex-direction: column;
  strong { font-size: 17px; }
  small { font-size: 10px; letter-spacing: .09em; opacity: .6; text-transform: uppercase; }
  @media (max-width: 480px) { display: none; }
`;

export const NavLinks = styled.div`
  align-items: center;
  display: flex;
  gap: 24px;
  margin: 0 auto 0 45px;
  @media (max-width: 900px) { display: none; }
`;

export const NavLink = styled(Link)`
  color: inherit;
  font-size: 13px;
  text-decoration: none;
  &:hover { text-decoration: underline; text-underline-offset: 5px; }
  &:focus-visible { outline: 3px solid #f0b34e; outline-offset: 4px; }
`;

export const Controls = styled.div`
  align-items: center;
  gap: 8px;
  display: flex;
  height: 60px;
  @media (max-width: 620px) { gap: 4px; }
`;

export const EnvironmentBadge = styled.span`
  align-items: center;
  background: #f6f5ff;
  border: 1px solid #dedbff;
  border-radius: 999px;
  color: #4d46bd;
  display: inline-flex;
  font-size: 12px;
  gap: 7px;
  padding: 8px 11px;
  white-space: nowrap;

  i {
    background: #32a071;
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgb(50 160 113 / 13%);
    height: 7px;
    width: 7px;
  }

  @media (max-width: 720px) { display: none; }
`;

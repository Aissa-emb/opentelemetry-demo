// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Image from 'next/image';
import styled from 'styled-components';

export const CartIcon = styled.button`
  background: transparent;
  border: 0;
  position: relative;
  display: block;
  margin-left: 25px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: 42px;
  min-width: 42px;
  &:focus-visible { outline: 3px solid #f0b34e; outline-offset: 2px; }
  @media (max-width: 620px) { margin-left: 4px; }
`;

export const Icon = styled(Image).attrs({
  width: '24',
  height: '24',
})`
  margin-bottom: 3px;
`;

export const ReviewIcon = styled.svg`
  fill: none;
  height: 25px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  width: 25px;
`;

export const ItemsCount = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 9px;
  left: 15px;
  width: 15px;
  height: 15px;
  font-size: ${({ theme }) => theme.sizes.nano};
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otelRed};
`;

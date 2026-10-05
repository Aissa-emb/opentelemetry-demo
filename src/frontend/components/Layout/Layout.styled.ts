// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { IndustryColors } from '../../industry/types';

export const Shell = styled.div<{ $colors: IndustryColors }>`
  --experience-accent: ${({ $colors }) => $colors.accent};
  --experience-background: ${({ $colors }) => $colors.background};
  --experience-ink: ${({ $colors }) => $colors.ink};
  background: ${({ $colors }) => $colors.background};
  color: ${({ $colors }) => $colors.ink};
  display: contents;
`;

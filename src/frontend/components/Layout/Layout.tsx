// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Header from '../Header';
import Footer from '../Footer';
import { useIndustry } from '../../industry/IndustryProvider';
import * as S from './Layout.styled';

interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps) => {
  const { industry } = useIndustry();
  return (
    <S.Shell $colors={industry.colors} data-industry={industry.id}>
      {industry.id !== 'ai' ? <Header /> : null}
      <main>{children}</main>
      {industry.id !== 'ai' ? <Footer /> : null}
    </S.Shell>
  );
};

export default Layout;

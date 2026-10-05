// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { useRouter } from 'next/router';
import { CypressFields } from '../../utils/enums/CypressFields';
import { useCart } from '../../providers/Cart.provider';
import CartDropdown from '../CartDropdown';
import * as S from './CartIcon.styled';
import { useIndustry } from '../../industry/IndustryProvider';

const CartIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { industry, industryHref } = useIndustry();
  const {
    cart: { items },
  } = useCart();

  return (
    <>
      <S.CartIcon
        aria-label={`Open ${industry.terminology.cart}`}
        data-cy={CypressFields.CartIcon}
        onClick={() => industry.id === 'astronomy' ? setIsOpen(true) : router.push(industryHref('/cart'))}
      >
        {industry.id === 'astronomy' ? (
          <S.Icon src="/icons/CartIcon.svg" alt="Cart icon" title="Cart" />
        ) : (
          <S.ReviewIcon aria-hidden="true" viewBox="0 0 24 24">
            <path d="M7 3h10l2 3v15H5V6l2-3Z" />
            <path d="M8 3v4h8V3M8.5 12h7M8.5 16h5" />
          </S.ReviewIcon>
        )}
        {!!items.length && <S.ItemsCount data-cy={CypressFields.CartItemCount}>{items.length}</S.ItemsCount>}
      </S.CartIcon>
      {industry.id === 'astronomy' ? <CartDropdown productList={items} isOpen={isOpen} onClose={() => setIsOpen(false)} /> : null}
    </>
  );
};

export default CartIcon;

// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { Product } from '../../protos/demo';
import { IndustryDefinition, IndustryProductPresentation } from '../types';

export interface PresentedProduct {
  backend: Product;
  id: string;
  name: string;
  description: string;
  category: string;
  eyebrow: string;
  artwork: IndustryProductPresentation['artwork'];
  image?: string;
  imagePosition?: string;
}

export function presentProduct(product: Product, industry: IndustryDefinition): PresentedProduct {
  const alias = industry.products[product.id];

  if (!alias) {
    return {
      backend: product,
      id: product.id,
      name: industry.id === 'astronomy' ? product.name : `Demo ${industry.terminology.item}`,
      description:
        industry.id === 'astronomy'
          ? product.description
          : `This backend-backed item is not part of the curated ${industry.displayName.toLowerCase()} presentation.`,
      category: industry.id === 'astronomy' ? product.categories[0] || 'Catalog' : 'Additional item',
      eyebrow: 'Additional record',
      artwork: 'telescope',
    };
  }

  return {
    backend: product,
    id: product.id,
    ...alias,
  };
}

export function presentSupportedProducts(products: Product[], industry: IndustryDefinition): PresentedProduct[] {
  const productsById = new Map(products.map(product => [product.id, product]));

  return industry.productOrder.flatMap(productId => {
    const product = productsById.get(productId);
    return product ? [presentProduct(product, industry)] : [];
  });
}

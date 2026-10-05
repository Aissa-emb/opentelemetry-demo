// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiHandler } from 'next';
import CartGateway from '../../gateways/rpc/Cart.gateway';
import { AddItemRequest, Empty } from '../../protos/demo';
import ProductCatalogService from '../../services/ProductCatalog.service';
import { IProductCart, IProductCartItem } from '../../types/Cart';
import InstrumentationMiddleware from '../../utils/telemetry/InstrumentationMiddleware';
import { requestDomainIndustry, withDomainBackendSpan } from '../../industry/backendContext';
import { getDomainRecord } from '../../industry/backendRecords';
import { addDomainDraftItem, clearDomainDraft, getDomainDraft } from '../../industry/backendState';

type TResponse = IProductCart | Empty;

const handler: NextApiHandler<TResponse> = async (request, res) => {
  const { method, body, query } = request;
  const domainIndustry = requestDomainIndustry(request);
  switch (method) {
    case 'GET': {
      const { sessionId = '', currencyCode = '' } = query;
      if (domainIndustry) {
        const userId = sessionId as string;
        const items = await withDomainBackendSpan(domainIndustry, 'workflow_state', 'draft_read', () => Promise.all(
          getDomainDraft(userId).map(async ({ productId, quantity }) => ({
            productId,
            quantity,
            product: await getDomainRecord(domainIndustry, productId, currencyCode as string),
          }))
        ));
        return res.status(200).json({ userId, items });
      }
      const { userId, items } = await CartGateway.getCart(sessionId as string);

      const productList: IProductCartItem[] = await Promise.all(
        items.map(async ({ productId, quantity }) => {
          const product = await ProductCatalogService.getProduct(productId, currencyCode as string);

          return {
            productId,
            quantity,
            product,
          };
        })
      );

      return res.status(200).json({ userId, items: productList });
    }

    case 'POST': {
      const { userId, item } = body as AddItemRequest;
      if (domainIndustry) {
        const items = await withDomainBackendSpan(domainIndustry, 'workflow_state', 'selection_save', () =>
          addDomainDraftItem(userId, item!)
        );
        return res.status(200).json({ userId, items });
      }

      await CartGateway.addItem(userId, item!);
      const cart = await CartGateway.getCart(userId);

      return res.status(200).json(cart);
    }

    case 'DELETE': {
      const { userId } = body as AddItemRequest;
      if (domainIndustry) {
        await withDomainBackendSpan(domainIndustry, 'workflow_state', 'draft_clear', () => clearDomainDraft(userId));
        return res.status(204).send('');
      }
      await CartGateway.emptyCart(userId);

      return res.status(204).send('');
    }

    default: {
      return res.status(405);
    }
  }
};

export default InstrumentationMiddleware(handler);

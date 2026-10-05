// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import InstrumentationMiddleware from '../../utils/telemetry/InstrumentationMiddleware';
import CheckoutGateway from '../../gateways/rpc/Checkout.gateway';
import { Empty, PlaceOrderRequest } from '../../protos/demo';
import { IProductCheckoutItem, IProductCheckout } from '../../types/Cart';
import ProductCatalogService from '../../services/ProductCatalog.service';
import { v4 as uuid } from 'uuid';
import { requestDomainIndustry, withDomainBackendSpan } from '../../industry/backendContext';
import { getDomainFee, getDomainRecord } from '../../industry/backendRecords';
import { clearDomainDraft, getDomainDraft } from '../../industry/backendState';
import PaymentGateway from '../../gateways/rpc/Payment.gateway';
import { addMoney, multiplyMoney } from '../../industry/money';

type TResponse = IProductCheckout | Empty;

const handler = async (request: NextApiRequest, res: NextApiResponse<TResponse>) => {
  const { method, body, query } = request;
  switch (method) {
    case 'POST': {
      const { currencyCode = '' } = query;
      const orderData = body as PlaceOrderRequest;
      const domainIndustry = requestDomainIndustry(request);
      if (domainIndustry) {
        const response = await withDomainBackendSpan(domainIndustry, 'transaction', 'transaction_execute', async () => {
          const draftItems = getDomainDraft(orderData.userId);
          if (draftItems.length === 0) throw new Error('The transaction draft is empty');

          const items: IProductCheckoutItem[] = await Promise.all(draftItems.map(async item => {
            const product = await getDomainRecord(domainIndustry, item.productId, currencyCode as string);
            return {
              item: { ...item, product },
              cost: product.priceUsd,
            };
          }));
          const fee = await getDomainFee(domainIndustry, currencyCode as string);
          const total = addMoney(
            [...items.map(item => multiplyMoney(item.cost!, item.item.quantity)), fee],
            currencyCode as string || 'USD'
          );
          const payment = await PaymentGateway.charge({ amount: total, creditCard: orderData.creditCard });
          const orderId = uuid();
          const order = {
            orderId,
            shippingTrackingId: payment.transactionId,
            shippingCost: fee,
            shippingAddress: orderData.address!,
            items,
          };

          clearDomainDraft(orderData.userId);
          return order;
        });

        return res.status(200).json(response);
      }
      const { order: { items = [], ...order } = {} } = await CheckoutGateway.placeOrder(orderData);

      const productList: IProductCheckoutItem[] = await Promise.all(
        items.map(async ({ item: { productId = '', quantity = 0 } = {}, cost }) => {
          const product = await ProductCatalogService.getProduct(productId, currencyCode as string);

          return {
            cost,
            item: {
              productId,
              quantity,
              product,
            },
          };
        })
      );

      return res.status(200).json({ ...order, items: productList });
    }

    default: {
      return res.status(405).send('');
    }
  }
};

export default InstrumentationMiddleware(handler);

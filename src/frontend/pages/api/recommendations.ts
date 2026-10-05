// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import InstrumentationMiddleware from '../../utils/telemetry/InstrumentationMiddleware';
import RecommendationsGateway from '../../gateways/rpc/Recommendations.gateway';
import { Empty, Product } from '../../protos/demo';
import ProductCatalogService from '../../services/ProductCatalog.service';
import { requestDomainIndustry, withDomainBackendSpan } from '../../industry/backendContext';
import { listDomainRecords } from '../../industry/backendRecords';

type TResponse = Product[] | Empty;

const handler = async (request: NextApiRequest, res: NextApiResponse<TResponse>) => {
  const { method, query } = request;
  switch (method) {
    case 'GET': {
      const { productIds = [], sessionId = '', currencyCode = '' } = query;
      const domainIndustry = requestDomainIndustry(request);
      if (domainIndustry) {
        const excluded = new Set(Array.isArray(productIds) ? productIds : [productIds]);
        const records = await withDomainBackendSpan(domainIndustry, 'related_records', 'related_records_list', async () =>
          (await listDomainRecords(domainIndustry, currencyCode as string))
            .filter(record => !excluded.has(record.id))
            .slice(0, 3)
        );
        return res.status(200).json(records);
      }
      const { productIds: productList } = await RecommendationsGateway.listRecommendations(
        sessionId as string,
        productIds as string[]
      );
      const recommendedProductList = await Promise.all(
        productList.slice(0, 4).map(id => ProductCatalogService.getProduct(id, currencyCode as string))
      );

      return res.status(200).json(recommendedProductList);
    }

    default: {
      return res.status(405).send('');
    }
  }
};

export default InstrumentationMiddleware(handler);

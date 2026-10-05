// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import InstrumentationMiddleware from '../../../../utils/telemetry/InstrumentationMiddleware';
import { Empty, Product } from '../../../../protos/demo';
import ProductCatalogService from '../../../../services/ProductCatalog.service';
import { requestDomainIndustry } from '../../../../industry/backendContext';
import { getDomainRecord } from '../../../../industry/backendRecords';

type TResponse = Product | Empty;

const handler = async (request: NextApiRequest, res: NextApiResponse<TResponse>) => {
  const { method, query } = request;
  switch (method) {
    case 'GET': {
      const { productId = '', currencyCode = '' } = query;
      const domainIndustry = requestDomainIndustry(request);
      if (domainIndustry) {
        return res.status(200).json(await getDomainRecord(domainIndustry, productId as string, currencyCode as string));
      }
      const product = await ProductCatalogService.getProduct(productId as string, currencyCode as string);

      return res.status(200).json(product);
    }

    default: {
      return res.status(405).send('');
    }
  }
};

export default InstrumentationMiddleware(handler);

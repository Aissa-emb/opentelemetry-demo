// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import InstrumentationMiddleware from '../../../utils/telemetry/InstrumentationMiddleware';
import { Empty, Product } from '../../../protos/demo';
import ProductCatalogService from '../../../services/ProductCatalog.service';

type TResponse = Product[] | Empty;

import { requestDomainIndustry } from '../../../industry/backendContext';
import { listDomainRecords } from '../../../industry/backendRecords';

const handler = async (request: NextApiRequest, res: NextApiResponse<TResponse>) => {
  const { method, query } = request;
  switch (method) {
    case 'GET': {
      const { currencyCode = '' } = query;
      const domainIndustry = requestDomainIndustry(request);
      if (domainIndustry) {
        return res.status(200).json(await listDomainRecords(domainIndustry, currencyCode as string));
      }
      const productList = await ProductCatalogService.listProducts(currencyCode as string);

      return res.status(200).json(productList);
    }

    default: {
      return res.status(405).send('');
    }
  }
};

export default InstrumentationMiddleware(handler);

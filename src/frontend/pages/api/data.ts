// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import InstrumentationMiddleware from '../../utils/telemetry/InstrumentationMiddleware';
import AdGateway from '../../gateways/rpc/Ad.gateway';
import { Ad, Empty } from '../../protos/demo';
import { requestDomainIndustry, withDomainBackendSpan } from '../../industry/backendContext';

type TResponse = Ad[] | Empty;

const handler = async (request: NextApiRequest, res: NextApiResponse<TResponse>) => {
  const { method, query } = request;
  switch (method) {
    case 'GET': {
      const domainIndustry = requestDomainIndustry(request);
      if (domainIndustry) {
        const guidance = await withDomainBackendSpan(domainIndustry, 'guidance', 'guidance_read', () => [{
          redirectUrl: '#',
          text: `${domainIndustry} guidance is available for this selection.`,
        }]);
        return res.status(200).json(guidance);
      }
      const { contextKeys = [] } = query;
      const { ads: adList } = await AdGateway.listAds(Array.isArray(contextKeys) ? contextKeys : contextKeys.split(','));

      return res.status(200).json(adList);
    }

    default: {
      return res.status(405).send('');
    }
  }
};

export default InstrumentationMiddleware(handler);

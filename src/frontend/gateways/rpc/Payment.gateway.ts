// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { ChannelCredentials } from '@grpc/grpc-js';
import { ChargeRequest, ChargeResponse, PaymentServiceClient } from '../../protos/demo';

const PAYMENT_ADDR = process.env.PAYMENT_ADDR || 'payment:50051';
const client = new PaymentServiceClient(PAYMENT_ADDR, ChannelCredentials.createInsecure());

const PaymentGateway = () => ({
  charge(request: ChargeRequest) {
    return new Promise<ChargeResponse>((resolve, reject) =>
      client.charge(request, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
});

export default PaymentGateway();

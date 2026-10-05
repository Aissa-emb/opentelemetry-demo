// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { Money } from '../protos/demo';

export function addMoney(values: Money[], currencyCode: string): Money {
  const totals = values.reduce(
    (sum, value) => ({
      units: sum.units + Number(value.units || 0),
      nanos: sum.nanos + Number(value.nanos || 0),
    }),
    { units: 0, nanos: 0 }
  );
  const carry = Math.floor(totals.nanos / 1_000_000_000);

  return {
    currencyCode,
    units: totals.units + carry,
    nanos: totals.nanos % 1_000_000_000,
  };
}

export function multiplyMoney(value: Money, quantity: number): Money {
  return addMoney(Array.from({ length: quantity }, () => value), value.currencyCode || 'USD');
}

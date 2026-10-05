// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

interface MeridianMarkProps {
  className?: string;
}

export default function MeridianMark({ className }: MeridianMarkProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 32 32">
      <rect fill="#fff" height="8" rx="2" width="8" x="19" y="5" />
      <rect fill="#fff" height="8" rx="2" width="8" x="5" y="19" />
    </svg>
  );
}

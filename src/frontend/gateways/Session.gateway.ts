// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { v4 } from 'uuid';

interface ISession {
  userId: string;
  currencyCode: string;
}

const sessionKey = 'session';
const defaultSession: Readonly<ISession> = Object.freeze({
  userId: v4(),
  currencyCode: 'USD',
});

const SessionGateway = () => ({
  getSession(): ISession {
    if (typeof window === 'undefined') return defaultSession;
    let sessionString: string | null = null;

    try {
      sessionString = localStorage.getItem(sessionKey);
    } catch {
      return defaultSession;
    }

    if (sessionString) {
      try {
        const parsed: unknown = JSON.parse(sessionString);
        if (isValid(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse session from localStorage', e);
      }
    }
    try {
      localStorage.setItem(sessionKey, JSON.stringify(defaultSession));
    } catch {
      return defaultSession;
    }
    return defaultSession;
  },
  setSessionValue<K extends keyof ISession>(key: K, value: ISession[K]) {
    const session = this.getSession();

    try {
      localStorage.setItem(sessionKey, JSON.stringify({ ...session, [key]: value }));
    } catch {
      // The in-memory default still allows explicit URL demo mode to work.
    }
  },
  getScopedCartUserId(industry: string): string {
    const { userId } = this.getSession();
    return industry === 'astronomy' ? userId : `${userId}:${industry}`;
  },
});

const isValid = (session: unknown): session is ISession => {
  return (
    typeof session === 'object' &&
    session !== null &&
    typeof (session as ISession).userId === 'string' &&
    typeof (session as ISession).currencyCode === 'string'
  );
};

export default SessionGateway();

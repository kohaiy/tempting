import { SyncAdapter } from '../types';

export const createMemoryAdapter = (): SyncAdapter => {
  const cache = new Map<string, { value: string; expireAt?: number }>();

  return {
    set(key: string, value: string, expireIn?: number): boolean {
      cache.set(key, {
        value,
        expireAt: expireIn ? Date.now() + expireIn * 1000 : undefined,
      });
      return true;
    },
    get(key: string): string | null {
      const obj = cache.get(key);
      if (
        (obj?.expireAt && obj.expireAt > Date.now()) ||
        (obj?.expireAt === undefined && obj)
      )
        return obj.value;
      cache.delete(key);
      return null;
    },
    del(key) {
      cache.delete(key);
      return true;
    },
  };
};

import { Adapter, SyncAdapter, SyncTempting, Tempting } from './types';
export * from './adapter';

export const createTempting = (adapter: Adapter): Tempting => {
  return {
    set(key, value, expireIn?) {
      return adapter.set(key, JSON.stringify(value), expireIn);
    },
    async get(key) {
      const value = await adapter.get(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    },
    del(key) {
      return adapter.del(key);
    },
  };
};

export const createSyncTempting = (adapter: SyncAdapter): SyncTempting => {
  return {
    set(key, value, expireIn?) {
      return adapter.set(key, JSON.stringify(value), expireIn);
    },
    get(key) {
      const value = adapter.get(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    },
    del(key) {
      return adapter.del(key);
    },
  };
};

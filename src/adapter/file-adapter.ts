import { promises as fs, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { Adapter } from '../types';

interface Options {
  dirPath: string;
}

interface StorageType {
  value: string;
  expireAt?: number;
}

const initialize = async (dirPath: string, cache: Map<string, StorageType>) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath);
  }
  const files = await fs.readdir(dirPath);
  return Promise.all(
    files.map(async file => {
      const str = (await fs.readFile(path.join(dirPath, file))).toString();
      const data: StorageType = JSON.parse(str);
      if (data?.expireAt && data.expireAt < Date.now()) {
        if (existsSync(path.join(dirPath, file)))
          await fs.rm(path.join(dirPath, file));
        return;
      }
      cache.set(file, data);
    })
  );
};

export const createFileAdapter = (opts: Options): Adapter => {
  const { dirPath } = opts;
  const cache = new Map<string, StorageType>();
  const initializePromise = initialize(dirPath, cache);

  return {
    async set(key: string, value: string, expireIn?: number) {
      await initializePromise;
      const data = {
        value,
        expireAt: expireIn ? Date.now() + expireIn * 1000 : undefined,
      };
      cache.set(key, data);
      await fs.writeFile(path.join(dirPath, key), JSON.stringify(data));
      return true;
    },
    async get(key: string) {
      await initializePromise;
      const obj = cache.get(key);
      if (
        (obj?.expireAt && obj.expireAt > Date.now()) ||
        (obj?.expireAt === undefined && obj)
      )
        return obj.value;
      cache.delete(key);
      if (existsSync(path.join(dirPath, key)))
        await fs.rm(path.join(dirPath, key));
      return null;
    },
    async del(key) {
      cache.delete(key);
      if (existsSync(path.join(dirPath, key)))
        await fs.rm(path.join(dirPath, key));
      return true;
    },
  };
};

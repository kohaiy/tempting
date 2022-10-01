import { promises as fs, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { Adapter } from '../types';

interface Options {
  dirPath: string;
}

const initialize = async (
  dirPath: string,
  cache: Map<string, { value: string; expireAt?: number }>
) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath);
  }
  const files = await fs.readdir(dirPath);
  files.map(async file => {
    const data = (await fs.readFile(path.join(dirPath, file))).toString();
    cache.set(file, JSON.parse(data));
  });
};

export const createFileAdapter = (opts: Options): Adapter => {
  const { dirPath } = opts;
  const cache = new Map<string, { value: string; expireAt?: number }>();
  initialize(dirPath, cache);

  return {
    async set(key: string, value: string, expireIn?: number) {
      const data = {
        value,
        expireAt: expireIn ? Date.now() + expireIn * 1000 : undefined,
      };
      cache.set(key, data);
      await fs.writeFile(path.join(dirPath, key), JSON.stringify(data));
      return true;
    },
    async get(key: string) {
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
  };
};

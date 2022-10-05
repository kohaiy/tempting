# Tempting

Save your temporary data in memory, databases (Redis, MySQL, etc.), and even files (under improvement).

## Install

```bash
npm install tempting
```

## API

```ts
export interface Adapter {
  set(key: string, value: string, expireIn?: number): Promise<boolean>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<boolean>;
}
export interface SyncAdapter {
  set(key: string, value: string, expireIn?: number): boolean;
  get(key: string): string | null;
  del(key: string): boolean;
}

export interface Tempting {
  set<T = string>(key: string, value: T, expireIn?: number): Promise<boolean>;
  get<T = string>(key: string): Promise<T | null>;
  del(key: string): Promise<boolean>;
}
export interface SyncTempting {
  set<T = string>(key: string, value: T, expireIn?: number): boolean;
  get<T = string>(key: string): T | null;
  del(key: string): boolean;
}
```

## Usage

```ts
import { createTempting, createFileAdapter } from 'tempting';

const temp = createTempting(createFileAdapter({ dirPath: './cache' }));

temp.set('name', 'value');
temp.get('name').then((value) => {
  console.log(value);
});

// set expire time
temp.set('token', 'value', 60);
temp.get('token').then((value) => {
  // will get null after 60s
  console.log(value);
});
```

The above is asynchronous storage, and the following is synchronous storage.

```ts
import { createSyncTempting, createMemoryAdapter } from 'tempting';

const temp = createSyncTempting(createMemoryAdapter());

temp.set('name', 'value');
console.log(temp.get('name'));

// set expire time
temp.set('token', 'value', 60);
// will get null after 60s
console.log(temp.get('token'));
```

## License

MIT
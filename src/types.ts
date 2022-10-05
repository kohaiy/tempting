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

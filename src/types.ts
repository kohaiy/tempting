export interface Adapter {
  set(key: string, value: string, expireIn?: number): Promise<boolean>;
  get(key: string): Promise<string | null>;
}
export interface SyncAdapter {
  set(key: string, value: string, expireIn?: number): boolean;
  get(key: string): string | null;
}

export interface Tempting {
  set<T>(key: string, value: T, expireIn?: number): Promise<boolean>;
  get<T>(key: string): Promise<T | null>;
}
export interface SyncTempting {
  set<T>(key: string, value: T, expireIn?: number): boolean;
  get<T>(key: string): T | null;
}

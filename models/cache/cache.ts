import JsCache from 'js-cache';

declare type CacheEvent = 'set' | 'set:<$KEY>' | 'update' | 'update:<$KEY>' | 'del' | 'del:<$KEY>' |'clear' | string;

declare type Cache<T> = {
  new <T>(): Cache<T>;
  set: (key: string, value: T, ttl?: number) => void;
  get: (key: string, callback?: () => void) => T | undefined;
  del: (key: string) => boolean;
  clear: () => number;
  size: () => number;
  debug: () => unknown;
  keys: () => number[];
  on: (event: CacheEvent, callback: (key: string, value: T, ttl?: number) => void) => void;
}

export default JsCache as Cache<any>;
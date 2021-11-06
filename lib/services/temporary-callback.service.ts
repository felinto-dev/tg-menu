import { uuid } from 'uuidv4';
import { Cache } from 'cache-manager';
import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';

@Injectable()
export class TemporaryCallbackService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCallback(callbackData: string, ttl: number) {
    const key = uuid();
    await this.cacheManager.set(key, callbackData, {
      ttl,
    });
    return key;
  }

  async getCallback(key: string) {
    return this.cacheManager.get(key);
  }
}

import * as crypto from 'crypto';
import { Cache } from 'cache-manager';
import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';

@Injectable()
export class TemporaryCallbackService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCallback(callbackData: string) {
    const key = crypto.createHash('sha256').update(callbackData).digest('hex');
    await this.cacheManager.set(key, callbackData);
    return key;
  }

  async getCallback(key: string) {
    return this.cacheManager.get(key);
  }
}

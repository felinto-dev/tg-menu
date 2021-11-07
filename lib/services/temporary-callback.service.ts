import * as crypto from 'crypto';
import { Cache } from 'cache-manager';
import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';

@Injectable()
export class TemporaryCallbackService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private readonly EXPIRES_IN = 60 * 60 * 24 * 14; // 14 days

  async setCallback(callbackData: string) {
    const key = crypto.createHash('sha256').update(callbackData).digest('hex');
    await this.cacheManager.set(key, callbackData, { ttl: this.EXPIRES_IN });
    return key;
  }

  async getCallback(key: string) {
    const callbackData = await this.cacheManager.get(key);
    await this.cacheManager.set(key, callbackData, { ttl: this.EXPIRES_IN });
    return callbackData;
  }
}

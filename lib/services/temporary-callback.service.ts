import { v4 as uuidV4 } from 'uuid';
import { Cache } from 'cache-manager';
import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { TEMPORARY_CALLBACK_METADATA } from '../consts';

@Injectable()
export class TemporaryCallbackService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCallback(callbackData: string) {
    const key = `${TEMPORARY_CALLBACK_METADATA}_${uuidV4()}`;
    await this.cacheManager.set(key, callbackData);
    return key;
  }

  async getCallback(key: string) {
    return this.cacheManager.get(key);
  }
}

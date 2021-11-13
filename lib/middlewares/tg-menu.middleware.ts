/* eslint-disable dot-notation */
import { Injectable } from '@nestjs/common';

import { TemporaryCallbackService } from '../services/temporary-callback.service';
import { TGMenuContext } from '../interfaces/telegraf-context.interface';

@Injectable()
export class TGMenuMiddleware {
  constructor(private readonly cbService: TemporaryCallbackService) {}

  async processTemporaryCallbackQuery(ctx: TGMenuContext) {
    if (ctx.callbackQuery?.['data']?.match(/\b[A-Fa-f0-9]{64}\b/)) {
      ctx.callbackQuery['data'] = await this.cbService.getCallback(
        ctx.callbackQuery['data'],
      );
    }
  }

  middleware = () => async (ctx: TGMenuContext, next) => {
    if (ctx.callbackQuery) {
      await this.processTemporaryCallbackQuery(ctx);
    }

    await next();
  };
}

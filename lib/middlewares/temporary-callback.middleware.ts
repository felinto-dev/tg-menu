/* eslint-disable dot-notation */
import { Injectable } from '@nestjs/common';

import { TemporaryCallbackService } from '../services/temporary-callback.service';
import { TGMenuContext } from '../interfaces/telegraf-context.interface';

@Injectable()
export class TemporaryCallbackMiddleware {
  constructor(
    private readonly temporaryCallbackService: TemporaryCallbackService,
  ) {}

  middleware = () => async (ctx: TGMenuContext, next) => {
    if (
      ctx.callbackQuery &&
      (ctx.callbackQuery['data'] as string).match(/\b[A-Fa-f0-9]{64}\b/)
    ) {
      ctx.callbackQuery['data'] =
        await this.temporaryCallbackService.getCallback(
          ctx.callbackQuery['data'],
        );
    }

    await next();
  };
}

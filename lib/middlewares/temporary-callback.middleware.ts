/* eslint-disable dot-notation */
import { Injectable } from '@nestjs/common';

import { TemporaryCallbackService } from '../services/temporary-callback.service';
import { TGMenuContext } from '../interfaces/telegraf-context.interface';
import { TEMPORARY_CALLBACK_METADATA } from '../consts';

@Injectable()
export class TemporaryCallbackMiddleware {
  constructor(
    private readonly temporaryCallbackService: TemporaryCallbackService,
  ) {}

  middleware = () => async (ctx: TGMenuContext, next) => {
    if (
      ctx.callbackQuery &&
      ctx.callbackQuery['data'].startsWith(TEMPORARY_CALLBACK_METADATA)
    ) {
      ctx.callbackQuery['data'] =
        await this.temporaryCallbackService.getCallback(
          ctx.callbackQuery['data'],
        );
    }

    await next();
  };
}

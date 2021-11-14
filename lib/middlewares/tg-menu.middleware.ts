/* eslint-disable dot-notation */
import { deunionize } from 'telegraf';
import { Injectable } from '@nestjs/common';

import { MenuHistoryService } from '../services/menu-history.service';
import { TemporaryCallbackService } from '../services/temporary-callback.service';
import { TGMenuContext } from '../interfaces/telegraf-context.interface';

@Injectable()
export class TGMenuMiddleware {
  constructor(
    private readonly cbService: TemporaryCallbackService,
    private readonly menuHistoryService: MenuHistoryService,
  ) {}

  async processTemporaryCallbackQuery(ctx: TGMenuContext) {
    if (deunionize(ctx.callbackQuery).data.match(/\b[A-Fa-f0-9]{64}\b/)) {
      ctx.callbackQuery['data'] = await this.cbService.getCallback(
        deunionize(ctx.callbackQuery).data,
      );
    }
  }

  middleware = () => async (ctx: TGMenuContext, next) => {
    const isCallbackQuery = !!ctx.callbackQuery;
    const isCommand =
      deunionize(ctx.message)?.entities &&
      deunionize(ctx.message).entities.some(
        (entity) => entity.type === 'bot_command',
      );

    if (isCallbackQuery) {
      await this.processTemporaryCallbackQuery(ctx);

      if (deunionize(ctx.callbackQuery).data === '__TG_MENU_back_button') {
        await this.menuHistoryService.backMenu(ctx);
      }
    }

    await next();

    const isUserInHomePage =
      isCallbackQuery && deunionize(ctx.callbackQuery).data === 'GET /';

    if (isUserInHomePage || isCommand) {
      await this.menuHistoryService.clear(ctx);
    } else if (isCallbackQuery) {
      await this.menuHistoryService.add(ctx, ctx.callbackQuery['data']);
    }
  };
}

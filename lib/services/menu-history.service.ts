/* eslint-disable dot-notation */
import { Injectable } from '@nestjs/common';
import * as objectPath from 'object-path';

import { TG_MENU_NAVIGATION_HISTORY } from '../consts';
import { TGMenuContext } from '../interfaces';

@Injectable()
export class MenuHistoryService {
  async add(ctx: TGMenuContext, callbackData: string) {
    objectPath.push(ctx.session, TG_MENU_NAVIGATION_HISTORY, callbackData);
  }

  async backMenu(ctx: TGMenuContext) {
    const callbackQuery = objectPath.del(
      ctx.session,
      TG_MENU_NAVIGATION_HISTORY,
    );
    ctx.callbackQuery['data'] = callbackQuery;
  }

  async clear(ctx: TGMenuContext) {
    objectPath.set(ctx.session, TG_MENU_NAVIGATION_HISTORY, []);
  }
}

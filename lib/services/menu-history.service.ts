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

  async back(ctx: TGMenuContext) {
    const callbackQueries = objectPath.get(
      ctx.session,
      TG_MENU_NAVIGATION_HISTORY,
    ) as Array<string>;
    callbackQueries.pop(); // get the current menu
    ctx.callbackQuery['data'] = callbackQueries.pop(); // get the back menu
  }

  async get(ctx: TGMenuContext) {
    const history = objectPath.get(ctx.session, TG_MENU_NAVIGATION_HISTORY);

    if (history && history.length >= 1) {
      return history[(history as Array<string>).length - 1];
    }

    return null;
  }

  async clear(ctx: TGMenuContext) {
    objectPath.set(ctx.session, TG_MENU_NAVIGATION_HISTORY, []);
  }
}

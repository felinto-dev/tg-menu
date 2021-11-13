import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestMethod,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { deunionize } from 'telegraf';
import { tap } from 'rxjs/operators';

import { TemporaryCallbackService } from '../services/temporary-callback.service';
import { TGMenuContext } from '../interfaces/telegraf-context.interface';
import { PaginationTelegramService } from '../services/pagination.service';
import { MenuHelper } from '../helpers/menu.helper';
import { parsePath } from '../utils/parse-path';

@Injectable()
export class SetupMenuPathInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly telegramPaginationService: PaginationTelegramService,
    private readonly temporaryCallbackService: TemporaryCallbackService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const menuPath = this.reflector.get<string>(
      'menuPath',
      context.getHandler(),
    );
    const requestMethod = this.reflector.get<keyof typeof RequestMethod>(
      'requestMethod',
      context.getHandler(),
    );

    const ctx: TGMenuContext =
      TelegrafExecutionContext.create(context).getContext();

    if (ctx.callbackQuery) {
      const callbackQuery = deunionize(ctx.callbackQuery).data;
      ctx.query = parsePath(menuPath, callbackQuery).query;
      ctx.params = parsePath(menuPath, callbackQuery).params;
    } else {
      ctx.query = {};
      ctx.params = {};
    }

    ctx.menu = new MenuHelper(
      ctx,
      this.telegramPaginationService,
      this.temporaryCallbackService,
      ctx.callbackQuery ? deunionize(ctx.callbackQuery).data : menuPath,
    );
    return next.handle().pipe(
      tap(() => {
        if (requestMethod === 'GET') {
          ctx.menu.showMenu();
        }
      }),
    );
  }
}

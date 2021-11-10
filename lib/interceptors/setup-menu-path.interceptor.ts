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
import { MenuPathParser } from '../helpers/menu-path-parser.helper';
import { TGMenuContext } from '../interfaces/telegraf-context.interface';
import { PaginationTelegramService } from '../services/pagination.service';
import { MenuHelper } from '../helpers/menu.helper';

@Injectable()
export class SetupMenuPathInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly telegramPaginationService: PaginationTelegramService,
    private readonly temporaryCallbackService: TemporaryCallbackService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const menuPath = this.reflector.get<MenuPathParser>(
      'menuPath',
      context.getHandler(),
    );
    const requestMethod = this.reflector.get<RequestMethod>(
      'requestMethod',
      context.getHandler(),
    );

    const ctx: TGMenuContext =
      TelegrafExecutionContext.create(context).getContext();

    if (ctx.callbackQuery) {
      const callbackQuery = deunionize(ctx.callbackQuery).data;
      menuPath.path = callbackQuery;
      ctx.query = menuPath.parse(callbackQuery).query;
      ctx.params = menuPath.parse(callbackQuery).params;
    } else {
      menuPath.path = menuPath.template;
    }

    ctx.menu = new MenuHelper(
      ctx,
      this.telegramPaginationService,
      this.temporaryCallbackService,
    );
    ctx.menu.setPath(menuPath);
    return next.handle().pipe(
      tap(() => {
        if (requestMethod === RequestMethod.GET) {
          ctx.menu.showMenu();
        }
      }),
    );
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { deunionize } from 'telegraf';
import { tap } from 'rxjs/operators';

import { MenuPathParser } from '../helpers/menu-path-parser.helper';
import { TelegrafContext } from '../interfaces/telegraf-context.interface';
import { PaginationTelegramService } from '../services/pagination.service';
import { MenuHelper } from '../helpers/menu.helper';

@Injectable()
export class SetupMenuPathInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private readonly telegramPaginationService: PaginationTelegramService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const menuPath = this.reflector.get<MenuPathParser>(
      'menu_path',
      context.getHandler(),
    );

    const ctx: TelegrafContext =
      TelegrafExecutionContext.create(context).getContext();

    if (ctx.callbackQuery) {
      const callbackQuery = deunionize(ctx.callbackQuery).data;
      menuPath.path = callbackQuery;
      ctx.query = menuPath.parse(callbackQuery).query;
      ctx.params = menuPath.parse(callbackQuery).params;
    } else {
      menuPath.path = menuPath.template;
    }

    ctx.menu = new MenuHelper(ctx, this.telegramPaginationService);
    ctx.menu.setPath(menuPath);
    return next.handle().pipe(tap(() => ctx.menu.showMenu()));
  }
}

import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TGQuery = createParamDecorator(
  (key: string, ctx: ExecutionContext) =>
    TelegrafExecutionContext.create(ctx).getContext().query?.[key],
);

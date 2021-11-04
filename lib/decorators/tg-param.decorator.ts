import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TGParam = createParamDecorator(
  (key: string, ctx: ExecutionContext) =>
    TelegrafExecutionContext.create(ctx).getContext().params?.[key],
);

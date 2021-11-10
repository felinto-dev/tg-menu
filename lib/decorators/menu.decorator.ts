import { Action } from 'nestjs-telegraf';
import {
  applyDecorators,
  RequestMethod,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';

import { SetupMenuPathInterceptor } from '../interceptors/setup-menu-path.interceptor';
import { MenuPathParser } from '../helpers/menu-path-parser.helper';

export const TGMenu = (requestMethod: RequestMethod, path = '') => {
  const menuPath = new MenuPathParser(requestMethod, path);

  return applyDecorators(
    Action(menuPath.templateToRegex()),
    SetMetadata('menuPath', menuPath),
    SetMetadata('requestMethod', requestMethod),
    UseInterceptors(SetupMenuPathInterceptor),
  );
};

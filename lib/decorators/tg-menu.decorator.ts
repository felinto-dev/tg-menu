import { Action } from 'nestjs-telegraf';
import {
  applyDecorators,
  RequestMethod,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';

import { SetupMenuPathInterceptor } from '../interceptors/setup-menu-path.interceptor';
import { pathToRegex } from '../utils/path-to-regex';
import { sanitizeMenuPath } from '../utils/sanitize-menu-path';

export const TGMenu = (
  requestMethod: keyof typeof RequestMethod,
  path = '/',
) => {
  path = sanitizeMenuPath(path);

  return applyDecorators(
    SetMetadata('requestMethod', requestMethod),
    SetMetadata('menuPath', `${requestMethod} ${path}`),
    Action(pathToRegex(requestMethod, path)),
    UseInterceptors(SetupMenuPathInterceptor),
  );
};

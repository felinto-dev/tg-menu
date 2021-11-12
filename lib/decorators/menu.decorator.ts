import { Action } from 'nestjs-telegraf';
import {
  applyDecorators,
  RequestMethod,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';

import { SetupMenuPathInterceptor } from '../interceptors/setup-menu-path.interceptor';
import { pathToRegex } from '../utils/path-to-regex';

export const TGMenu = (requestMethod: RequestMethod, path = '/') => {
  return applyDecorators(
    SetMetadata('requestMethod', requestMethod),
    SetMetadata('menuPath', `${RequestMethod[requestMethod]} ${path}`),
    Action(pathToRegex(requestMethod, path)),
    UseInterceptors(SetupMenuPathInterceptor),
  );
};

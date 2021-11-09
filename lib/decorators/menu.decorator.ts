import { Action } from 'nestjs-telegraf';
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';

import { SetupMenuPathInterceptor } from '../interceptors/setup-menu-path.interceptor';
import { MenuPathParser } from '../helpers/menu-path-parser.helper';

export const TGMenu = (
  path = '',
  params?: {
    hiddenMenu: boolean;
  },
) => {
  const menuPath = new MenuPathParser(path);

  return applyDecorators(
    Action(menuPath.templateToRegex()),
    SetMetadata('menuPath', menuPath),
    SetMetadata('hiddenMenu', params?.hiddenMenu),
    UseInterceptors(SetupMenuPathInterceptor),
  );
};

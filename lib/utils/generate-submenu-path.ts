import { RequestMethod } from '@nestjs/common';

import { buildQueryParams, removeQueryParams } from './build-query-params';
import { sanitizeMenuPath } from './sanitize-menu-path';

export const generateSubmenuPath = (
  path: string,
  submenu: string,
  action = RequestMethod.GET,
  queryParams?: Record<string, string>,
) => {
  path = sanitizeMenuPath(path);
  path = removeQueryParams(path);

  if (queryParams && Object.keys(queryParams).length > 0) {
    return buildQueryParams(
      `${RequestMethod[action]} ${path}${submenu}/`,
      queryParams,
    );
  }
  return `${RequestMethod[action]} ${path}${submenu}/`;
};

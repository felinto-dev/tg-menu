import { RequestMethod } from '@nestjs/common';

import { QUERY_PARAMETERS_REGEX } from '../consts/regex-library';
import { sanitizeMenuPath } from './sanitize-menu-path';

export const generateSubmenuPath = (
  path: string,
  submenu: string,
  action = RequestMethod.GET,
  queryParams?: Record<string, string>,
) => {
  path = sanitizeMenuPath(path);
  path = path.replace(
    new RegExp(`${QUERY_PARAMETERS_REGEX.source}/$`),
    path.endsWith('/') ? '' : '/',
  );

  if (queryParams && Object.keys(queryParams).length > 0) {
    const queries = `?${new URLSearchParams(queryParams).toString()}`;
    return `${RequestMethod[action]} ${path}${submenu}${queries}/`;
  }
  return `${RequestMethod[action]} ${path}${submenu}/`;
};

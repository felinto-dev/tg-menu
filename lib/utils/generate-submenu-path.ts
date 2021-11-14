import { buildQueryParams, removeQueryParams } from './build-query-params';
import { normalizeMenuPath } from './normalize-menu-path';

export const generateSubmenuPath = (
  path: string,
  submenu: string,
  action = 'GET',
  queryParams?: Record<string, string>,
) => {
  path = normalizeMenuPath(path);
  path = removeQueryParams(path);

  if (queryParams && Object.keys(queryParams).length > 0) {
    return buildQueryParams(`${action} ${path}${submenu}/`, queryParams);
  }
  return `${action} ${path}${submenu}/`;
};

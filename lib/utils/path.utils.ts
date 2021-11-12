import { RequestMethod } from '@nestjs/common';
import { pathToRegexp, match } from 'path-to-regexp';

const queryParametersRegex = /(\?|&)([^=]+)=([^&/]+)/g;

export const sanitizeMenuPath = (path: string) => {
  Object.keys(RequestMethod)
    .filter((k) => Number.isNaN(+k))
    .forEach((requestMethod) => {
      path = path.replace(`${requestMethod} `, '');
    });

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  if (!path.endsWith('/')) {
    path = `${path}/`;
  }

  if (path.match(/\/\//)) {
    throw new Error('Paths cannot to have double slash');
  }

  return path;
};

export const pathToRegex = (
  requestMethod: RequestMethod,
  path: string,
): RegExp => {
  path = sanitizeMenuPath(path);
  const pathRegex = pathToRegexp(path, [], {
    start: false,
    end: false,
  });
  return new RegExp(
    `^${RequestMethod[requestMethod]} ${pathRegex.source}(?<queryParameters>${queryParametersRegex.source})*$`,
  );
};

export const parsePath = (path: string, callback: string) => ({
  // eslint-disable-next-line dot-notation
  params: { ...match(path, { end: false })(callback)['params'] },
  query: Object.fromEntries(
    new URLSearchParams(callback.match(queryParametersRegex)?.join('')),
  ),
});

export const generateSubmenuPath = (
  path: string,
  submenu: string,
  action = RequestMethod.GET,
  queryParams?: Record<string, string>,
) => {
  path = sanitizeMenuPath(path);
  path = path.replace(queryParametersRegex, path.endsWith('/') ? '' : '/');

  if (queryParams && Object.keys(queryParams).length > 0) {
    const queries = `?${new URLSearchParams(queryParams).toString()}`;
    return `${RequestMethod[action]} ${path}${submenu}${queries}/`;
  }
  return `${RequestMethod[action]} ${path}${submenu}/`;
};

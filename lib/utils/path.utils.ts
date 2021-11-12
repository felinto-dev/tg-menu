import { RequestMethod } from '@nestjs/common';
import { pathToRegexp, match } from 'path-to-regexp';

const queryParametersRegex = /(\?|&)([^=]+)=([^&/]+)/g;

export const sanitizeMenuPath = (path: string) => {
  if (!path.startsWith('/') || !path.endsWith('/')) {
    throw new Error("Paths should to start and ends with '/' (slash)");
  }

  if (path.match(/\/\//)) {
    throw new Error('Paths cannot to have double slash');
  }

  return path;
};

export const pathToRegex = (requestMethod: RequestMethod, path: string) => {
  path = sanitizeMenuPath(path);
  const pathRegex = pathToRegexp(path, [], {
    start: false,
    end: false,
  });
  return new RegExp(
    `^${RequestMethod[requestMethod]} ${pathRegex.source}(<queryParameters>${queryParametersRegex.source})?`,
  );
};

export const parsePath = (path: string, callback: string) => ({
  // eslint-disable-next-line dot-notation
  params: { ...match(path, { end: false })(callback)['params'] },
  query: Object.fromEntries(
    new URLSearchParams(callback.match(queryParametersRegex)?.join('')),
  ),
});

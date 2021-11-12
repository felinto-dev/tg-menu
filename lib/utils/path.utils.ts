import { RequestMethod } from '@nestjs/common';
import { pathToRegexp, match } from 'path-to-regexp';

const queryParametersRegex = /(\?|&)([^=]+)=([^&/]+)/;

export const sanitizeMenuPath = (path: string) => {
  if (!path.startsWith('/') || !path.endsWith('/')) {
    throw new Error("Paths should to start and ends with '/' (slash)");
  }

  if (path.match(/\/\//)) {
    throw new Error('Paths cannot to have double slash');
  }

  return path;
};

export const generatePathRegex = (
  requestMethod: RequestMethod,
  path: string,
) => {
  path = sanitizeMenuPath(path);
  const pathRegex = pathToRegexp(path, [], {
    start: false,
    end: false,
    strict: true,
  });
  return new RegExp(
    `^${RequestMethod[requestMethod]} ${pathRegex.source}(<queryParameters>${queryParametersRegex.source})?`,
  );
};

export const parsePath = (rawPath: string, path: string) => {
  const pathMatch = match(path);

  return {
    // eslint-disable-next-line dot-notation
    params: { ...pathMatch(rawPath)['params'] },
    query: {},
  };
};

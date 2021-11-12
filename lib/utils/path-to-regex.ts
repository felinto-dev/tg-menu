import { RequestMethod } from '@nestjs/common';

import { pathToRegexp, match } from 'path-to-regexp';
import { QUERY_PARAMETERS_REGEX } from '../consts/regex-library';
import { sanitizeMenuPath } from './sanitize-menu-path';

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
    `^${RequestMethod[requestMethod]} ${pathRegex.source}(?<queryParameters>${QUERY_PARAMETERS_REGEX.source})*$`,
  );
};

export const parsePath = (path: string, callback: string) => ({
  // eslint-disable-next-line dot-notation
  params: { ...match(path, { end: false })(callback)['params'] },
  query: Object.fromEntries(
    new URLSearchParams(callback.match(QUERY_PARAMETERS_REGEX)?.join('')),
  ),
});

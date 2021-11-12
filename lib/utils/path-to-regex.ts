import { RequestMethod } from '@nestjs/common';

import { pathToRegexp } from 'path-to-regexp';

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
    `^${RequestMethod[requestMethod]} ${pathRegex.source}(?<queryParameters>${QUERY_PARAMETERS_REGEX.source}/?)*$`,
  );
};

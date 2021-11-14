import { RequestMethod } from '@nestjs/common';

import { pathToRegexp } from 'path-to-regexp';

import { QUERY_PARAMETERS_REGEX } from '../consts/regex-library';
import { sanitizeMenuPath } from './sanitize-menu-path';

export const isContainsPathParameters = (path: string) => path.match(/\/:/);

export const pathToRegex = (
  requestMethod: keyof typeof RequestMethod,
  path: string,
): RegExp => {
  path = sanitizeMenuPath(path);
  const pathRegex = pathToRegexp(path, [], {
    start: false,
    end: false,
  });
  return new RegExp(
    `^${requestMethod} ${pathRegex.source}(?<queryParameters>${QUERY_PARAMETERS_REGEX.source}/?)*$`,
  );
};

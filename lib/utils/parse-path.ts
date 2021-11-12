import { match } from 'path-to-regexp';

import { QUERY_PARAMETERS_REGEX } from '../consts/regex-library';

export const parsePath = (path: string, callback: string) => ({
  // eslint-disable-next-line dot-notation
  params: { ...match(path, { end: false })(callback)['params'] },
  query: Object.fromEntries(
    new URLSearchParams(callback.match(QUERY_PARAMETERS_REGEX)?.join('')),
  ),
});

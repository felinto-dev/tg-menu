import { QUERY_PARAMETERS_REGEX } from '../consts/regex-library';

export const isContainsQueryParams = (path: string) =>
  path.match(QUERY_PARAMETERS_REGEX);

export const removeQueryParams = (path: string) =>
  path.replace(new RegExp(`${QUERY_PARAMETERS_REGEX.source}/$`), '');

export const buildQueryParams = (
  path: string,
  queryParams: Record<string, string>,
) => {
  path = removeQueryParams(path);
  return `${path}?${new URLSearchParams(queryParams).toString()}/`;
};

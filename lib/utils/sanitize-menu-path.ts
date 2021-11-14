import { RequestMethod } from '@nestjs/common';

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

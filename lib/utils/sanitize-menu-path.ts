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

  return decodeURI(path).replace(/\/+/g, '/').normalize();
};

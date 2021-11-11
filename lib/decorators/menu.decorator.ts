import { RequestMethod, SetMetadata } from '@nestjs/common';

import { TG_ROUTE_PATH_METADATA } from '../consts';
import { sanitizeMenuPath } from '../utils/path.utils';

export const TGMenu = (requestMethod: RequestMethod, path = '/') => {
  return SetMetadata(TG_ROUTE_PATH_METADATA, sanitizeMenuPath(path));
};

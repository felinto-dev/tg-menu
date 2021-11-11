import { applyDecorators, SetMetadata } from '@nestjs/common';

import { TG_ROUTE_PATH_METADATA } from '../consts';
import { sanitizeMenuPath } from '../utils/sanitize-menu-path.utils';

export const TGMenu = (path = '/') =>
  applyDecorators(SetMetadata(TG_ROUTE_PATH_METADATA, sanitizeMenuPath(path)));

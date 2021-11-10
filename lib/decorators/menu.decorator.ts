import { applyDecorators, SetMetadata } from '@nestjs/common';

import { sanitizeMenuPath } from '../utils/sanitize-menu-path.utils';

export const TGMenu = (path = '/') =>
  applyDecorators(SetMetadata('menuPath', sanitizeMenuPath(path)));

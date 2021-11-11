import { applyDecorators, RequestMethod, SetMetadata } from '@nestjs/common';

import { sanitizeMenuPath } from '../../utils/sanitize-menu-path.utils';
import { TG_SUB_ROUTE_PATH_METADATA, TG_REQUEST_METHOD } from '../../consts';

export const TGGet = (path = '/'): MethodDecorator =>
  applyDecorators(
    SetMetadata(TG_SUB_ROUTE_PATH_METADATA, sanitizeMenuPath(path)),
    SetMetadata(TG_REQUEST_METHOD, RequestMethod.GET),
  );

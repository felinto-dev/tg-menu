import { Module } from '@nestjs/common';

import { SetupMenuPathInterceptor } from './interceptors/setup-menu-path.interceptor';
import { PaginationTelegramService } from './services/pagination.service';

@Module({
  providers: [PaginationTelegramService, SetupMenuPathInterceptor],
  exports: [PaginationTelegramService, SetupMenuPathInterceptor],
})
export class TgMenuModule {}

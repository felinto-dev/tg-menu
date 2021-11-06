import { CacheModule, Module } from '@nestjs/common';

import { SetupMenuPathInterceptor } from './interceptors/setup-menu-path.interceptor';
import { PaginationTelegramService } from './services/pagination.service';
import { TemporaryCallbackService } from './services/temporary-callback.service';

const providers = [
  PaginationTelegramService,
  SetupMenuPathInterceptor,
  TemporaryCallbackService,
];

@Module({
  imports: [CacheModule.register()],
  providers,
  exports: providers,
})
export class TgMenuModule {}

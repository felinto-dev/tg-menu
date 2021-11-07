import { CacheModule, Module, Provider } from '@nestjs/common';

import { TemporaryCallbackMiddleware } from './middlewares/temporary-callback.middleware';
import { SetupMenuPathInterceptor } from './interceptors/setup-menu-path.interceptor';
import { PaginationTelegramService } from './services/pagination.service';
import { TemporaryCallbackService } from './services/temporary-callback.service';

const providers: Provider[] = [
  PaginationTelegramService,
  SetupMenuPathInterceptor,
  TemporaryCallbackService,
  TemporaryCallbackMiddleware,
];

@Module({
  imports: [CacheModule.register()],
  providers,
  exports: providers,
})
export class TgMenuModule {}

import { CacheModule, Module, Provider } from '@nestjs/common';

import { TGMenuMiddleware } from './middlewares/tg-menu.middleware';
import { SetupMenuPathInterceptor } from './interceptors/setup-menu-path.interceptor';
import { PaginationTelegramService } from './services/pagination.service';
import { TemporaryCallbackService } from './services/temporary-callback.service';

const providers: Provider[] = [
  PaginationTelegramService,
  SetupMenuPathInterceptor,
  TemporaryCallbackService,
  TGMenuMiddleware,
];

@Module({
  imports: [CacheModule.register()],
  providers,
  exports: providers,
})
export class TgMenuModule {}

import { CacheModule, Module, Provider } from '@nestjs/common';

import { TGMenuMiddleware } from './middlewares/tg-menu.middleware';
import { SetupMenuPathInterceptor } from './interceptors/setup-menu-path.interceptor';
import { PaginationTelegramService } from './services/pagination.service';
import { TemporaryCallbackService } from './services/temporary-callback.service';
import { MenuHistoryService } from './services/menu-history.service';

const providers: Provider[] = [
  PaginationTelegramService,
  SetupMenuPathInterceptor,
  TemporaryCallbackService,
  MenuHistoryService,
  TGMenuMiddleware,
];

@Module({
  imports: [CacheModule.register()],
  providers,
  exports: providers,
})
export class TgMenuModule {}

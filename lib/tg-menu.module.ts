import { Module } from '@nestjs/common';
import { PaginationTelegramService } from './services/pagination.service';

@Module({
  providers: [PaginationTelegramService],
})
export class TgMenuModule {}

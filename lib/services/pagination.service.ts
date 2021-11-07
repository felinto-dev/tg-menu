import { Injectable } from '@nestjs/common';
import { InlineKeyboardButton } from 'typegram';
import * as paginationLogic from 'pagination-logic';

import { MAX_ALLOWED_CALLBACK_DATA } from '../consts';
import { TGMenuPagination } from '../interfaces/pagination-setup.interface';
import { TemporaryCallbackService } from './temporary-callback.service';

@Injectable()
export class PaginationTelegramService {
  constructor(
    private readonly temporaryCallbackQueryService: TemporaryCallbackService,
  ) {}

  async generatePagination(
    endpoint: string,
    paginationSetup: TGMenuPagination,
  ): Promise<InlineKeyboardButton[]> {
    const { currentPage, itemsByPage, totalAvailableItems } = paginationSetup;
    const paginationMenu: InlineKeyboardButton[] = [];

    let pageSize: number;
    if (totalAvailableItems / itemsByPage > 3) {
      pageSize = 5;
    } else {
      pageSize = 3;
    }

    const pagination = paginationLogic({
      total: totalAvailableItems,
      single: itemsByPage,
      pageSize,
      currentPage,
      pageLinkRule: async (pageNumber: number) => {
        const callbackData = `${endpoint}?page=${pageNumber}`;

        if (callbackData.length > MAX_ALLOWED_CALLBACK_DATA) {
          return this.temporaryCallbackQueryService.setCallback(callbackData);
        }

        return callbackData;
      },
    });

    if (pagination.pageCount <= 1) {
      return [];
    }

    if (currentPage !== 1) {
      paginationMenu.push({
        text: '« «',
        callback_data: await pagination.firstPage.link,
      });
    }

    const paginationKeyboard: InlineKeyboardButton[] = await Promise.all(
      pagination.pages.map(
        async (pageItem: { number: number; link: Promise<string> }) => ({
          text:
            pageItem.number === pagination.currentPage
              ? `- ${pageItem.number} -`
              : pageItem.number,
          callback_data: await pageItem.link,
        }),
      ),
    );
    paginationMenu.push(...paginationKeyboard);

    if (pagination.lastPage.number !== currentPage) {
      paginationMenu.push({
        text: '» »',
        callback_data: await pagination.lastPage.link,
      });
    }

    return paginationMenu;
  }
}

import * as paginationLogic from 'pagination-logic';
import { Injectable } from '@nestjs/common';
import { InlineKeyboardButton } from 'typegram';

import { TGMenuPagination } from '../interfaces/pagination-setup.interface';

@Injectable()
export class PaginationTelegramService {
  async generatePagination(
    endpoint: string,
    paginationSetup: TGMenuPagination,
    callbackQueryId?: string,
  ): Promise<InlineKeyboardButton[]> {
    const { currentPage, itemsByPage, totalAvailableItems } = paginationSetup;
    const paginationMenu: InlineKeyboardButton[] = [];

    const pagination = paginationLogic({
      total: totalAvailableItems,
      single: itemsByPage,
      pageSize: 3,
      currentPage,
      pageLinkRule: (pageNumber: number) => {
        const callback_data = `${endpoint}?page=${pageNumber}`;
        if (callbackQueryId) {
          return `${callback_data}${callbackQueryId}/`;
        }
        return callback_data;
      },
    });

    if (pagination.pageCount <= 1) {
      return [];
    }

    if (currentPage !== 1) {
      paginationMenu.push({
        text: '« «',
        callback_data: pagination.firstPage.link,
      });
    }

    const paginationKeyboard = pagination.pages.map(
      (pageItem: { number: number; link: string }) => {
        if (pageItem.number === pagination.currentPage) {
          return {
            text: `- ${pageItem.number} -`,
            callback_data: `!already-in-current-page->${pageItem.number}`,
          };
        }

        return { text: pageItem.number, callback_data: pageItem.link };
      },
    );
    paginationMenu.push(...paginationKeyboard);

    if (pagination.lastPage.number !== currentPage) {
      paginationMenu.push({
        text: '» »',
        callback_data: pagination.lastPage.link,
      });
    }

    return paginationMenu;
  }
}

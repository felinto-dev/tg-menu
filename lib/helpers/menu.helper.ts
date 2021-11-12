import * as Numbers from 'number-to-emoji';
import { InlineKeyboardButton } from 'typegram';

import { generateSubmenuPath } from '../utils/path.utils';
import { TemporaryCallbackService } from '../services/temporary-callback.service';
import { PaginationTelegramService } from '../services/pagination.service';
import { TGMenuContext } from '../interfaces/telegraf-context.interface';
import { TGMenuPagination } from '../interfaces/pagination-setup.interface';
import { backHomeButtonHelper } from './back-home-button.helper';
import { MAX_ALLOWED_CALLBACK_DATA } from '../consts';

export class MenuHelper {
  constructor(
    private readonly ctx: TGMenuContext,
    private readonly paginationService: PaginationTelegramService,
    private readonly temporaryCallbackService: TemporaryCallbackService,
    private readonly path: string,
  ) {}

  private header = '👇 Selecione uma das opções do menu abaixo:';

  private items: InlineKeyboardButton[][] = [];

  setHeader(text: string) {
    this.header = this.resolveI18n(text);
  }

  private resolveI18n(text: string) {
    if (this.ctx.i18n) {
      if (text.startsWith('%') && text.endsWith('%')) {
        return this.ctx.i18n.t(text.slice(1, text.length - 1));
      }
    }

    return text;
  }

  private buildButton(button: InlineKeyboardButton) {
    button.text = this.resolveI18n(button.text);
    return button;
  }

  add(...items: InlineKeyboardButton[]) {
    this.items.push(...items.map((item) => [item]));
  }

  addRow(...rows: InlineKeyboardButton[][]) {
    this.items.push(...rows);
  }

  async submenu(text: string, submenuPath = 'null') {
    submenuPath = generateSubmenuPath(this.path, submenuPath);

    if (submenuPath.length > MAX_ALLOWED_CALLBACK_DATA) {
      return this.buildButton({
        text,
        callback_data: await this.temporaryCallbackService.setCallback(
          submenuPath,
        ),
      });
    }

    return this.buildButton({ text, callback_data: submenuPath });
  }

  nav(text: string, menuPath: string) {
    return this.buildButton({ text, callback_data: menuPath });
  }

  url(text: string, url: string) {
    return this.buildButton({ text, url });
  }

  private showMenuNumbers() {
    this.items = this.items.map((item, index) => {
      // eslint-disable-next-line dot-notation
      if (item.length === 1 && item[0]['callback_data']) {
        return [
          {
            ...item[0],
            text: `${Numbers.toEmoji(index + 1)} ${item[0].text}`,
          },
        ];
      }
      return item;
    });
  }

  private async setupBackHomeButton() {
    this.addRow(backHomeButtonHelper(this.path));
  }

  async setupPagination(params: TGMenuPagination) {
    this.addRow(
      await this.paginationService.generatePagination(this.path, params),
    );
  }

  async showMenu() {
    this.setupBackHomeButton();
    this.showMenuNumbers();
    await this.ctx.replyWithHTML(this.header, {
      reply_markup: {
        inline_keyboard: this.items,
      },
      reply_to_message_id: this.ctx.message?.message_id,
      disable_web_page_preview: true,
    });
  }
}

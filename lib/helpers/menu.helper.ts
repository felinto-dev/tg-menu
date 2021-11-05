import * as Numbers from 'number-to-emoji';
import { InlineKeyboardButton } from 'typegram';

import { PaginationTelegramService } from '../services/pagination.service';
import { TGMenuContext } from '../interfaces/telegraf-context.interface';
import { PaginationSetup } from '../interfaces/pagination-setup.interface';
import { MenuPathParser } from './menu-path-parser.helper';
import { backHomeButtonHelper } from './back-home-button.helper';

export class MenuHelper {
  constructor(
    private readonly ctx: TGMenuContext,
    private readonly paginationService: PaginationTelegramService,
  ) {}

  private header = '👇 Selecione uma das opções do menu abaixo:';

  private menuPath: MenuPathParser;

  private items: InlineKeyboardButton[][] = [];

  setPath(path: MenuPathParser) {
    this.menuPath = path;
  }

  setHeader(text: string) {
    this.header = this.resolveI18n(text);
  }

  private resolveI18n(text: string) {
    if (text.startsWith('%') && text.endsWith('%')) {
      // TODO: Add support to i18n
      return text;
      // return this.ctx.i18n.t(text.slice(1, text.length - 1));
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

  submenu(text: string, submenuPath = 'null') {
    if (this.menuPath.path === '/') {
      return this.buildButton({ text, callback_data: `/${submenuPath}` });
    }

    submenuPath = `${this.menuPath.removeQueryParameters(
      this.menuPath.path,
    )}/${submenuPath}`;
    return this.buildButton({ text, callback_data: submenuPath });
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
    this.addRow(backHomeButtonHelper(this.menuPath.path));
  }

  async setupPagination(params: PaginationSetup) {
    this.addRow(
      await this.paginationService.generatePagination(
        this.menuPath.removeQueryParameters(this.menuPath.path),
        params,
      ),
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

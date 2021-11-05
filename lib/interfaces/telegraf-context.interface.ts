import { Scenes } from 'telegraf';
import { I18nContext } from '@grammyjs/i18n';

import { MenuHelper } from '../helpers/menu.helper';

export interface TGMenuContext extends Scenes.SceneContext {
  query: Record<string, string>;
  params: Record<string, string>;
  menu: MenuHelper;
  readonly i18n?: I18nContext;
}

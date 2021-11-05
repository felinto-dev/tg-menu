import { Scenes } from 'telegraf';

import { MenuHelper } from '../helpers/menu.helper';

export interface TGMenuContext extends Scenes.SceneContext {
  query: Record<string, string>;
  params: Record<string, string>;
  menu: MenuHelper;
}

import { MenuHelper } from 'lib/helpers/menu.helper';
import { Scenes } from 'telegraf';

export interface TGMenuContext extends Scenes.SceneContext {
  query: Record<string, string>;
  params: Record<string, string>;
  menu: MenuHelper;
}

import { Scenes } from 'telegraf';

export interface TelegrafContext extends Scenes.SceneContext {
  match?: RegExpExecArray;
  query: Record<string, string>;
  params: Record<string, string>;
}

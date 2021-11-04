import { InlineKeyboardButton } from 'typegram';

const getUpperMenu = (path: string) => {
  // hack for convert "/producer/accounts" to "/producer"
  while (path.charAt(path.length - 1) !== '/') {
    path = path.slice(0, -1);
  }

  if (path === '/') {
    return path;
  }

  return path.slice(0, -1);
};

export const backHomeButtonHelper = (
  currentMenuPath: string,
): InlineKeyboardButton[] => {
  const keyboard = [];

  if (currentMenuPath && currentMenuPath !== '/') {
    keyboard.push({
      text: '#️⃣ Voltar',
      callback_data: getUpperMenu(currentMenuPath),
    });
    keyboard.push({ text: '🏠 Menu Principal', callback_data: '/' });
  }

  return keyboard;
};

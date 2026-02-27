import { Telegraf } from 'telegraf';

let bot;

export function initTelegramBot() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.warn('⚠️  Telegram bot token not set. Bot will not be initialized.');
    return;
  }

  bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

  // Commands
  bot.command('start', (ctx) => {
    ctx.reply('🚀 HauseOS Bot - Work Approval & Notifications');
  });

  bot.launch();
  console.log('✅ Telegram bot launched');
}

export function getBot() {
  return bot;
}

export async function sendNotification(chatId, message, buttons) {
  if (!bot) {
    console.warn('Telegram bot not initialized');
    return;
  }

  try {
    await bot.telegram.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      ...(buttons && { reply_markup: { inline_keyboard: buttons } }),
    });
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}

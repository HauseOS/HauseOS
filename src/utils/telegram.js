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

// Send notification to Yeeling (default target for editorial notifications)
// In production, set YEELING_CHAT_ID environment variable
export async function notifyTelegram(message) {
  if (!bot && !process.env.TELEGRAM_BOT_TOKEN) {
    console.log('📌 [Telegram notification] (bot not configured):', message);
    return;
  }

  const chatId = process.env.YEELING_CHAT_ID || process.env.TELEGRAM_ADMIN_CHAT_ID;
  
  if (!chatId) {
    console.log('📌 [Telegram notification] (no chat ID configured):', message);
    return;
  }

  try {
    if (!bot) {
      console.warn('Telegram bot not initialized');
      return;
    }
    
    await bot.telegram.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
    });
    console.log('✓ Telegram notification sent');
  } catch (error) {
    console.error('Failed to send Telegram notification:', error.message);
  }
}

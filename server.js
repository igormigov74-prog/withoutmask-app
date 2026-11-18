const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const config = require('./config');

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.proxyapi.ru/openai/v1';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const users = {};

function getUser(id) {
  if (!users[id]) {
    users[id] = { id, credits: 1, refs: 0, partner: null, filter: {}, blocked: [] };
  }
  return users[id];
}

bot.onText(/\/start(?:\s+(\d+))?/, (msg, match) => {
  const userId = msg.from.id;
  const user = getUser(userId);
  const refId = match[1] ? Number(match[1]) : null;
  
  if (refId && refId !== userId && users[refId] && users[refId].refs < 3 && !user.referredBy) {
    user.referredBy = refId;
    users[refId].refs += 1;
    users[refId].credits += 1;
    bot.sendMessage(refId, '🎁 Ваш друг присоединился! Вам начислена +1 бесплатная ИИ-проверка.');
  }
  
  bot.sendMessage(userId, '🎭 Добро пожаловать в суперапп WithoutMask AI!\n\nОбщайтесь в анонимной чат-рулетке без границ.', {
    reply_markup: {
      inline_keyboard: [[{ text: '🚀 Открыть чат-рулетку', web_app: { url: process.env.RENDER_EXTERNAL_URL || 'https://withoutmask-app.onrender.com' } }]]
    }
  });
});

bot.on('pre_checkout_query', (q) => bot.answerPreCheckoutQuery(q.id, true));
bot.on('successful_payment', (msg) => {
  const user = getUser(msg.from.id);
  user.credits += 1;
  bot.sendMessage(msg.from.id, '✅ Оплата получена! Вам начислен +1 ИИ-кредит.');
});

app.get('/', (req, res) => {
  res.send(config.htmlTemplate);
});

app.post('/api/scan', async (req, res) => {
  const { uid, url } = req.body;
  const user = getUser(uid);
  if (user.credits < 1) return res.json({ error: 'Недостаточно ИИ-кредитов.' });
  
  user.credits -= 1;
  if (!AI_API_KEY) {
    return res.json({ credits: user.credits, result: '🎭 [ТЕСТ] Искренность 88%. Подключите ProxyAPI.' });
  }
  
  try {
    const ai = await axios.post(`${AI_BASE_URL}/chat/completions`, {
      model: 'deepseek/deepseek-v4.1-flash-1017',
      messages: [{ role: 'user', content: `Проанализируй видео: ${url}` }]
    }, { headers: { Authorization: `Bearer ${AI_API_KEY}` } });
    res.json({ credits: user.credits, result: ai.data.choices[0].message.content });
  } catch (e) {
    user.credits += 1;
    res.json({ credits: user.credits, error: 'Ошибка связи с ИИ.' });
  }
});

app.post('/api/invoice', async (req, res) => {
  try {
    const link = await bot.createInvoiceLink('1 ИИ-проверка', 'Разбор видео', 'credit_1', '', 'XTR', [{ label: 'Купить кредит', amount: 35 }]);
    res.json({ link });
  } catch (e) {
    res.json({ error: 'Ошибка счета' });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('WithoutMask Mercur engine online'));

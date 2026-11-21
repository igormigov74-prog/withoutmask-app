# WithoutMask AI Server Engine

const express = require('express');const TelegramBot = require('node-telegram-bot-api');const axios = require('axios');const config = require('./config');
const app = express();
app.use(express.json());
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });const users = {};const getUser = (id) => users[id] || (users[id] = { id, credits: 1, refs: 0 });

bot.onText(/\/start(?:\s+(\d+))?/, (msg, match) => {
  const uid = msg.from.id;
  const user = getUser(uid);
  const ref = match[1] ? Number(match[1]) : null;
  if (ref && ref !== uid && users[ref] && users[ref].refs < 3 && !user.refBy) {
    user.refBy = ref; users[ref].refs++; users[ref].credits++;
    bot.sendMessage(ref, '🎁 Друг присоединился! +1 проверка.');
  }
  bot.sendMessage(uid, '🎭 WithoutMask AI готов к работе!', {
    reply_markup: { inline_keyboard: [[{ text: '🚀 Открыть чат-рулетку', web_app: { url: process.env.RENDER_EXTERNAL_URL || 'https://withoutmask-app.onrender.com' } }]] }
  });
});

bot.on('pre_checkout_query', (q) => bot.answerPreCheckoutQuery(q.id, true));
bot.on('successful_payment', (msg) => { getUser(msg.from.id).credits++; });

app.get('/', (req, res) => res.send(config.htmlTemplate));

app.post('/api/scan', async (req, res) => {
  const user = getUser(req.body.uid);
  if (user.credits < 1) return res.json({ error: 'Нужен кредит или друг!' });
  user.credits--;
  if (!process.env.AI_API_KEY) return res.json({ credits: user.credits, result: '🎭 [ТЕСТ] Искренность 88%.' });
  try {
    const apiUrl = 'https://api.proxyapi.ru' + '/openai/v1/chat/completions';
    const ai = await axios.post(apiUrl, {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: `Проверь видео на ложь и эмоции: ${req.body.url}` }]
    }, { headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` } });
    res.json({ credits: user.credits, result: ai.data.choices[0].message.content });
  } catch (e) {
    user.credits++;
    const err = e.response?.data?.error?.message || e.message;
    res.json({ credits: user.credits, error: 'Ошибка: ' + err });
  }
});

app.post('/api/invoice', async (req, res) => {
  try {
    const link = await bot.createInvoiceLink('1 проверка', 'Разбор видео', 'c1', '', 'XTR', [{ label: 'Кредит', amount: 35 }]);
    res.json({ link });
  } catch (e) { res.json({ error: 'Ошибка счета' }); }
});

app.listen(process.env.PORT || 3000, () => console.log('Engine online'));



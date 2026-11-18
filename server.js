user.credits -= 1;
  if (!AI_API_KEY) {
    return res.json({ credits: user.credits, result: '🎭 [ТЕСТОВЫЙ РЕЖИМ] ИИ-Анализ мимики: Искренность 88%. Собеседник спокоен. Подключите ключ в ProxyAPI для полного боевого разбора.' });
  }
  
  try {
    const ai = await axios.post(`${AI_BASE_URL}/chat/completions`, {
      model: 'deepseek/deepseek-v4.1-flash-1017',
      messages: [{ role: 'user', content: `Проанализируй видео на признаки лжи, стресса и скрытого давления: ${url}` }]
    }, { headers: { Authorization: `Bearer ${AI_API_KEY}` } });
    res.json({ credits: user.credits, result: ai.data.choices[0].message.content });
  } catch (e) {
    user.credits += 1; // Автовозврат токена честному пользователю при сбое сети
    res.json({ credits: user.credits, error: 'Ошибка связи с ИИ. Кредит возвращен на ваш баланс.' });
  }
});

// Встроенный платежный шлюз Telegram Stars
app.post('/api/invoice', async (req, res) => {
  try {
    const link = await bot.createInvoiceLink('1 ИИ-проверка', 'Полный разбор искренности видео + перевод', 'credit_1', '', 'XTR', [{ label: 'Купить 1 кредит', amount: 35 }]);
    res.json({ link });
  } catch (e) {
    res.json({ error: 'Ошибка генерации счета' });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('WithoutMask server started'));

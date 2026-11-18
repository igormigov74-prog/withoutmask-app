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

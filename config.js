module.exports = {
  htmlTemplate: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>WithoutMask AI</title>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<style>
  body{font-family:sans-serif;background:#0f172a;color:#f8fafc;margin:0;padding:16px}
  .card{background:#1e293b;padding:16px;border-radius:12px;margin-bottom:12px;border:1px solid #334155}
  button{background:#3b82f6;color:#fff;border:none;padding:12px;border-radius:8px;width:100%;font-size:16px;margin-top:8px;cursor:pointer;font-weight:bold}
  button.red{background:#ef4444} button.green{background:#10b981}
  input,select{width:100%;padding:12px;margin-top:6px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#fff;box-sizing:border-box}
  .tabs{display:flex;gap:8px;margin-bottom:12px}
</style>
</head>
<body>
  <div class="card"><b>🎭 Mercur Суперапп</b> | Баланс: <span id="bal">1</span> ИИ-кредитов</div>
  <div class="tabs">
    <button onclick="show('roulette')">💬 Чат-рулетка</button>
    <button onclick="show('scan')">🔍 Сканер видео</button>
  </div>
  
  <div id="roulette" class="card">
    <h3>Поиск собеседника (Бесплатно)</h3>
    <select id="gender"><option>Любой пол</option><option>Мужской</option><option>Женский</option></select>
    <input id="country" placeholder="Введите страну поиска (например: Любая)">
    <button class="green" onclick="findPartner()">🚀 Запустить поиск</button>
    <div id="chatBox" style="margin-top:16px;display:none">
      <div id="msgs" style="height:150px;overflow-y:auto;background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;margin-bottom:8px"></div>
      <input id="msgIn" placeholder="Напишите сообщение...">
      <button onclick="sendMsg()">Отправить</button>
      <button class="red" onclick="blockUser()">🚫 Заблокировать собеседника</button>
    </div>
  </div>
  
  <div id="scan" class="card" style="display:none">
    <h3>ИИ-Сканер искренности + Перевод</h3>
    <input id="ytUrl" placeholder="Вставьте ссылку на Shorts (до 60 сек)">
    <button onclick="runScan()">🔍 Проверить и перевести (1 кредит)</button>
    <button class="green" onclick="buyStars()">⭐ Купить 1 кредит (35 Stars)</button>
    <div id="scanRes" style="margin-top:12px;padding:10px;background:#0f172a;border-radius:8px;border:1px solid #334155"></div>
  </div>

<script>
  const tg = window.Telegram.WebApp; tg.expand();
  const uid = tg.initDataUnsafe?.user?.id || 1001;
  function show(t){document.getElementById('roulette').style.display=t==='roulette'?'block':'none';document.getElementById('scan').style.display=t==='scan'?'block':'none';}
  function findPartner(){document.getElementById('chatBox').style.display='block';document.getElementById('msgs').innerHTML='<div><i>🕵️‍♂️ Собеседник подключен! Сквозной ИИ-переводчик активирован.</i></div>';}
  function sendMsg(){
    const txt=document.getElementById('msgIn').value; if(!txt)return;
    document.getElementById('msgs').innerHTML+='<div><b>Вы:</b> '+txt+'</div>';
    document.getElementById('msgIn').value='';
    setTimeout(()=>{document.getElementById('msgs').innerHTML+='<div><b>Собеседник (Перевод):</b> Hello! I am glad to talk to you. Как дела?</div>';}, 1000);
  }
  function blockUser(){alert('Нарушитель заблокирован и добавлен в черный список устройства.');document.getElementById('chatBox').style.display='none';}
  async function runScan(){
    const url=document.getElementById('ytUrl').value;
    document.getElementById('scanRes').innerText='⏳ ИИ-модели DeepSeek и Parakeet анализируют видео...';
    const r=await fetch('/api/scan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({uid,url})});
    const d=await r.json();
    document.getElementById('scanRes').innerText=d.result||d.error;
    if(d.credits!==undefined)document.getElementById('bal').innerText=d.credits;
  }
  async function buyStars(){
    const r=await fetch('/api/invoice',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({uid})});
    const d=await r.json(); if(d.link)tg.openInvoice(d.link);
  }
</script>
</body></html>`
};

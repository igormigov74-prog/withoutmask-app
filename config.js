module.exports = {
  htmlTemplate: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>WithoutMask AI</title><script src="https://telegram.org"></script>
<style>
body{font-family:sans-serif;background:#0f172a;color:#f8fafc;margin:0;padding:16px}
.card{background:#1e293b;padding:16px;border-radius:12px;margin-bottom:12px;border:1px solid #334155}
button{background:#3b82f6;color:#fff;border:none;padding:12px;border-radius:8px;width:100%;font-size:15px;margin-top:8px;cursor:pointer;font-weight:bold}
button.red{background:#ef4444} button.green{background:#10b981} button.gold{background:#eab308;color:#000}
input,select{width:100%;padding:12px;margin-top:6px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#fff;box-sizing:border-box}
.row{display:flex;gap:8px;margin-bottom:12px}
.wbox{background:#0f172a;padding:10px;border-radius:8px;border:1px dashed #eab308;margin-top:10px;word-break:break-all;font-size:13px}
</style></head><body>
<div class="card" style="display:flex;justify-content:space-between;align-items:center">
  <div><b>🎭 WithoutMask</b> | <span id="t_bal">Баланс</span>: <b id="bal">1</b></div>
  <select id="lang" onchange="setLang(this.value)" style="width:auto;padding:6px;margin:0">
    <option value="ru">🇷🇺 RU</option><option value="en">🇺🇸 EN</option><option value="zh">🇨🇳 ZH</option><option value="es">🇪🇸 ES</option><option value="ar">🇦🇪 AR</option>
  </select>
</div>
<div class="row">
  <button onclick="show('r')" id="t_tab1">💬 Чат-рулетка</button>
  <button onclick="show('s')" id="t_tab2">🔍 Сканер видео</button>
</div>
<div id="r" class="card">
  <h3 id="t_h1">Поиск собеседника (Бесплатно)</h3>
  <select id="gender"><option value="any" id="t_g0">Любой пол</option><option value="m" id="t_g1">Мужской</option><option value="f" id="t_g2">Женский</option></select>
  <input id="country" placeholder="Страна / Country / 国家 / País / البلد">
  <button class="green" onclick="find()" id="t_find">🚀 Запустить поиск</button>
  <div id="box" style="margin-top:14px;display:none">
    <div id="msgs" style="height:140px;overflow-y:auto;background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155"></div>
    <input id="in" placeholder="Сообщение / Message / 消息 / Mensaje / رسالة">
    <button onclick="send()" id="t_send">Отправить</button>
    <button class="red" onclick="blk()" id="t_blk">🚫 Заблокировать</button>
  </div>
</div>
<div id="s" class="card" style="display:none">
  <h3 id="t_h2">ИИ-Сканер искренности + Перевод</h3>
  <input id="url" placeholder="YouTube Shorts URL (max 60s)">
  <button onclick="scan()" id="t_scan">🔍 Проверить (1 кредит)</button>
  <button class="green" onclick="stars()" id="t_stars">⭐ Купить (35 Stars)</button>
  <button class="gold" onclick="usdt()" id="t_usdt">💎 Оплатить 0.75 USDT</button>
  <div id="wbox" class="wbox" style="display:none">
    <div id="t_pay">Сеть: <b>USDT (TRC20)</b> — Отправьте <b>0.75 USDT</b>:</div>
    <div id="waddr" style="color:#eab308;margin:6px 0;font-weight:bold">TDmZnNY78jqZ3nzahva9eyQkvEff8MDnvT</div>
    <button onclick="cpW()" id="t_cp" style="padding:8px;font-size:13px">📋 Скопировать адрес</button>
  </div>
  <div id="res" style="margin-top:12px;padding:10px;background:#0f172a;border-radius:8px;border:1px solid #334155"></div>
</div>
<script>
const tg=window.Telegram?.WebApp; if(tg)tg.expand();
const uid=tg?.initDataUnsafe?.user?.id||1001;
const D={
  ru:{bal:'Баланс',tab1:'💬 Чат-рулетка',tab2:'🔍 Сканер видео',h1:'Поиск собеседника (Бесплатно)',g0:'Любой пол',g1:'Мужской',g2:'Женский',find:'🚀 Запустить поиск',send:'Отправить',blk:'🚫 Заблокировать',h2:'ИИ-Сканер искренности + Перевод',scan:'🔍 Проверить (1 кредит)',stars:'⭐ Купить (35 Stars)',usdt:'💎 Оплатить 0.75 USDT',pay:'Сеть: USDT (TRC20) — Отправьте 0.75 USDT:',cp:'📋 Скопировать адрес'},
  en:{bal:'Credits',tab1:'💬 Chat Roulette',tab2:'🔍 Video Scanner',h1:'Find Partner (Free)',g0:'Any Gender',g1:'Male',g2:'Female',find:'🚀 Start Search',send:'Send',blk:'🚫 Block User',h2:'AI Lie Detector + Translate',scan:'🔍 Analyze (1 Credit)',stars:'⭐ Buy (35 Stars)',usdt:'💎 Pay 0.75 USDT',pay:'Network: USDT (TRC20) — Send 0.75 USDT:',cp:'📋 Copy Wallet'},
  zh:{bal:'余额',tab1:'💬 随机聊天',tab2:'🔍 视频测谎仪',h1:'寻找聊天伙伴 (免费)',g0:'不限性别',g1:'男',g2:'女',find:'🚀 开始匹配',send:'发送',blk:'🚫 屏蔽用户',h2:'AI 测谎与实时翻译',scan:'🔍 开始检测 (1 积分)',stars:'⭐ 购买 (35 Stars)',usdt:'💎 支付 0.75 USDT',pay:'网络: USDT (TRC20) — 请转账 0.75 USDT:',cp:'📋 复制地址'},
  es:{bal:'Créditos',tab1:'💬 Ruleta de Chat',tab2:'🔍 Escáner de Video',h1:'Buscar Pareja (Gratis)',g0:'Cualquier género',g1:'Hombre',g2:'Mujer',find:'🚀 Iniciar Búsqueda',send:'Enviar',blk:'🚫 Bloquear',h2:'Detector de Mentiras IA',scan:'🔍 Analizar (1 Crédito)',stars:'⭐ Comprar (35 Stars)',usdt:'💎 Pagar 0.75 USDT',pay:'Red: USDT (TRC20) — Envía 0.75 USDT:',cp:'📋 Copiar Dirección'},
  ar:{bal:'الرصيد',tab1:'💬 دردشة عشوائية',tab2:'🔍 فاحص الفيديو',h1:'البحث عن شريك (مجاني)',g0:'أي جنس',g1:'ذكر',g2:'أنثى',find:'🚀 بدء البحث',send:'إرسال',blk:'🚫 حظر المستخدم',h2:'كاشف الكذب والترجمة AI',scan:'🔍 تحليل (1 رصيد)',stars:'⭐ شراء (35 Stars)',usdt:'💎 دفع 0.75 USDT',pay:'الشبكة: USDT (TRC20) — أرسل 0.75 USDT:',cp:'📋 نسخ العنوان'}
};
function setLang(l){const t=D[l]||D.en;for(let k in t){const e=document.getElementById('t_'+k);if(e)e.innerText=t[k];}}
const ul=(tg?.initDataUnsafe?.user?.language_code||navigator.language||'en').slice(0,2);
const initL=D[ul]?ul:'en'; document.getElementById('lang').value=initL; setLang(initL);
function show(x){document.getElementById('r').style.display=x==='r'?'block':'none';document.getElementById('s').style.display=x==='s'?'block':'none';}
function find(){document.getElementById('box').style.display='block';document.getElementById('msgs').innerHTML='<div><i>Connected! AI Auto-Translate ON.</i></div>';}
function send(){const v=document.getElementById('in').value;if(!v)return;document.getElementById('msgs').innerHTML+='<div><b>You:</b> '+v+'</div>';document.getElementById('in').value='';}
function blk(){alert('Blocked!');document.getElementById('box').style.display='none';}
async function scan(){
  const url=document.getElementById('url').value;document.getElementById('res').innerText='⏳ AI analyzing...';
  const r=await fetch('/api/scan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({uid,url})});
  const d=await r.json();document.getElementById('res').innerText=d.result||d.error;
  if(d.credits!==undefined)document.getElementById('bal').innerText=d.credits;
}
async function stars(){const r=await fetch('/api/invoice',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({uid})});const d=await r.json();if(d.link&&tg)tg.openInvoice(d.link);}
function usdt(){const w=document.getElementById('wbox');w.style.display=w.style.display==='none'?'block':'none';}
function cpW(){navigator.clipboard.writeText('TDmZnNY78jqZ3nzahva9eyQkvEff8MDnvT');alert('Copied! / Скопировано!');}
</script></body></html>`
};

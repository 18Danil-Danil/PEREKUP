/* ================= DATA ================= */
const CAR_DB = [
  { name:"ВАЗ 2107", price:80000, market:120000, icon:"🚗" },
  { name:"ВАЗ 2110", price:150000, market:220000, icon:"🚙" },
  { name:"Приора", price:250000, market:380000, icon:"🚘" },
  { name:"Лада Гранта", price:350000, market:500000, icon:"🚗" },
  { name:"Kia Rio", price:450000, market:650000, icon:"🚗" },
  { name:"Hyundai Solaris", price:500000, market:720000, icon:"🚙" },
  { name:"Nissan Qashqai", price:900000, market:1300000, icon:"🚙" },
  { name:"Toyota Camry", price:1200000, market:1700000, icon:"🚘" },
  { name:"BMW 5 серии", price:1800000, market:2500000, icon:"🏎" },
  { name:"Mercedes E-класс", price:2200000, market:3000000, icon:"🏎" },
  { name:"Audi A6", price:2000000, market:2800000, icon:"🏎" },
  { name:"Lexus RX", price:2500000, market:3400000, icon:"🚙" },
  { name:"Porsche Cayenne", price:3500000, market:4500000, icon:"🏎" },
  { name:"Tesla Model 3", price:3000000, market:4000000, icon:"⚡" },
  { name:"УАЗ Патриот", price:800000, market:1100000, icon:"🚙" },
  { name:"Lada Vesta", price:600000, market:850000, icon:"🚗" },
  { name:"Skoda Octavia", price:1100000, market:1600000, icon:"🚗" },
  { name:"VW Polo", price:550000, market:780000, icon:"🚗" },
  { name:"Renault Logan", price:400000, market:550000, icon:"🚗" },
  { name:"Ford Focus", price:700000, market:1000000, icon:"🚗" }
];

const DEFECTS_VISIBLE = [
  "Царапина на бампере", "Битый фонарь", "Потёртый салон",
  "Не работает кондиционер", "Мятая дверь"
];
const DEFECTS_HIDDEN = [
  "Шпаклёвка на крыле", "Скрученный пробег", "Течь масла",
  "Стучит подвеска", "Скрытая коррозия", "Заменённый кузов"
];

const TUNING = [
  { name:"Спойлер", price:15000, bonus:25000 },
  { name:"Литые диски", price:30000, bonus:50000 },
  { name:"Магнитола", price:10000, bonus:15000 },
  { name:"Сигнализация", price:20000, bonus:30000 },
  { name:"Ксенон", price:12000, bonus:18000 },
  { name:"Тонировка", price:8000, bonus:12000 },
  { name:"Обвес", price:40000, bonus:60000 },
  { name:"Кожаный салон", price:50000, bonus:70000 },
  { name:"Спортсиденья", price:35000, bonus:50000 },
  { name:"Спортруль", price:18000, bonus:25000 },
  { name:"Прямоток", price:22000, bonus:32000 },
  { name:"Заниженная подвеска", price:45000, bonus:65000 },
  { name:"Карбон", price:28000, bonus:40000 },
  { name:"Панорама", price:60000, bonus:85000 },
  { name:"Магнитола Pro", price:25000, bonus:35000 },
  { name:"Турбина", price:80000, bonus:120000 },
  { name:"Спортвыхлоп", price:32000, bonus:45000 }
];

const NUMBERS_POOL = [
  { num:"А001АА", region:77, price:150000 },
  { num:"Е777КХ", region:77, price:500000 },
  { num:"О005ОК", region:99, price:200000 },
  { num:"Х555ХХ", region:77, price:350000 },
  { num:"АМР", region:77, price:800000 },
  { num:"ЕКХ", region:77, price:900000 },
  { num:"Т001ТТ", region:77, price:250000 },
  { num:"Р005ОК", region:99, price:300000 },
  { num:"123", region:716, price:100000 },
  { num:"911", region:99, price:180000 },
  { num:"228", region:99, price:90000 },
  { num:"112", region:77, price:70000 },
  { num:"102", region:77, price:60000 },
  { num:"314", region:99, price:50000 }
];

const APARTMENTS = [
  { name:"Студия", price:2000000, rent:15000, icon:"🏢" },
  { name:"1-комн.", price:3500000, rent:25000, icon:"🏢" },
  { name:"2-комн.", price:5500000, rent:40000, icon:"🏬" },
  { name:"3-комн.", price:8000000, rent:60000, icon:"🏬" },
  { name:"Загородный дом", price:15000000, rent:100000, icon:"🏡" }
];

const Apps = {};

/* ================= CORE ================= */
const Game = {
  state: null,
  init() {
    let saved = null;
    try { saved = localStorage.getItem('perekup_save'); } catch(e){}
    if (saved) {
      try { this.state = JSON.parse(saved); } catch(e) { this.newGame(); }
    } else {
      this.newGame();
    }
    this.migrate();
    if (!this.state.listings || this.state.listings.length === 0) this.spawnListings(12);
    this.save();
    setInterval(() => this.tick(), 60000);
  },
  migrate() {
    const s = this.state;
    if (!s) return;
    if (!s.tools) s.tools = { thickness:false, obd:false, mileage:false };
    if (!s.numbersOwned) s.numbersOwned = [];
    if (!s.apartments) s.apartments = [];
    if (!s.taxiDrivers) s.taxiDrivers = [];
    if (!s.family) s.family = {
      mom:{trust:50,lastGift:0}, grandma:{trust:50,lastGift:0}, grandpa:{trust:50,lastGift:0}
    };
    if (!s.stats) s.stats = { bought:0, sold:0, profit:0, tuningsInstalled:0, numbersSold:0 };
    if (!s.stats.tuningsInstalled) s.stats.tuningsInstalled = 0;
    if (!s.stats.numbersSold) s.stats.numbersSold = 0;
    this.save();
  },
  newGame() {
    this.state = {
      money:300000, day:1, hour:12, level:1, xp:0, reputation:5,
      garage:[], listings:[], nextId:1, debt:0,
      tools:{thickness:false,obd:false,mileage:false},
      numbersOwned:[], apartments:[], taxiDrivers:[],
      family:{
        mom:{trust:50,lastGift:0},
        grandma:{trust:50,lastGift:0},
        grandpa:{trust:50,lastGift:0}
      },
      stats:{ bought:0, sold:0, profit:0, tuningsInstalled:0, numbersSold:0 }
    };
    this.spawnListings(12);
    this.save();
  },
  spawnListings(n) {
    for (let i = 0; i < n; i++) {
      const id = this.state.nextId++;
      this.state.listings.push(generateListing(id));
    }
  },
  tick() {
    this.state.hour++;
    if (this.state.hour >= 24) {
      this.state.hour = 0;
      this.state.day++;
      this.spawnListings(2);
      const rent = this.state.apartments.reduce((s,a)=>s+a.rent,0);
      const taxi = this.state.taxiDrivers.reduce((s,d)=>s+d.income,0);
      this.state.money += rent + taxi;
      this.state.taxiDrivers.forEach(d => {
        if (Math.random() < 0.15) {
          const car = this.state.garage.find(c => c.id === d.carId);
          if (car) car.defects.push("ДТП в такси");
        }
      });
    }
    this.save();
    if (window.UI) UI.updateStatus();
  },
  save() { try { localStorage.setItem('perekup_save', JSON.stringify(this.state)); } catch(e){} },
  fmt(n) { return n.toLocaleString('ru-RU') + ' ₽'; },
  addXP(n) {
    this.state.xp += n;
    while (this.state.xp >= this.state.level * 100) {
      this.state.xp -= this.state.level * 100;
      this.state.level++;
    }
  }
};

function randomDefects() {
  const n = Math.floor(Math.random() * 3);
  const res = [];
  for (let i = 0; i < n; i++) res.push(DEFECTS_VISIBLE[Math.floor(Math.random()*DEFECTS_VISIBLE.length)]);
  return [...new Set(res)];
}
function randomHiddenDefects() {
  const n = Math.floor(Math.random() * 2);
  const res = [];
  for (let i = 0; i < n; i++) res.push(DEFECTS_HIDDEN[Math.floor(Math.random()*DEFECTS_HIDDEN.length)]);
  return [...new Set(res)];
}
function generateListing(id) {
  const base = CAR_DB[Math.floor(Math.random() * CAR_DB.length)];
  const price = Math.round(base.price * (0.6 + Math.random()*0.5) / 1000) * 1000;
  const hasNumber = Math.random() < 0.3;
  const number = hasNumber ? NUMBERS_POOL[Math.floor(Math.random()*NUMBERS_POOL.length)] : null;
  return {
    id, name:base.name, icon:base.icon, price, market:base.market,
    defects: randomDefects(), hiddenDefects: randomHiddenDefects(), inspected:false,
    year: 2005 + Math.floor(Math.random()*18),
    mileage: 50000 + Math.floor(Math.random()*250000),
    seller: ["Алексей","Дмитрий","Сергей","Марина","Ольга"][Math.floor(Math.random()*5)],
    number, sold:false
  };
}

/* ================= APPS ================= */

Apps.avtobuy = {
  filter: '',
  render() {
    const s = document.getElementById('screen');
    let list = Game.state.listings.filter(l => !l.sold);
    if (this.filter) list = list.filter(l => l.name.toLowerCase().includes(this.filter.toLowerCase()));
    s.innerHTML = `
      <div class="header"><span class="back" onclick="UI.back()">←</span><h2>AvtoBuy</h2></div>
      <input placeholder="Поиск..." value="${this.filter}" oninput="Apps.avtobuy.setFilter(this.value)">
      ${list.map(l => `
        <div class="card" onclick="Apps.avtobuy.detail(${l.id})" style="cursor:pointer">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h3>${l.icon} ${l.name} <span style="color:#888;font-size:12px">${l.year}</span></h3>
            <div class="price">${Game.fmt(l.price)}</div>
          </div>
          <div class="market">Рынок: ${Game.fmt(l.market)} · ${l.mileage.toLocaleString('ru-RU')} км${l.number?' · 🔢'+l.number.num:''}</div>
          ${l.defects.length ? `<div class="defect">⚠ ${l.defects.length} дефект(ов)</div>` : '<div class="good">✓ Без видимых дефектов</div>'}
        </div>`).join('') || '<p style="color:#888">Ничего не найдено</p>'}
    `;
  },
  setFilter(v) { this.filter = v; this.render(); },
  detail(id) {
    const l = Game.state.listings.find(x => x.id === id);
    if (!l) return;
    const s = document.getElementById('screen');
    s.innerHTML = `
      <div class="header"><span class="back" onclick="Apps.avtobuy.render()">←</span><h2>${l.icon} ${l.name}</h2></div>
      <div class="card">
        <div>Год: ${l.year} · Пробег: ${l.mileage.toLocaleString('ru-RU')} км</div>
        <div>Цена: <span class="price">${Game.fmt(l.price)}</span></div>
        <div class="market">Рынок: ${Game.fmt(l.market)}</div>
        ${l.number?`<div style="margin-top:6px">🔢 ${l.number.num} (${l.number.region} рег.)</div>`:''}
      </div>
      <div class="card">
        <h3>Дефекты</h3>
        ${l.defects.length?l.defects.map(d=>`<div class="defect">⚠ ${d}</div>`).join(''):'<div class="good">✓ Видимых нет</div>'}
        ${l.inspected
          ? (l.hiddenDefects.length?l.hiddenDefects.map(d=>`<div class="defect">🚨 ${d}</div>`).join(''):'<div class="good">✓ Скрытых нет</div>')
          : '<div style="color:#888;font-size:13px;margin-top:8px">Скрытые дефекты не проверены</div>'}
      </div>
      <div class="btn-row">
        ${!l.inspected?`<button class="gray" onclick="Apps.avtobuy.inspect(${l.id})">🔍 Осмотреть</button>`:''}
        <button class="green" onclick="Apps.avtobuy.buy(${l.id}, false)">Купить</button>
      </div>
      <div class="btn-row">
        <button onclick="Apps.avtobuy.buy(${l.id}, true)">💰 С задатком (-10%, риск)</button>
        <button class="gray" onclick="Apps.avtobuy.bargain(${l.id})">Торг</button>
      </div>
    `;
  },
  inspect(id) {
    const l = Game.state.listings.find(x => x.id === id);
    if (!l) return;
    const t = Game.state.tools;
    if (!t.thickness && !t.obd) return alert('Нужен толщиномер или OBD-сканер. Купи в Магазине.');
    const keep = [];
    l.hiddenDefects.forEach(d => {
      if (t.thickness && (d.includes('Шпаклёвка') || d.includes('коррозия') || d.includes('кузов'))) keep.push(d);
      if (t.obd && (d.includes('пробег') || d.includes('Течь') || d.includes('подвеска'))) keep.push(d);
    });
    l.hiddenDefects = keep;
    l.inspected = true;
    alert('Осмотр выполнен. Скрытых дефектов: ' + keep.length);
    this.detail(id);
  },
  buy(id, withDeposit) {
    const l = Game.state.listings.find(x => x.id === id);
    if (!l) return;
    let finalPrice = l.price;
    if (withDeposit) {
      if (Math.random() < 0.15) {
        Game.state.money -= 20000;
        l.sold = true;
        Game.save(); UI.updateStatus();
        alert('Мошенник! Задаток 20 000 ₽ утерян, объявление удалено.');
        this.render(); return;
      }
      finalPrice = Math.round(l.price * 0.9);
    }
    if (Game.state.money < finalPrice) return alert('Недостаточно денег!');
    Game.state.money -= finalPrice;
    l.sold = true;
    l.defects = [...l.defects, ...l.hiddenDefects];
    Game.state.garage.push({ ...l, price: finalPrice, tunings: [] });
    Game.state.stats.bought++;
    Game.addXP(20);
    Game.save(); UI.updateStatus();
    alert(`Куплено: ${l.name} за ${Game.fmt(finalPrice)}`);
    this.render();
  },
  bargain(id) {
    const l = Game.state.listings.find(x => x.id === id);
    if (!l) return;
    const disc = Math.round(l.price * 0.1);
    const success = Math.random() < 0.4 + Game.state.reputation * 0.03;
    if (success) { l.price = Math.max(0, l.price - disc); alert(`Скидка ${Game.fmt(disc)}`); }
    else { Game.state.reputation = Math.max(0, Game.state.reputation - 1); alert('Отказ. -1 репутация'); }
    Game.save(); UI.updateStatus();
    this.detail(id);
  }
};

Apps.garage = {
  render() {
    const s = document.getElementById('screen');
    const g = Game.state.garage;
    s.innerHTML = `
      <div class="header"><span class="back" onclick="UI.back()">←</span><h2>Гараж (${g.length})</h2></div>
      ${g.map((c,i) => `
        <div class="card">
          <h3>${c.icon} ${c.name}</h3>
          <div>Куплено: ${Game.fmt(c.price)} · Рынок: ${Game.fmt(c.market + (c.tunings||[]).reduce((s,t)=>s+t.bonus,0))}</div>
          ${c.number?`<div>🔢 ${c.number.num} (+${Game.fmt(c.number.price)})</div>`:''}
          ${c.defects.length?c.defects.map(d=>`<div class="defect">⚠ ${d}</div>`).join(''):'<div class="good">✓ Исправна</div>'}
          ${(c.tunings||[]).length?`<div class="good">🔧 ${c.tunings.map(t=>t.name).join(', ')}</div>`:''}
          <div class="btn-row">
            ${c.defects.length?`<button class="gray" onclick="Apps.garage.repair(${i})">Ремонт (${Game.fmt(c.defects.length*15000)})</button>`:''}
            <button class="gray" onclick="Apps.garage.tuneMenu(${i})">🔧 Тюнинг</button>
            <button class="green" onclick="Apps.garage.sell(${i})">Продать</button>
          </div>
        </div>`).join('') || '<p style="color:#888">Гараж пуст.</p>'}
    `;
  },
  repair(i) {
    const c = Game.state.garage[i];
    const cost = c.defects.length * 15000;
    if (!c.defects.length) return alert('Нечего чинить');
    if (Game.state.money < cost) return alert('Не хватает денег');
    Game.state.money -= cost;
    c.defects = [];
    c.market = Math.round(c.market * 0.95);
    Game.save(); UI.updateStatus();
    this.render(); alert('Отремонтировано');
  },
  tuneMenu(i) {
    const c = Game.state.garage[i];
    const owned = (c.tunings||[]).map(t=>t.name);
    const avail = TUNING.filter(t => !owned.includes(t.name));
    const s = document.getElementById('screen');
    s.innerHTML = `
      <div class="header"><span class="back" onclick="Apps.garage.render()">←</span><h2>Тюнинг: ${c.name}</h2></div>
      ${avail.length?avail.map(t=>`
        <div class="card" style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div>${t.name}</div>
            <div style="font-size:12px;color:#888">+${Game.fmt(t.bonus)}</div>
          </div>
          <button class="green" onclick="Apps.garage.tune(${i}, '${t.name}')">${Game.fmt(t.price)}</button>
        </div>`).join('') : '<p style="color:#888">Всё установлено</p>'}
    `;
  },
  tune(i, name) {
    const c = Game.state.garage[i];
    const t = TUNING.find(x => x.name === name);
    if (!t) return;
    if (Game.state.money < t.price) return alert('Недостаточно денег');
    if (!c.tunings) c.tunings = [];
    c.tunings.push(t);
    Game.state.money -= t.price;
    Game.state.stats.tuningsInstalled++;
    Game.addXP(10);
    Game.save(); UI.updateStatus();
    this.tuneMenu(i);
  },
  sell(i) {
    const c = Game.state.garage[i];
    let mp = c.market + (c.tunings||[]).reduce((s,t)=>s+t.bonus,0) + (c.number?c.number.price:0);
    const sellPrice = Math.round(mp * (0.85 + Math.random()*0.2));
    Game.state.money += sellPrice;
    const spent = c.price + (c.tunings||[]).reduce((s,t)=>s+t.price,0);
    Game.state.stats.profit += sellPrice - spent;
    Game.state.stats.sold++;
    Game.state.garage.splice(i, 1);
    Game.addXP(30);
    Game.save(); UI.updateStatus();
    this.render();
    alert(`Продано за ${Game.fmt(sellPrice)}\nПрофит: ${Game.fmt(sellPrice - spent)}`);
  }
};

Apps.shop = {
  render() {
    const tools = [
      { id:'thickness', name:'Толщиномер', price:30000, icon:'📏', desc:'Показывает шпаклёвку и коррозию' },
      { id:'obd', name:'OBD-сканер', price:50000, icon:'🔌', desc:'Скрытые дефекты и пробег' },
      { id:'mileage', name:'Корректор пробега', price:80000, icon:'⏮', desc:'Задел на будущее (пока не активен)' }
    ];
    const s = document.getElementById('screen');
    s.innerHTML = `
      <div class="header"><span class="back" onclick="UI.back()">←</span><h2>Магазин 🛒</h2></div>
      ${tools.map(t => {
        const owned = Game.state.tools[t.id];
        return `<div class="card">
          <h3>${t.icon} ${t.name}</h3>
          <div style="font-size:13px;color:#888">${t.desc}</div>
          <div style="margin-top:8px">${owned?'<span class="good">✓ Куплено</span>':`<button class="green" onclick="Apps.shop.buy('${t.id}')">${Game.fmt(t.price)}</button>`}</div>
        </div>`;
      }).join('')}
    `;
  },
  buy(id) {
    const prices = { thickness:30000, obd:50000, mileage:80000 };
    if (!prices[id]) return;
    if (Game.state.money < prices[id]) return alert('Недостаточно денег');
    Game.state.money -= prices[id];
    Game.state.tools[id] = true;
    Game.save(); UI.updateStatus();
    this.render();
  }
};

Apps.numbers = {
  render() {
    const s = document.getElementById('screen');
    s.innerHTML = `
      <div class="header"><span class="back" onclick="UI.back()">←</span><h2>Номера 🔢</h2></div>
      <h3 style="margin-bottom:10px">Рынок</h3>
      ${NUMBERS_POOL.map((n,i)=>`
        <div class="card" style="display:flex;justify-content:space-between;align-items:center">
          <div><div style="font-size:20px;font-weight:700">${n.num}</div><div style="font-size:12px;color:#888">${n.region} регион</div></div>
          <button class="green" onclick="Apps.numbers.buy(${i})">${Game.fmt(n.price)}</button>
        </div>`).join('')}
      <h3 style="margin:16px 0 10px">Мои (${Game.state.numbersOwned.length})</h3>
      ${Game.state.numbersOwned.length?Game.state.numbersOwned.map((n,i)=>`
        <div class="card" style="display:flex;justify-content:space-between;align-items:center">
          <div><div style="font-size:20px;font-weight:700">${n.num}</div><div style="font-size:12px;color:#888">${n.region} регион</div></div>
          <button class="gray" onclick="Apps.numbers.sell(${i})">Продать</button>
        </div>`).join(''):'<p style="color:#888">Пусто</p>'}
    `;
  },
  buy(i) {
    const n = NUMBERS_POOL[i];
    if (!n) return;
    if (Game.state.money < n.price) return alert('Недостаточно денег');
    Game.state.money -= n.price;
    Game.state.numbersOwned.push({ ...n });
    Game.save(); UI.updateStatus(); this.render();
  },
  sell(i) {
    const n = Game.state.numbersOwned[i];
    const p = Math.round(n.price * (0.8 + Math.random()*0.4));
    Game.state.money += p;
    Game.state.numbersOwned.splice(i,1);
    Game.state.stats.numbersSold++;
    Game.state.stats.profit += p - n.price;
    Game.addXP(15);
    Game.save(); UI.updateStatus(); this.render();
    alert(`Продан за ${Game.fmt(p)}`);
  }
};

Apps.bank = {
  render() {
    const s = document.getElementById('screen');
    s.innerHTML = `
      <div class="header"><span class="back" onclick="UI.back()">←</span><h2>П-Банк</h2></div>
      <div class="card" style="background:linear-gradient(135deg,#1e40af,#7c3aed)">
        <div style="font-size:12px;opacity:.8">Баланс</div>
        <div style="font-size:32px;font-weight:800">${Game.fmt(Game.state.money)}</div>
        <div style="font-size:12px;opacity:.8">Ур. ${Game.state.level} · Репутация ${Game.state.reputation}</div>
      </div>
      <div class="card">
        <h3>Кредит</h3>
        <p style="font-size:13px;color:#888;margin-bottom:8px">Лимит: ${Game.fmt(Game.state.level*200000)}</p>
        ${Game.state.debt>0
          ?`<div class="defect">Долг: ${Game.fmt(Game.state.debt)}</div>
             <button class="green" onclick="Apps.bank.repay()" style="width:100%;margin-top:8px">Погасить</button>`
          :`<div class="btn-row">
              <button onclick="Apps.bank.loan(50000)">Взять 50k</button>
              <button onclick="Apps.bank.loan(100000)">Взять 100k</button>
            </div>`}
      </div>
      <div class="card">
        <h3>Статистика</h3>
        <div>Куплено: ${Game.state.stats.bought}</div>
        <div>Продано: ${Game.state.stats.sold}</div>
        <div>Профит: ${Game.fmt(Game.state.stats.profit)}</div>
      </div>
    `;
  },
  loan(sum) {
    if (sum > Game.state.level*200000) return alert('Лимит превышен');
    if (Game.state.debt>0) return alert('Сначала погаси текущий');
    Game.state.money += sum;
    Game.state.debt = Math.round(sum*1.3);
    Game.save(); UI.updateStatus(); this.render();
  },
  repay() {
    if (Game.state.money < Game.state.debt) return alert('Не хватает');
    Game.state.money -= Game.state.debt;
    Game.state.debt = 0;
    Game.save(); UI.updateStatus(); this.render();
  }
};

Apps.messages = {
  render() {
    const s = document.getElementById('screen');
    const fam = Game.state.family;
    s.innerHTML = `
      <div class="header"><span class="back" onclick="UI.back()">←</span><h2>Сообщения</h2></div>
      ${[
        {key:'mom',name:'👩 Мама',preview:'Привет, сынок!'},
        {key:'grandma',name:'👵 Бабушка',preview:'Держи на дорогу 💰'},
        {key:'grandpa',name:'👴 Дедушка',preview:'Машины — это хорошо'}
      ].map(f=>`
        <div class="card" style="cursor:pointer" onclick="Apps.messages.chat('${f.key}')">
          <h3>${f.name}</h3>
          <div style="color:#888;font-size:13px">${f.preview}</div>
          <div style="font-size:12px;color:#4ade80;margin-top:4px">Доверие: ${fam[f.key].trust}%</div>
        </div>`).join('')}
    `;
  },
  chat(key) {
    const names = { mom:'👩 Мама', grandma:'👵 Бабушка', grandpa:'👴 Дедушка' };
    const fam = Game.state.family[key];
    const s = document.getElementById('screen');
    s.innerHTML = `
      <div class="header"><span class="back" onclick="Apps.messages.render()">←</span><h2>${names[key]}</h2></div>
      <div class="card"><div>Доверие: ${fam.trust}%</div></div>
      <div class="btn-row" style="flex-direction:column">
        <button onclick="Apps.messages.topic('${key}','how')">«Как дела?»</button>
        <button onclick="Apps.messages.topic('${key}','advice')">«Посоветуй»</button>
        <button onclick="Apps.messages.topic('${key}','brag')">«Похвастаться»</button>
        <button onclick="Apps.messages.topic('${key}','hard')">«Тяжёлый день…»</button>
        <button class="green" onclick="Apps.messages.gift('${key}')">💵 Попросить денег</button>
      </div>
    `;
  },
  topic(key, type) {
    const fam = Game.state.family[key];
    const names = { mom:'Мама', grandma:'Бабушка', grandpa:'Дедушка' };
    let reply = '';
    if (type === 'how') {
      const r = ['Всё хорошо, а у тебя?','Потихоньку','Скучаю!','Отлично, спасибо'];
      reply = r[Math.floor(Math.random()*r.length)];
      fam.trust = Math.min(100, fam.trust + 1);
    } else if (type === 'advice') {
      const r = ['Не бери без осмотра','Следи за налогами','Бери с умом','Не играй в казино!'];
      reply = r[Math.floor(Math.random()*r.length)];
      fam.trust = Math.min(100, fam.trust + 2);
    } else if (type === 'brag') {
      if (Game.state.stats.bought >= 1) { reply = 'Молодец! Горжусь!'; fam.trust = Math.min(100, fam.trust+3); }
      else reply = 'А чем хвастаться?';
    } else if (type === 'hard') {
      if (fam.trust > 60 && Math.random() < 0.3) {
        const m = 5000 + Math.floor(Math.random()*10000);
        Game.state.money += m;
        reply = `Держи ${Game.fmt(m)}, держись!`;
      } else reply = 'Всё наладится';
    }
    Game.save(); UI.updateStatus();
    alert(`${names[key]}: ${reply}`);
  },
  gift(key) {
    const fam = Game.state.family[key];
    if (fam.lastGift && Game.state.day - fam.lastGift < 7) return alert('Уже давали на этой неделе');
    if (fam.trust < 30) return alert('Сначала пообщайся, доверие низкое');
    const sum = (key==='grandma'?15000:key==='grandpa'?20000:25000) + Math.floor(Math.random()*10000);
    Game.state.money += sum;
    fam.lastGift = Game.state.day;
    fam.trust = Math.max(0, fam.trust - 5);
    Game.save(); UI.updateStatus();
    alert(`+${Game.fmt(sum)} 💰`);
  }
};

Apps.casino = {
  minesState: { active:false, bet:0, mines:[], revealed:[], mult:1 },
  render() {
    const s = document.getElementById('screen');
    s.innerHTML = `
      <div class="header"><span class="back" onclick="UI.back()">←</span><h2>Casino 🎰</h2></div>
      <div class="card">
        <h3>Слоты</h3>
        <div style="font-size:13px;color:#888;margin-bottom:8px">Ставка 10 000 ₽</div>
        <button onclick="Apps.casino.slots()">Крутить</button>
      </div>
      <div class="card">
        <h3>Кейс Перекупа</h3>
        <div style="font-size:13px;color:#888;margin-bottom:8px">50 000 ₽ · шанс на джекпот</div>
        <button class="green" onclick="Apps.casino.caseOpen()">Открыть</button>
      </div>
      <div class="card">
        <h3>Мины 💣</h3>
        ${this.minesState.active
          ?`<div>Множитель: ×${this.minesState.mult.toFixed(2)}</div>
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:8px">
              ${Array.from({length:25}).map((_,i)=>{
                const rev = this.minesState.revealed.includes(i);
                return `<div onclick="Apps.casino.minesClick(${i})" style="aspect-ratio:1;background:${rev?'#22c55e':'#2a2a3e'};border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center">${rev?'💎':''}</div>`;
              }).join('')}
            </div>
            <button class="green" style="width:100%;margin-top:8px" onclick="Apps.casino.minesCashout()">Забрать ${Game.fmt(Math.round(this.minesState.bet*this.minesState.mult))}</button>`
          :`<button onclick="Apps.casino.minesStart()">Начать (10 000 ₽)</button>`}
      </div>
      <div class="card">
        <h3>Кости 🎲</h3>
        <div style="font-size:13px;color:#888;margin-bottom:8px">Ставка 10k. Больше/меньше 7 = ×2, ровно 7 = ×6</div>
        <div class="btn-row">
          <button onclick="Apps.casino.dice('high')">Больше 7</button>
          <button onclick="Apps.casino.dice('low')">Меньше 7</button>
          <button onclick="Apps.casino.dice('seven')">Ровно 7</button>
        </div>
      </div>
    `;
  },
  slots() {
    if (Game.state.money < 10000) return alert('Мало денег');
    Game.state.money -= 10000;
    const r = () => Math.floor(Math.random()*5);
    const [a,b,c] = [r(),r(),r()];
    let win = 0;
    if (a===b&&b===c) win = 100000;
    else if (a===b||b===c||a===c) win = 20000;
    Game.state.money += win;
    Game.save(); UI.updateStatus(); this.render();
    alert(`🎰 ${a}${b}${c}\n${win?'Выигрыш: '+Game.fmt(win):'Проигрыш'}`);
  },
  caseOpen() {
    if (Game.state.money < 50000) return alert('Мало денег');
    Game.state.money -= 50000;
    const r = Math.random();
    let win = 0;
    if (r < 0.02) win = 500000;
    else if (r < 0.15) win = 100000;
    else if (r < 0.5) win = 60000;
    Game.state.money += win;
    Game.save(); UI.updateStatus(); this.render();
    alert(win>50000?`🎁 Джекпот! ${Game.fmt(win)}`:`🎁 ${Game.fmt(win)}`);
  },
  minesStart() {
    if (Game.state.money < 10000) return alert('Мало денег');
    Game.state.money -= 10000;
    const mines = [];
    while (mines.length < 5) {
      const m = Math.floor(Math.random()*25);
      if (!mines.includes(m)) mines.push(m);
    }
    this.minesState = { active:true, bet:10000, mines, revealed:[], mult:1 };
    Game.save(); UI.updateStatus(); this.render();
  },
  minesClick(i) {
    if (!this.minesState.active || this.minesState.revealed.includes(i)) return;
    if (this.minesState.mines.includes(i)) {
      this.minesState.active = false;
      Game.save(); UI.updateStatus(); this.render();
      return alert('💥 Мина!');
    }
    this.minesState.revealed.push(i);
    const mult = [1.2,1.5,1.9,2.4,3.0,3.7,4.6,5.7,7.0,8.6];
    this.minesState.mult = mult[this.minesState.revealed.length-1] || 10;
    this.render();
  },
  minesCashout() {
    if (!this.minesState.active) return;
    const win = Math.round(this.minesState.bet*this.minesState.mult);
    Game.state.money += win;
    this.minesState.active = false;
    Game.save(); UI.updateStatus(); this.render();
    alert(`Забрано: ${Game.fmt(win)}`);
  },
  dice(type) {
    if (Game.state.money < 10000) return alert('Мало денег');
    Game.state.money -= 10000;
    const d1 = 1+Math.floor(Math.random()*6);
    const d2 = 1+Math.floor(Math.random()*6);
    const sum = d1+d2;
    let mult = 0;
    if (type==='high'&&sum>7) mult=2;
    else if (type==='low'&&sum<7) mult=2;
    else if (type==='seven'&&sum===7) mult=6;
    const win = 10000*mult;
    Game.state.money += win;
    Game.save(); UI.updateStatus(); this.render();
    alert(`🎲 ${d1}+${d2}=${sum}\n${win?'+'+Game.fmt(win):'Проигрыш'}`);
  }
};

Apps.realestate = {
  render() {
    const s = document.getElementById('screen');
    s.innerHTML = `
      <div class="header"><span class="back" onclick="UI.back()">←</span><h2>Недвижимость 🏠</h2></div>
      <div class="card"><div>Доход/день: ${Game.fmt(Game.state.apartments.reduce((s,a)=>s+a.rent,0))}</div></div>
      <h3 style="margin-bottom:10px">Купить</h3>
      ${APARTMENTS.map((a,i)=>`
        <div class="card">
          <h3>${a.icon} ${a.name}</h3>
          <div>Цена: ${Game.fmt(a.price)}</div>
          <div class="good">+${Game.fmt(a.rent)}/день</div>
          <button class="green" style="margin-top:8px" onclick="Apps.realestate.buy(${i})">Купить</button>
        </div>`).join('')}
      <h3 style="margin:16px 0 10px">Моя (${Game.state.apartments.length})</h3>
      ${Game.state.apartments.length?Game.state.apartments.map((a,i)=>`
        <div class="card">
          <h3>${a.icon} ${a.name}</h3>
          <div class="good">+${Game.fmt(a.rent)}/день</div>
          <button class="gray" style="margin-top:8px" onclick="Apps.realestate.sell(${i})">Продать (${Game.fmt(Math.round(a.price*0.9))})</button>
        </div>`).join(''):'<p style="color:#888">Пусто</p>'}
    `;
  },
  buy(i) {
    const a = APARTMENTS[i];
    if (Game.state.money < a.price) return alert('Мало денег');
    Game.state.money -= a.price;
    Game.state.apartments.push({ ...a });
    Game.save(); UI.updateStatus(); this.render();
  },
  sell(i) {
    const a = Game.state.apartments[i];
    Game.state.money += Math.round(a.price*0.9);
    Game.state.apartments.splice(i,1);
    Game.save(); UI.updateStatus(); this.render();
  }
};

Apps.taxi = {
  render() {
    const s = document.getElementById('screen');
    const g = Game.state.garage;
    const drivers = Game.state.taxiDrivers;
    s.innerHTML = `
      <div class="header"><span class="back" onclick="UI.back()">←</span><h2>Таксопарк 🚕</h2></div>
      <div class="card">
        <div>Доход/день: ${Game.fmt(drivers.reduce((s,d)=>s+d.income,0))}</div>
        <div style="font-size:12px;color:#888;margin-top:4px">Водители иногда попадают в ДТП</div>
      </div>
      <h3 style="margin-bottom:10px">Машины</h3>
      ${g.length?g.map(c=>{
        const d = drivers.find(x=>x.carId===c.id);
        return `<div class="card">
          <h3>${c.icon} ${c.name}</h3>
          <div class="good">Доход: ${Game.fmt(Math.round(c.market*0.02))}/день</div>
          ${d
            ?`<button class="gray" style="margin-top:8px" onclick="Apps.taxi.fire(${c.id})">Уволить</button>`
            :`<button class="green" style="margin-top:8px" onclick="Apps.taxi.hire(${c.id})">Нанять</button>`}
        </div>`;
      }).join(''):'<p style="color:#888">Купи машину</p>'}
    `;
  },
  hire(carId) {
    const c = Game.state.garage.find(x=>x.id===carId);
    if (!c) return;
    if (Game.state.taxiDrivers.find(d=>d.carId===carId)) return alert('Уже есть');
    Game.state.taxiDrivers.push({ carId, income: Math.round(c.market*0.02) });
    Game.save(); UI.updateStatus(); this.render();
  },
  fire(carId) {
    Game.state.taxiDrivers = Game.state.taxiDrivers.filter(d=>d.carId!==carId);
    Game.save(); this.render();
  }
};

Apps.sleep = {
  render() {
    const s = document.getElementById('screen');
    s.innerHTML = `
      <div class="header"><span class="back" onclick="UI.back()">←</span><h2>Сон 💤</h2></div>
      <div class="card">
        <h3>Спать 8 часов</h3>
        <div style="font-size:13px;color:#888;margin-bottom:8px">Пропустить ночь</div>
        <button class="green" onclick="Apps.sleep.sleep()">Поспать</button>
      </div>
      <div class="card">
        <h3>Вздремнуть 2 часа</h3>
        <button onclick="Apps.sleep.nap()">Вздремнуть</button>
      </div>
    `;
  },
  sleep() {
    Game.state.hour += 8;
    if (Game.state.hour >= 24) {
      Game.state.hour = 0;
      Game.state.day++;
      const rent = Game.state.apartments.reduce((s,a)=>s+a.rent,0);
      const taxi = Game.state.taxiDrivers.reduce((s,d)=>s+d.income,0);
      Game.state.money += rent + taxi;
      Game.spawnListings(2);
    }
    Game.save(); UI.updateStatus();
    alert('Поспали'); UI.back();
  },
  nap() {
    Game.state.hour = (Game.state.hour + 2) % 24;
    Game.save(); UI.updateStatus();
    alert('Вздремнули'); UI.back();
  }
};

Apps.profile = {
  render() {
    const s = document.getElementById('screen');
    s.innerHTML = `
      <div class="header"><span class="back" onclick="UI.back()">←</span><h2>Профиль</h2></div>
      <div class="card" style="text-align:center">
        <div style="font-size:60px">👤</div>
        <h3>Перекуп</h3>
        <div>Ур. ${Game.state.level} · ${Game.state.xp}/${Game.state.level*100} XP</div>
        <div>Репутация: ${Game.state.reputation}</div>
      </div>
      <div class="card">
        <h3>Достижения</h3>
        <div>${Game.state.stats.bought>=1?'✅':'⬜'} Первая покупка</div>
        <div>${Game.state.stats.sold>=1?'✅':'⬜'} Первая продажа</div>
        <div>${Game.state.stats.sold>=10?'✅':'⬜'} 10 продаж</div>
        <div>${Game.state.stats.profit>=1000000?'✅':'⬜'} Профит 1 млн</div>
        <div>${Game.state.stats.tuningsInstalled>=5?'✅':'⬜'} 5 тюнингов</div>
        <div>${Game.state.stats.numbersSold>=1?'✅':'⬜'} Первый номер</div>
        <div>${Game.state.apartments.length>=1?'✅':'⬜'} Первая недвижимость</div>
      </div>
      <div class="btn-row">
        <button class="red" onclick="if(confirm('Сбросить?')){localStorage.removeItem('perekup_save');location.reload()}">Сброс</button>
      </div>
    `;
  }
};

/* ================= UI ================= */
const UI = {
  apps: [
    { id:'avtobuy', name:'AvtoBuy', icon:'🚗' },
    { id:'messages', name:'Сообщения', icon:'💬' },
    { id:'bank', name:'П-Банк', icon:'🏦' },
    { id:'garage', name:'Гараж', icon:'🔧' },
    { id:'casino', name:'Casino', icon:'🎰' },
    { id:'profile', name:'Профиль', icon:'👤' },
    { id:'shop', name:'Магазин', icon:'🛒' },
    { id:'numbers', name:'Номера', icon:'🔢' },
    { id:'realestate', name:'Недвижимость', icon:'🏠' },
    { id:'taxi', name:'Таксопарк', icon:'🚕' },
    { id:'sleep', name:'Сон', icon:'💤' }
  ],
  init() {
    Game.init();
    this.renderHome();
    this.updateStatus();
  },
  updateStatus() {
    document.getElementById('money').textContent = '💰 ' + Game.fmt(Game.state.money);
    const h = String(Game.state.hour).padStart(2,'0');
    document.getElementById('clock').textContent = `День ${Game.state.day}, ${h}:00`;
  },
  renderHome() {
    const s = document.getElementById('screen');
    s.innerHTML = `<div class="app-grid">` + this.apps.map(a =>
      `<div class="app-icon" onclick="UI.open('${a.id}')">
        <div class="icon">${a.icon}</div><span>${a.name}</span>
      </div>`).join('') + `</div>`;
    document.getElementById('dock').innerHTML = ['avtobuy','messages','bank','profile'].map(id => {
      const a = this.apps.find(x => x.id === id);
      return `<div class="dock-icon" onclick="UI.open('${id}')">${a.icon}</div>`;
    }).join('');
  },
  open(id) { if (Apps[id] && Apps[id].render) Apps[id].render(); },
  back() { this.renderHome(); this.updateStatus(); }
};

window.addEventListener('DOMContentLoaded', () => UI.init());
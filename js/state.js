// === КОНФИГУРАЦИИ ===

export const PLANTS_CONFIG = {
    carrot: { name: 'Морковь', baseTime: 5000, sellPrice: 8, icon: 'Plants/carrot_small.png', stages: 3, imgRoot: 'Plants/processed_carrot' },
    peas: { name: 'Горох', baseTime: 7000, sellPrice: 12, icon: 'Plants/peas_small.png', stages: 4, imgRoot: 'Plants/processed_peas' },
    wheat: { name: 'Пшеница', baseTime: 10000, sellPrice: 15, icon: 'Plants/wheat_small.png', stages: 3, imgRoot: 'Plants/processed_wheat' },
    melon: { name: 'Дыня', baseTime: 12000, sellPrice: 18, icon: 'Plants/melon_small.png', stages: 3, imgRoot: 'Plants/processed_melon' },
    grape: { name: 'Виноград', baseTime: 15000, sellPrice: 25, icon: 'Plants/grape_small.png', stages: 4, imgRoot: 'Plants/processed_Grape' }
};

export const TREES_CONFIG = {
    apple: {
        name: 'Яблоня', baseTime: 20000, fruitRegrowTime: 10000, sellPrice: 40, price: 50,
        icon: 'Trees/apple_seed.png', productIcon: 'Trees/apple_fruit.png', stages: 5, regrowStage: 4, imgRoot: 'Trees/apple_tree',
        customStyle: { width: '200%', bottom: '15px' }
    },
    mulberry: {
        name: 'Шелковица', baseTime: 30000, fruitRegrowTime: 15000, sellPrice: 60, price: 100,
        icon: 'Trees/mulberry_seed.png', productIcon: 'Trees/mulberry_fruit.png', stages: 5, regrowStage: 4, imgRoot: 'Trees/mulberry',
        customStyle: { width: '220%', bottom: '15px'}
    },
    lemon: {
        name: 'Лимон', baseTime: 40000, fruitRegrowTime: 20000, sellPrice: 80, price: 150,
        icon: 'Trees/lemon_seed.png', productIcon: 'Trees/lemon_fruit.png', stages: 5, regrowStage: 4, imgRoot: 'Trees/lemon_tree',
        customStyle: { width: '200%', bottom: '15px'}
    }
};

export const ANIMALS_CONFIG = {
    cow: {
        name: 'Корова', price: 150, food: 'wheat', product: 'milk', productName: 'Молоко', sellPrice: 25,
        growTime: 15000, produceTime: 10000, lifeTime: 120000,
        imgBaby: 'Animals/calf.png', imgAdult: 'Animals/cow.png', icon: 'Animals/cow.png', productIcon: 'Farm_general/milk.png'
    },
    chicken: {
        name: 'Курица', price: 50, food: 'peas', product: 'egg', productName: 'Яйцо', sellPrice: 10,
        growTime: 10000, produceTime: 5000, lifeTime: 60000,
        imgBaby: 'Animals/baby_chicken.png', imgAdult: 'Animals/Chicken.png', icon: 'Animals/Chicken.png', productIcon: 'Farm_general/egg.png'
    },
    sheep: {
        name: 'Овца', price: 120, food: 'carrot', product: 'wool', productName: 'Шерсть', sellPrice: 35,
        growTime: 12000, produceTime: 8000, lifeTime: 100000,
        imgBaby: 'Animals/baby_sheep.png', imgAdult: 'Animals/sheep.png', icon: 'Animals/sheep.png', productIcon: 'Farm_general/wool.png'
    }
};

export const PRODUCTS_CONFIG = {
    milk: { name: 'Молоко', sellPrice: 25, icon: 'Farm_general/milk.png' },
    egg: { name: 'Яйцо', sellPrice: 10, icon: 'Farm_general/egg.png' },
    wool: { name: 'Шерсть', sellPrice: 35, icon: 'Farm_general/wool.png' }
};

export const FERTILIZERS = {
    none: { name: 'Нет', price: 0, multiplier: 1.0, icon: 'Farm_general/cancel.png' },
    basic: { name: 'Обычное', price: 10, multiplier: 0.8, icon: 'Farm_general/fertilizer_small.png' },
    super: { name: 'Супер', price: 25, multiplier: 0.5, icon: 'Farm_general/super_fertilizer.png' }
};

export const BARN_LIMIT = 50;
const SAVE_KEY = 'my_farm_save_v1';

// === СОСТОЯНИЕ ИГРЫ ===

const initialState = {
    money: 50,
    plots: [],      // Огород
    treePlots: [],  // Сад
    animalPlots: {}, // Животные (объект по ID)
    barn: {},
    inventory: {
        basic: 0,
        super: 0,
        saplings: {},
        animals: { cow: 0, chicken: 0, sheep: 0 }
    },
    selectedFertilizer: 'none',
    lastSaveTime: Date.now()
};

// Текущее состояние
export let gameState = JSON.parse(JSON.stringify(initialState));

// DOM элементы
let coinDisplay = null;
let fertControls = null;
const uiSubscribers = [];

setTimeout(() => {
    coinDisplay = document.getElementById('coin-display');
    fertControls = document.getElementById('fert-controls');
}, 0);

// === ЛОГИКА СОХРАНЕНИЯ ===

export function saveGame() {
    gameState.lastSaveTime = Date.now();
    try {
        const serialized = JSON.stringify(gameState);
        localStorage.setItem(SAVE_KEY, serialized);
        console.log('Игра сохранена');
    } catch (e) {
        console.error('Ошибка сохранения:', e);
    }
}

export function loadGame() {
    try {
        const serialized = localStorage.getItem(SAVE_KEY);
        if (serialized) {
            const savedState = JSON.parse(serialized);
            Object.assign(gameState, savedState);

            const now = Date.now();
            const timePassed = now - (savedState.lastSaveTime || now);
            
            if (timePassed > 1000) {
                console.log(`Вас не было ${(timePassed/1000).toFixed(1)} сек.`);
                // Старим животных в оффлайне
                Object.values(gameState.animalPlots).forEach(animal => {
                     if (animal && animal.lifeRemaining > 0) {
                         animal.lifeRemaining -= timePassed;
                     }
                });
            }
            console.log('Сохранение загружено!');
            return true;
        }
    } catch (e) {
        console.error('Ошибка загрузки, сброс...', e);
        resetGame();
    }
    return false;
}

// Сброс (в консоли)
window.resetGame = function() {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
};

// Автосохранение
setInterval(saveGame, 5000);

// === ЛОГИКА UI ===

export function subscribeToUpdate(callback) {
    uiSubscribers.push(callback);
}

// !!! ВОТ ОНА, ЕДИНСТВЕННАЯ UPDATE UI !!!
export function updateUI() {
    if (!coinDisplay) {
        coinDisplay = document.getElementById('coin-display');
    }

    if (coinDisplay) {
        coinDisplay.textContent = gameState.money;
    }

    renderFertilizerSelector();
    uiSubscribers.forEach(callback => callback());
}

function renderFertilizerSelector() {

    if (!fertControls) {
        fertControls = document.getElementById('fert-controls');
    }

    if (!fertControls) return;


    fertControls.innerHTML = '';
    createFertOption('none', 'Нет', FERTILIZERS.none.icon);
    if (gameState.inventory.basic > 0) createFertOption('basic', `x${gameState.inventory.basic}`, FERTILIZERS.basic.icon);
    if (gameState.inventory.super > 0) createFertOption('super', `x${gameState.inventory.super}`, FERTILIZERS.super.icon);
}

function createFertOption(key, label, iconSrc) {
    const div = document.createElement('div');
    div.className = `fert-option ${gameState.selectedFertilizer === key ? 'active' : ''}`;
    div.innerHTML = `<img src="${iconSrc}"><span style="font-size:12px;">${label}</span>`;
    div.onclick = () => {
        gameState.selectedFertilizer = key;
        renderFertilizerSelector();
    };
    fertControls.appendChild(div);
}

// === ЛОГИКА АМБАРА ===

export function getTotalBarnCount() {
    return Object.values(gameState.barn).reduce((sum, count) => sum + count, 0);
}

export function renderBarnModal(containerElement) {
    containerElement.innerHTML = '';
    const crops = Object.keys(gameState.barn);
    const totalCount = getTotalBarnCount();

    const limitRow = document.createElement('div');
    limitRow.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;';
    limitRow.innerHTML = `<div style="font-weight: bold; color: #555; padding: 8px 12px; background: #fff3cd; border-radius: 4px;">Заполнено: ${totalCount}/${BARN_LIMIT}</div>`;
    
    const sellAllBtn = document.createElement('button');
    sellAllBtn.className = 'action-btn';
    sellAllBtn.textContent = 'Продать всё';
    sellAllBtn.onclick = () => { sellAll(); renderBarnModal(containerElement); };
    limitRow.appendChild(sellAllBtn);
    containerElement.appendChild(limitRow);

    if (crops.length === 0) {
        containerElement.innerHTML += '<p style="text-align:center; opacity:0.6;">Амбар пуст</p>';
        return;
    }

    crops.forEach(type => {
        const count = gameState.barn[type];
        if (count > 0) {
            const itemConfig = PLANTS_CONFIG[type] || TREES_CONFIG[type] || PRODUCTS_CONFIG[type];
            if (!itemConfig) return;

            const row = document.createElement('div');
            row.className = 'item-row';
            const iconSrc = itemConfig.productIcon || itemConfig.icon;
            
            row.innerHTML = `
                <div style="display:flex; align-items:center;">
                    <img src="${iconSrc}" class="item-icon">
                    <span>${itemConfig.name} (x${count})</span>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="action-btn sell-btn">Продать (${itemConfig.sellPrice}₴)</button>
                    <button class="action-btn sell-all-type-btn">Всё</button>
                </div>
            `;
            row.querySelector('.sell-btn').onclick = () => { sellCrop(type); renderBarnModal(containerElement); };
            row.querySelector('.sell-all-type-btn').onclick = () => { sellAllOfType(type); renderBarnModal(containerElement); };
            containerElement.appendChild(row);
        }
    });
}

function sellCrop(type) {
    if (gameState.barn[type] > 0) {
        const itemConfig = PLANTS_CONFIG[type] || TREES_CONFIG[type] || PRODUCTS_CONFIG[type];
        if (!itemConfig) return;
        gameState.barn[type]--;
        if (gameState.barn[type] === 0) delete gameState.barn[type];
        gameState.money += itemConfig.sellPrice;
        updateUI();
    }
}

function sellAllOfType(type) {
    const count = gameState.barn[type] || 0;
    if (count <= 0) return;
    const itemConfig = PLANTS_CONFIG[type] || TREES_CONFIG[type] || PRODUCTS_CONFIG[type];
    if (!itemConfig) return;
    gameState.money += count * itemConfig.sellPrice;
    delete gameState.barn[type];
    updateUI();
}

function sellAll() {
    const crops = Object.keys(gameState.barn);
    let total = 0;
    crops.forEach(type => {
        const count = gameState.barn[type];
        const itemConfig = PLANTS_CONFIG[type] || TREES_CONFIG[type] || PRODUCTS_CONFIG[type];
        if(itemConfig) total += count * itemConfig.sellPrice;
    });
    if (total > 0) {
        gameState.barn = {};
        gameState.money += total;
        updateUI();
    }
}

// === ЛОГИКА МАГАЗИНА ===

export function renderShopModal(containerElement) {
    containerElement.innerHTML = '';

    const addHeader = (text) => {
        const h = document.createElement('h4');
        h.textContent = text;
        containerElement.appendChild(h);
    };

    // Удобрения
    addHeader('Удобрения');
    ['basic', 'super'].forEach(k => {
        const f = FERTILIZERS[k];
        createShopItemRow(containerElement, f.name, f.icon, f.price, () => {
            if(buy(f.price)) { gameState.inventory[k]++; updateUI(); renderShopModal(containerElement); }
        });
    });

    // Саженцы
    addHeader('Саженцы деревьев');
    Object.keys(TREES_CONFIG).forEach(k => {
        const t = TREES_CONFIG[k];
        const owned = gameState.inventory.saplings[k] || 0;
        createShopItemRow(containerElement, `${t.name} (${owned})`, t.icon, t.price, () => {
            if(buy(t.price)) { 
                if(!gameState.inventory.saplings[k]) gameState.inventory.saplings[k] = 0;
                gameState.inventory.saplings[k]++; 
                updateUI(); 
                renderShopModal(containerElement); 
            }
        });
    });

    // Животные
    addHeader('Животные');
    Object.keys(ANIMALS_CONFIG).forEach(k => {
        const a = ANIMALS_CONFIG[k];
        const owned = gameState.inventory.animals[k] || 0;
        createShopItemRow(containerElement, `${a.name} (${owned})`, a.icon, a.price, () => {
            if(buy(a.price)) { 
                if(!gameState.inventory.animals[k]) gameState.inventory.animals[k] = 0;
                gameState.inventory.animals[k]++; 
                updateUI(); 
                renderShopModal(containerElement); 
            }
        });
    });
}

function createShopItemRow(container, name, icon, price, onBuy) {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
        <div style="display:flex; align-items:center;">
            <img src="${icon}" class="item-icon">
            <span>${name}</span>
        </div>
        <button class="action-btn">Купить (${price}₴)</button>
    `;
    const btn = row.querySelector('.action-btn');
    if(gameState.money < price) { btn.disabled = true; btn.style.opacity = '0.5'; }
    btn.onclick = onBuy;
    container.appendChild(row);
}

function buy(price) {
    if (gameState.money >= price) {
        gameState.money -= price;
        return true;
    }
    alert('Недостаточно денег!');
    return false;
}
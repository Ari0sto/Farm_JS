export const PLANTS_CONFIG = {
    carrot: {
        name: 'Морковь',
        baseTime: 5000,
        sellPrice: 8,
        icon: 'Plants/carrot_small.png',
        stages: 3,
        imgRoot: 'Plants/processed_carrot'
    },
    peas: {
        name: 'Горох',
        baseTime: 7000,
        sellPrice: 12,
        icon: 'Plants/peas_small.png',
        stages: 4,
        imgRoot: 'Plants/processed_peas'
    },
    wheat: {
        name: 'Пшеница',
        baseTime: 10000,
        sellPrice: 15,
        icon: 'Plants/wheat_small.png',
        stages: 3,
        imgRoot: 'Plants/processed_wheat'
    },
    melon: {
        name: 'Дыня',
        baseTime: 12000,
        sellPrice: 18,
        icon: 'Plants/melon_small.png',
        stages: 3,
        imgRoot: 'Plants/processed_melon'
    },
    grape: {
        name: 'Виноград',
        baseTime: 15000,
        sellPrice: 25,
        icon: 'Plants/grape_small.png',
        stages: 4,
        imgRoot: 'Plants/processed_Grape'
    }
};

export const TREES_CONFIG = {
    apple: {
        name: 'Яблоня',
        baseTime: 20000,
        fruitRegrowTime: 10000,
        sellPrice: 40,
        price: 50, // Цена саженца
        icon: 'Trees/apple_seed.png', // Иконка саженца
        productIcon: 'Trees/apple_fruit.png', // Иконка плодов
        stages: 5, // 1: Росток, 2: Деревце, 3: Почти взрослое дерево 4: Взрослое (без плодов), 5: С яблоками
        regrowStage: 4, // Стадия, на которую откатывается после сбора
        imgRoot: 'Trees/apple_tree', // apple_tree_1.png, apple_tree_2.png...
        // Ручная настройка размеров
        customStyle: {
            width: '200%',
            bottom: '10px'
        }
    },
    mulberry: {
        name: 'Шелковица',
        baseTime: 30000,
        fruitRegrowTime: 15000,
        sellPrice: 60,
        price: 100,
        icon: 'Trees/mulberry_seed.png',
        productIcon: 'Trees/mulberry_fruit.png',
        stages: 5,
        regrowStage: 4,
        imgRoot: 'Trees/mulberry',
        customStyle: {
            width: '220%',
            bottom: '10px'
        }
    },
    lemon: {
        name: 'Лимон',
        baseTime: 40000,
        fruitRegrowTime: 20000,
        sellPrice: 80,
        price: 150,
        icon: 'Trees/lemon_seed.png',
        productIcon: 'Trees/lemon_fruit.png',
        stages: 5,
        regrowStage: 4,
        imgRoot: 'Trees/lemon_tree',
         customStyle: {
            width: '200%', 
            bottom: '10px'
        }
    }
};

export const ANIMALS_CONFIG = {
    cow: {
        name: 'Корова',
        price: 150,
        food: 'wheat', // Ест пшеницу
        product: 'milk', // Дает молоко
        productName: 'Молоко',
        sellPrice: 25, // Цена продажи молока
        
        growTime: 15000, // 15 сек растет
        produceTime: 10000, // 10 сек делает молоко
        lifeTime: 120000, // Живет 2 минуты (120 сек) для теста

        // Иконки
        imgBaby: 'Animals/calf.png',
        imgAdult: 'Animals/cow.png',
        icon: 'Animals/cow.png', // Иконка в меню
        productIcon: 'Farm_general/milk.png'
    },
    chicken: {
        name: 'Курица',
        price: 50,
        food: 'peas', // Ест горох
        product: 'egg',
        productName: 'Яйцо',
        sellPrice: 10,

        growTime: 10000,
        produceTime: 5000,
        lifeTime: 60000, // Живет 1 минуту

        imgBaby: 'Animals/baby_chicken.png',
        imgAdult: 'Animals/Chicken.png',
        icon: 'Animals/Chicken.png',
        productIcon: 'Farm_general/egg.png'
    },
    sheep: {
        name: 'Овца',
        price: 120,
        food: 'carrot', // Ест морковь
        product: 'wool',
        productName: 'Шерсть',
        sellPrice: 35,
        
        growTime: 12000,
        produceTime: 8000,
        lifeTime: 100000,

        imgBaby: 'Animals/baby_sheep.png',
        imgAdult: 'Animals/sheep.png',
        icon: 'Animals/sheep.png',
        productIcon: 'Farm_general/wool.png'
    }
};

export const PRODUCTS_CONFIG = {
    milk: {
        name: 'Молоко',
        sellPrice: 25, // Цена продажи
        icon: 'Farm_general/milk.png' 
    },
    egg: {
        name: 'Яйцо',
        sellPrice: 10,
        icon: 'Farm_general/egg.png'
    },
    wool: {
        name: 'Шерсть',
        sellPrice: 35,
        icon: 'Farm_general/wool.png'
    }
};

export const FERTILIZERS = {
    none: {
        name: 'Нет',
        price: 0,
        multiplier: 1.0,
        icon: 'Farm_general/cancel.png'
    },
    basic: {
        name: 'Обычное',
        price: 10,
        multiplier: 0.8,
        icon: 'Farm_general/fertilizer_small.png'
    },
    super: {
        name: 'Супер',
        price: 25,
        multiplier: 0.5,
        icon: 'Farm_general/super_fertilizer.png'
    }
};

// Лимит Амбара
export const BARN_LIMIT = 50;

// Состояние игры
export const gameState = {
    money: 50,
    plots: [],
    treePlots: [],
    animalPlots: {},
    barn: {},
    inventory: {
        basic: 0,
        super: 0,
        // Хранилище для саженцев деревьев
        saplings: {
            apple: 0,
            mulberry: 0,
            lemon: 0
        },
        // Хранилище для животных
        animals: {
            cow: 0,
            chicken: 0,
            sheep: 0
        }
    },
    selectedFertilizer: 'none'
};

// DOM элементы
let coinDisplay, fertControls;

// Здесь хранятся функции-колбэки, которые нужно вызывать при каждом обновлении состояния игры
const uiSubscribers = [];

// Инициализация (ждем пока DOM загрузится)
setTimeout(() => {
    coinDisplay = document.getElementById('coin-display');
    fertControls = document.getElementById('fert-controls');

    // Первый рендер интерфейса
    updateUI();
}, 0);


// Подсчет лимита амбара
function getTotalBarnCount() {
    return Object.values(gameState.barn).reduce((sum, count) => sum + count, 0);
}

// Функция обновления отображения денег (ГЛОБАЛЬНАЯ)
export function updateCoinDisplay() {
    if (coinDisplay) {
        coinDisplay.textContent = gameState.money;
    }
}

// Функция подписки на обновления UI
export function subscribeToUpdate(callback) {
    uiSubscribers.push(callback);
}

// UI обновление
export function updateUI() {
    if (!coinDisplay) return;

    // Обновляем деньги
    updateCoinDisplay();
    // Обновляем селектор удобрений
    renderFertilizerSelector();
    // Вызываем все подписанные функции
    uiSubscribers.forEach(callback => callback());
}

function renderFertilizerSelector() {
    fertControls.innerHTML = '';

    createFertOption('none', 'Нет', FERTILIZERS.none.icon);

    if (gameState.inventory.basic > 0) {
        createFertOption('basic', `x${gameState.inventory.basic}`, FERTILIZERS.basic.icon);
    }
    if (gameState.inventory.super > 0) {
        createFertOption('super', `x${gameState.inventory.super}`, FERTILIZERS.super.icon);
    }
}

function createFertOption(key, label, iconSrc) {
    const div = document.createElement('div');
    div.className = `fert-option ${gameState.selectedFertilizer === key ? 'active' : ''}`;

    div.innerHTML = `
        <img src="${iconSrc}">
        <span style="font-size:12px;">${label}</span>
    `;

    div.onclick = () => {
        gameState.selectedFertilizer = key;
        renderFertilizerSelector();
    };
    fertControls.appendChild(div);
}

// Функции модальных окон

// Амбар
export function renderBarnModal(containerElement) {
    containerElement.innerHTML = '';

    const crops = Object.keys(gameState.barn);
    const totalCount = getTotalBarnCount();

    // Добавляем информацию о заполненности амбара
    const limitRow = document.createElement('div');
    limitRow.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;';

    const limitInfo = document.createElement('div');
    limitInfo.style.cssText = 'font-weight: bold; color: #555; padding: 8px 12px; background: #fff3cd; border-radius: 4px;';
    limitInfo.textContent = `Заполнено: ${totalCount}/${BARN_LIMIT}`;

    // Кнопка "Продать всё"
    const sellAllBtn = document.createElement('button');
    sellAllBtn.className = 'action-btn';
    sellAllBtn.textContent = 'Продать всё';
    sellAllBtn.onclick = () => {
        sellAll();
        renderBarnModal(containerElement); // Перерисовываем после продажи
    };

    limitRow.appendChild(limitInfo);
    limitRow.appendChild(sellAllBtn);
    containerElement.appendChild(limitRow);

    // Если пусто
    if (crops.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.opacity = '0.6';
        emptyMsg.textContent = 'Амбар пуст';
        containerElement.appendChild(emptyMsg);
        return;
    }

    // Список урожая
    crops.forEach(type => {
        const count = gameState.barn[type];
        if (count > 0) {
            // Сначала пробуем найти в PLANTS_CONFIG, если не нашли (undefined) - ищем в TREES_CONFIG, PRODUCTS_CONFIG
            const itemConfig = PLANTS_CONFIG[type] || TREES_CONFIG[type] || PRODUCTS_CONFIG[type];
            
            // Защита от ошибок: если товара нет нигде - пропускаем его
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
                    <button class="action-btn sell-all-type-btn">Продать всё</button>
                </div>
            `;

            // Обработчики кнопок
            row.querySelector('.sell-btn').onclick = () => {
                sellCrop(type);
                renderBarnModal(containerElement);
            };
            row.querySelector('.sell-all-type-btn').onclick = () => {
                sellAllOfType(type);
                renderBarnModal(containerElement);
            };

            containerElement.appendChild(row);
        }
    });
}

// Рендер магазина в модальном окне
export function renderShopModal(containerElement) {
    containerElement.innerHTML = '';

    // 1: УДОБРЕНИЯ 
    const fertHeader = document.createElement('h4');
    fertHeader.textContent = 'Удобрения';
    fertHeader.style.margin = '10px 0 5px 0';
    fertHeader.style.borderBottom = '1px solid #ccc';
    containerElement.appendChild(fertHeader);

    ['basic', 'super'].forEach(fertKey => {
        const fert = FERTILIZERS[fertKey];
        createShopItemRow(containerElement, fert.name, fert.icon, fert.price, () => {
            buyFertilizer(fertKey);
            renderShopModal(containerElement);
        });
    });

    // 2: САЖЕНЦЫ
    const treeHeader = document.createElement('h4');
    treeHeader.textContent = 'Саженцы деревьев';
    treeHeader.style.margin = '20px 0 5px 0';
    treeHeader.style.borderBottom = '1px solid #ccc';
    containerElement.appendChild(treeHeader);

    Object.keys(TREES_CONFIG).forEach(treeKey => {
        const tree = TREES_CONFIG[treeKey];
        // Показываем сколько уже есть
        const owned = gameState.inventory.saplings[treeKey] || 0;
        const nameText = `${tree.name} (В наличии: ${owned})`;

        createShopItemRow(containerElement, nameText, tree.icon, tree.price, () => {
            buySapling(treeKey); // Логика покупки
            renderShopModal(containerElement); // Обновление магазина
        });
    });

    // Животные
    const animHeader = document.createElement('h4');
    animHeader.textContent = 'Животные';
    containerElement.appendChild(animHeader);
    
    Object.keys(ANIMALS_CONFIG).forEach(k => {
        const anim = ANIMALS_CONFIG[k];
        const owned = gameState.inventory.animals[k] || 0;
        createShopItemRow(containerElement, `${anim.name} (${owned})`, anim.icon, anim.price, () => {
            buyAnimal(k); // Функция покупки
            renderShopModal(containerElement);
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
    const buyBtn = row.querySelector('.action-btn');
    
    // Проверка: хватает ли денег, чтобы подсветить кнопку или выключить
    if (gameState.money < price) {
        buyBtn.disabled = true;
        buyBtn.style.opacity = '0.5';
        buyBtn.style.cursor = 'not-allowed';
    }

    buyBtn.onclick = onBuy;
    container.appendChild(row);
}

// Логика покупки саженца дерева
function buySapling(type) {
    const cost = TREES_CONFIG[type].price;
    if (gameState.money >= cost) {
        gameState.money -= cost;
        
        // Инициализируем если нет
        if (!gameState.inventory.saplings[type]) {
            gameState.inventory.saplings[type] = 0;
        }
        
        gameState.inventory.saplings[type]++;
        updateUI(); // Обновляем глобальный UI (деньги)
    } else {
        alert("Недостаточно денег!");
    }
}

// Экономика
function buyFertilizer(type) {
    const cost = FERTILIZERS[type].price;
    if (gameState.money >= cost) {
        gameState.money -= cost;
        gameState.inventory[type]++;
        updateUI();
    } else {
        alert("Недостаточно денег!");
    }
}

function buyAnimal(type) {
    const cost = ANIMALS_CONFIG[type].price;
    if (gameState.money >= cost) {
        gameState.money -= cost;
        if (!gameState.inventory.animals[type]) gameState.inventory.animals[type] = 0;
        gameState.inventory.animals[type]++;
        updateUI();
    } else {
        alert("Недостаточно денег!");
    }
}

function sellCrop(type) {
    if (gameState.barn[type] > 0) {
        const itemConfig = PLANTS_CONFIG[type] || TREES_CONFIG[type] || PRODUCTS_CONFIG[type];
        
        // Защита: если конфига нет - выходим
        if (!itemConfig) return;

        gameState.barn[type]--;
        if (gameState.barn[type] === 0) delete gameState.barn[type];

        gameState.money += itemConfig.sellPrice;
        updateUI();
    }
}

function sellAllOfType(type) {
    const count = gameState.barn[type] || 0;
    if (count <= 0) {
        alert('Нету ничего для продажи.');
        return;
    }
    
    const itemConfig = PLANTS_CONFIG[type] || TREES_CONFIG[type] || PRODUCTS_CONFIG[type];
    
    // Защита: если конфига нет - выходим
    if (!itemConfig) return;
    
    const total = count * itemConfig.sellPrice;
    // Удаляем этот тип из амбара
    delete gameState.barn[type];
    // Добавляем деньги
    gameState.money += total;
    updateUI();
}

function sellAll() {
    const crops = Object.keys(gameState.barn);
    if (crops.length === 0) {
        alert('Амбар пуст.');
        return;
    }
    let total = 0;
    crops.forEach(type => {
        const count = gameState.barn[type] || 0;
        if (count > 0) {
            // ищем везде
            const itemConfig = PLANTS_CONFIG[type] || TREES_CONFIG[type] || PRODUCTS_CONFIG[type];
            
            // Защита от ошибок: если конфига нет - используем цену 0
            const price = itemConfig ? itemConfig.sellPrice : 0;
            total += count * price;
        }
    });

    if (total === 0) {
        alert('Нет ничего для продажи.');
        return;
    }

    // Очищаем амбар
    gameState.barn = {};
    // Добавляем деньги
    gameState.money += total;
    updateUI();
}
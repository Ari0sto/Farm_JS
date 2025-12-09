import { gameState, ANIMALS_CONFIG, PLANTS_CONFIG, BARN_LIMIT, updateUI, subscribeToUpdate } from './state.js';

export function initAnimals() {
    console.log('Инициализация животных');

    const inventoryContainer = document.getElementById('animals-list-container');
    const infoContent = document.getElementById('animal-info-content');
    
    // Получаем сетки загонов
    const pens = {
        cow: document.querySelector('.pen-grid[data-type="cow"]'),
        chicken: document.querySelector('.pen-grid[data-type="chicken"]'),
        sheep: document.querySelector('.pen-grid[data-type="sheep"]')
    };

    if (!inventoryContainer || !pens.cow) return;

    // 1. Отрисовка пустых сеток (4 ячейки на загон)
    Object.keys(pens).forEach(type => {
        const container = pens[type];
        container.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const slot = document.createElement('div');
            slot.classList.add('animal-slot');
            // Уникальный ID слота: "cow_0", "sheep_3"
            const slotId = `${type}_${i}`;
            slot.dataset.id = slotId;
            slot.dataset.type = type; // Чтобы знать, кого сюда можно сажать
            
            slot.onclick = () => handleSlotClick(slotId, type);
            
            container.appendChild(slot);
        }
    });

    // 2. Рендер Инвентаря (Drag & Drop)
    function renderInventory() {
        inventoryContainer.innerHTML = '';
        Object.keys(ANIMALS_CONFIG).forEach(key => {
            const config = ANIMALS_CONFIG[key];
            const count = gameState.inventory.animals[key] || 0;

            const item = document.createElement('div');
            item.className = 'seed-item'; // Используем стиль от семян
            
            if (count === 0) {
                item.style.opacity = '0.4';
                item.style.cursor = 'default';
            } else {
                item.style.cursor = 'grab';
                item.addEventListener('mousedown', (e) => startDrag(e, key, config.imgAdult));
            }

            item.innerHTML = `
                <span class="item-count-badge">${count}</span>
                <img src="${config.icon}" style="width:32px;">
            `;
            inventoryContainer.appendChild(item);
        });
    }

    // Подписка на обновление UI
    subscribeToUpdate(() => {
        renderInventory();
        // Перерисовка животных происходит внутри их таймеров
        renderAllAnimals();
    });
    
    renderInventory();
    renderAllAnimals(); // Восстановление при загрузке

    // ЛОГИКА ЖИВОТНЫХ

    function renderAllAnimals() {
        // Пробегаем по состоянию и рисуем тех, кто жив
        Object.keys(gameState.animalPlots).forEach(slotId => {
            renderAnimalInSlot(slotId);
        });
    }

    function renderAnimalInSlot(slotId) {
        const animal = gameState.animalPlots[slotId];
        // Находим DOM элемент по ID (cow_0 и т.д.)
        const slot = document.querySelector(`.animal-slot[data-id="${slotId}"]`);
        if (!slot) return;

        slot.innerHTML = ''; // Чистим слот

        if (!animal) return; // Если животного нет (или умерло), слот пуст

        const config = ANIMALS_CONFIG[animal.type];

        // 1. Выбор картинки и класса анимации
        let imgSrc = config.imgAdult;
        let animClass = 'anim-idle';

        if (animal.state === 'baby') {
            imgSrc = config.imgBaby;
            animClass = 'anim-baby'; // Прыгает
        } else if (animal.state === 'processing') {
            animClass = 'anim-eat'; // Жует
        }

        const img = document.createElement('img');
        img.src = imgSrc;
        img.className = `animal-img ${animClass}`;
        slot.appendChild(img);

        // 2. Пузырь (Bubble) - Интерактивность
        if (animal.state === 'hungry') {
            // Покормить!
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            // Ищем иконку еды в конфиге растений
            const foodIcon = PLANTS_CONFIG[config.food]?.icon || 'Farm_general/cancel.png';
            bubble.innerHTML = `<img src="${foodIcon}">`;
            slot.appendChild(bubble);
        } else if (animal.state === 'ready') {
            // Забрать продукт!
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.innerHTML = `<img src="${config.productIcon}">`;
            // Анимация пульсации пузыря
            bubble.style.borderColor = '#4caf50'; 
            slot.appendChild(bubble);
        }

        // 3. Полоска жизни
        const lifePercent = (animal.lifeRemaining / config.lifeTime) * 100;
        const barContainer = document.createElement('div');
        barContainer.className = 'life-bar-container';
        barContainer.innerHTML = `<div class="life-bar-fill" style="width: ${lifePercent}%"></div>`;
        slot.appendChild(barContainer);
    }

    // Обработка клика по слоту
    function handleSlotClick(slotId, type) {
        const animal = gameState.animalPlots[slotId];

        // 1. Если пусто - ничего (посадку делаем через DragDrop)
        if (!animal) return;

        // 2. Логика кормления
        if (animal.state === 'hungry') {
            feedAnimal(slotId);
        }
        // 3. Логика сбора
        else if (animal.state === 'ready') {
            collectProduct(slotId);
        }
        // 4. Инфо
        else {
            showInfo(animal);
        }
    }

    function feedAnimal(slotId) {
        const animal = gameState.animalPlots[slotId];
        const config = ANIMALS_CONFIG[animal.type];
        const foodType = config.food;

        // Проверяем амбар
        const foodCount = gameState.barn[foodType] || 0;

        if (foodCount > 0) {
            // Списываем еду
            gameState.barn[foodType]--;
            if (gameState.barn[foodType] === 0) delete gameState.barn[foodType];
            updateUI(); // Обновит счетчик денег и амбара

            // Меняем состояние
            animal.state = 'processing';
            animal.timerStart = Date.now();
            
            renderAnimalInSlot(slotId);
            runProductionTimer(slotId);

            if(infoContent) infoContent.innerHTML = `<p style="color:green">Ам-ням-ням!</p>`;
        } else {
            alert(`Нет еды: ${PLANTS_CONFIG[foodType].name}! Вырастите её в огороде.`);
        }
    }

    function collectProduct(slotId) {
        const animal = gameState.animalPlots[slotId];
        const config = ANIMALS_CONFIG[animal.type];

        // Проверка места в амбаре
        const totalBarn = Object.values(gameState.barn).reduce((a, b) => a + b, 0);
        if (totalBarn >= BARN_LIMIT) {
            alert("Амбар полон!");
            return;
        }

        // Добавляем продукт (используем имя продукта из конфига, напр 'milk')
        const prodKey = config.product; 
        
        if (!gameState.barn[prodKey]) gameState.barn[prodKey] = 0;
        gameState.barn[prodKey]++;
        
        // Возвращаем в голодное состояние
        animal.state = 'hungry';
        updateUI();
        renderAnimalInSlot(slotId);
    }

    // Таймеры
    function runGrowthTimer(slotId) {
        const animal = gameState.animalPlots[slotId];
        if (!animal || animal.state !== 'baby') return;

        const config = ANIMALS_CONFIG[animal.type];
        
        // Проверяем жизнь
        if (!checkLife(slotId, config)) return;

        const elapsed = Date.now() - animal.timerStart;
        if (elapsed >= config.growTime) {
            // Вырос!
            animal.state = 'hungry';
            renderAnimalInSlot(slotId);
            startLifeCycle(slotId); // Запускаем таймер старения
        } else {
            setTimeout(() => runGrowthTimer(slotId), 1000);
        }
    }

    function runProductionTimer(slotId) {
        const animal = gameState.animalPlots[slotId];
        if (!animal || animal.state !== 'processing') return;

        const config = ANIMALS_CONFIG[animal.type];
        
        if (!checkLife(slotId, config)) return;

        const elapsed = Date.now() - animal.timerStart;
        if (elapsed >= config.produceTime) {
            // Сделал дело!
            animal.state = 'ready';
            renderAnimalInSlot(slotId);
        } else {
            setTimeout(() => runProductionTimer(slotId), 1000);
        }
    }

    // Глобальный таймер жизни (вызывается периодически для взрослых)
    function startLifeCycle(slotId) {
        const interval = setInterval(() => {
            const animal = gameState.animalPlots[slotId];
            if (!animal) {
                clearInterval(interval);
                return;
            }
            if (animal.state === 'baby') return; // Малыши не стареют (пока растут)

            const config = ANIMALS_CONFIG[animal.type];
            animal.lifeRemaining -= 1000; // Минус 1 сек

            // Обновляем полоску жизни (без полной перерисовки, для оптимизации можно искать бар)
            const slot = document.querySelector(`.animal-slot[data-id="${slotId}"]`);
            if (slot) {
                const bar = slot.querySelector('.life-bar-fill');
                if (bar) {
                    const pct = Math.max(0, (animal.lifeRemaining / config.lifeTime) * 100);
                    bar.style.width = `${pct}%`;
                }
            }

            if (animal.lifeRemaining <= 0) {
                // Смерть
                clearInterval(interval);
                die(slotId);
            }

        }, 1000);
    }

    function checkLife(slotId, config) {
        // Утилита для таймеров роста/производства
        // Если вдруг умер во время производства
        const animal = gameState.animalPlots[slotId];
        if (!animal) return false;
        if (animal.lifeRemaining <= 0) {
            die(slotId);
            return false;
        }
        return true;
    }

    function die(slotId) {
        const slot = document.querySelector(`.animal-slot[data-id="${slotId}"]`);
        const img = slot.querySelector('img');
        if (img) img.classList.add('anim-dead'); // CSS растворение

        // Удаляем из логики через 2 сек (время анимации)
        setTimeout(() => {
            delete gameState.animalPlots[slotId];
            renderAnimalInSlot(slotId);
            if(infoContent) infoContent.innerHTML = '<p>Животное ушло на пенсию...</p>';
        }, 2000);
    }

    // --- Drag & Drop (Посадка) ---
    let draggedType = null;
    let cloneElement = null;

    function startDrag(e, type, imgSrc) {
        e.preventDefault();
        if (gameState.inventory.animals[type] <= 0) return;
        
        draggedType = type;

        cloneElement = document.createElement('div');
        cloneElement.classList.add('draggable-clone');
        cloneElement.style.backgroundImage = `url('${imgSrc}')`;
        document.body.appendChild(cloneElement);

        moveClone(e.pageX, e.pageY);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function moveClone(x, y) {
        if (cloneElement) {
            cloneElement.style.left = (x - 25) + 'px';
            cloneElement.style.top = (y - 25) + 'px';
        }
    }

    function onMouseMove(e) {
        moveClone(e.pageX, e.pageY);
    }

    function onMouseUp(e) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (cloneElement) cloneElement.remove();

        const elem = document.elementFromPoint(e.clientX, e.clientY);
        const slot = elem?.closest('.animal-slot');

        if (slot && draggedType) {
            const slotId = slot.dataset.id;
            const slotType = slot.dataset.type;

            // Проверка: сажаем корову в коровник?
            if (slotType === draggedType) {
                // Проверка: пустой ли слот?
                if (!gameState.animalPlots[slotId]) {
                    placeAnimal(slotId, draggedType);
                }
            } else {
                alert("Это животное живет не здесь!");
            }
        }
        draggedType = null;
    }

    function placeAnimal(slotId, type) {
        gameState.inventory.animals[type]--;
        updateUI();

        const config = ANIMALS_CONFIG[type];

        gameState.animalPlots[slotId] = {
            type: type,
            state: 'baby', // Начальное состояние
            timerStart: Date.now(),
            lifeRemaining: config.lifeTime
        };

        renderAnimalInSlot(slotId);
        runGrowthTimer(slotId);
    }

    function showInfo(animal) {
        const config = ANIMALS_CONFIG[animal.type];
        const statusMap = {
            baby: 'Растет',
            hungry: 'Голоден',
            processing: 'Жует',
            ready: 'Готово'
        };

        infoContent.innerHTML = `
            <div style="text-align:center;">
                <img src="${config.icon}" style="width:50px;">
                <p><strong>${config.name}</strong></p>
            </div>
            <p>Статус: ${statusMap[animal.state]}</p>
            <p>Жизнь: ${Math.floor(animal.lifeRemaining / 1000)} сек</p>
            <p style="font-size:12px; color:#555">Ест: ${PLANTS_CONFIG[config.food].name}</p>
        `;
    }

    // ВОССТАНОВЛЕНИЕ ПРИ ЗАГРУЗКЕ
    // Пробегаем по состоянию животных
    Object.keys(gameState.animalPlots).forEach(slotId => {
        const animal = gameState.animalPlots[slotId];
        
        // Если животное умерло во время оффлайна
        if (animal.lifeRemaining <= 0) {
            delete gameState.animalPlots[slotId];
            return;
        }
        renderAnimalInSlot(slotId);

        // Перезапуск логики

        // 1. Таймер старения (запускаем всем, кроме малышей)
        if (animal.state !== 'baby') {
            startLifeCycle(slotId);
        }

        // 2. Таймер роста (baby)
        if (animal.state === 'baby') {
            runGrowthTimer(slotId);
        }

        // 3. Таймер производства (processing)
        if (animal.state === 'processing') {
            runProductionTimer(slotId);
        }
    });
}
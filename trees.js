import { gameState, FERTILIZERS, BARN_LIMIT, updateUI, TREES_CONFIG, subscribeToUpdate } from './state.js';

export function initTrees() {
    console.log('Инициализация сада');

    // Получаем элементы САДА
    const plotsContainer = document.getElementById('tree-plots-grid');
    const saplingsListContainer = document.getElementById('saplings-list-container');
    const infoContent = document.getElementById('tree-info-content');
    const fertContainer = document.getElementById('tree-fert-controls');

    // Если элементов нет на странице (например, мы на другом экране и JS грузится), выходим
    if (!plotsContainer || !saplingsListContainer) return;

    let plotsElements = [];

    // Рендер Удобрений для Сада (локальная копия)
    function renderTreeFertilizers() {
        if (!fertContainer) return;
        fertContainer.innerHTML = '';

        const createOpt = (key, label, icon) => {
            const div = document.createElement('div');
            // Проверяем, совпадает ли глобальный выбор с этой кнопкой
            const isActive = gameState.selectedFertilizer === key;
            div.className = `fert-option ${isActive ? 'active' : ''}`;
            
            div.innerHTML = `
                <img src="${icon}">
                <span style="font-size:12px;">${label}</span>
            `;
            
            div.onclick = () => {
                // Меняем глобальный выбор
                gameState.selectedFertilizer = key;
                // Запускаем глобальное обновление (оно обновит и огород, и сад)
                updateUI(); 
            };
            fertContainer.appendChild(div);
        };

        // Рисуем кнопки
        createOpt('none', 'Нет', FERTILIZERS.none.icon);
        
        if (gameState.inventory.basic > 0) {
            createOpt('basic', `x${gameState.inventory.basic}`, FERTILIZERS.basic.icon);
        }
        if (gameState.inventory.super > 0) {
            createOpt('super', `x${gameState.inventory.super}`, FERTILIZERS.super.icon);
        }
    }

    // Подписываем эту функцию на глобальные обновления !
    subscribeToUpdate(() => {
        renderTreeFertilizers();
        renderSaplingsList(); // Обновляем список саженцев при изменении денег/инвентаря
    });
    
    // Первый запуск отрисовки
    renderTreeFertilizers();

    // Создание сетки
    function createGrid(count) {
        plotsContainer.innerHTML = '';
        // Инициализируем массив, если он пуст (при первой загрузке)
        if (gameState.treePlots.length === 0) {
            gameState.treePlots = new Array(count).fill(null);
        }

        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.classList.add('plot'); // Используем тот же класс стиля, но внутри orchard-grid он будет другим
            div.dataset.id = i;
            plotsContainer.appendChild(div);
        }
        plotsElements = plotsContainer.querySelectorAll('.plot');
        
        // Восстанавливаем визуальное состояние при загрузке
        gameState.treePlots.forEach((tree, index) => {
             if(tree) {
                 renderPlot(index);
                 // Если дерево еще растет, перезапускаем таймер
                 if(tree.currentStage < tree.totalStages) {
                     runGrowthCycle(index);
                 }
             }
        });
    }

    // Список Саженцев 
    function renderSaplingsList() {
        saplingsListContainer.innerHTML = '';
        Object.keys(TREES_CONFIG).forEach(key => {
            const tree = TREES_CONFIG[key];
            const ownedCount = gameState.inventory.saplings[key] || 0;
            
            const seedItem = document.createElement('div');
            seedItem.classList.add('seed-item');
            seedItem.dataset.type = key;

           // Если саженцев 0, делаем полупрозрачным и запрещаем перетаскивание
            if (ownedCount === 0) {
                seedItem.style.opacity = '0.4';
                seedItem.style.cursor = 'default';
            } else {
                seedItem.style.opacity = '1';
                seedItem.style.cursor = 'grab';
            }
            
            seedItem.innerHTML = `
                <span class="item-count-badge">${ownedCount}</span>
                <img src="${tree.icon}" class="seed-icon-img" alt="${tree.name}" style="width:32px;">
            `;

            // Логика перетаскивания (только если есть в наличии)
            if (ownedCount > 0) {
                seedItem.addEventListener('mousedown', (e) => {
                    startDrag(e, key, null, tree.icon);
                });
            }

            saplingsListContainer.appendChild(seedItem);
        });
    }

    //  Drag & Drop (Локальная копия для сада) 
    let draggedItem = null;
    let cloneElement = null;

    function startDrag(e, type, sourceIndex, visualSource) {

        // Доп проверка на всякий случай
        if (gameState.inventory.saplings[type] <= 0) return;

        e.preventDefault();
        draggedItem = { type, sourceIndex };

        cloneElement = document.createElement('div');
        cloneElement.classList.add('draggable-clone');
        cloneElement.style.backgroundImage = `url('${visualSource}')`;
        
        document.body.appendChild(cloneElement);

        moveClone(e.pageX, e.pageY);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e) {
        moveClone(e.pageX, e.pageY);
        plotsElements.forEach(plot => plot.classList.remove('hovered'));

        // ищем элементы только внутри нашего контейнера сада
        let elem = document.elementFromPoint(e.clientX, e.clientY);
        let plot = elem?.closest('.orchard-grid .plot'); // Специфичный селектор
        if (plot) plot.classList.add('hovered');
    }

    function onMouseUp(e) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (cloneElement) cloneElement.remove();
        plotsElements.forEach(plot => plot.classList.remove('hovered'));

        let elem = document.elementFromPoint(e.clientX, e.clientY);
        let plot = elem?.closest('.orchard-grid .plot'); // Проверяем, что попали именно в сад

        if (plot && draggedItem) {
            const targetId = parseInt(plot.dataset.id);

            // 1. Посадка
            if (gameState.treePlots[targetId] === null && draggedItem.sourceIndex === null) {
                plantSapling(targetId, draggedItem.type);
            }
            // 2. Инфо (если кликнули/отпустили на то же дерево)
            else if (draggedItem.sourceIndex === targetId) {
                showInfo(gameState.treePlots[targetId], targetId);
            }
        }
        draggedItem = null;
    }

    function moveClone(x, y) {
        if (cloneElement) {
            cloneElement.style.left = (x - 25) + 'px';
            cloneElement.style.top = (y - 25) + 'px';
        }
    }

    // Логика Роста Деревьев 
    function plantSapling(index, type) {
        // Проверка наличия саженца
        if (gameState.inventory.saplings[type] > 0) {
            // Уменьшаем количество саженцев
            gameState.inventory.saplings[type]--;
        
        // Логика удобрений (общая с огородом)
        const fertType = gameState.selectedFertilizer;
        let multiplier = 1;

        if (fertType !== 'none') {
            if (gameState.inventory[fertType] > 0) {
                gameState.inventory[fertType]--;
                multiplier = FERTILIZERS[fertType].multiplier;
                if (gameState.inventory[fertType] === 0) gameState.selectedFertilizer = 'none';
            } else {
                gameState.selectedFertilizer = 'none'; 
            }
        }

        updateUI();

        const config = TREES_CONFIG[type];
        const finalTime = config.baseTime * multiplier;

        const tree = {
            type: type,
            currentStage: 1, 
            totalStages: config.stages,
            startTime: Date.now(),
            growthTime: finalTime,
            timerId: null,
            usedFertilizer: FERTILIZERS[fertType].name
        };

        gameState.treePlots[index] = tree;
        runGrowthCycle(index);
        renderPlot(index);
        } else {
            alert("У вас нет саженцев этого дерева!");
        }
    }

    function runGrowthCycle(index) {
        const tree = gameState.treePlots[index];
        // Если дерева нет или оно уже выросло (стадия = макс), выходим
        if (!tree || tree.currentStage >= tree.totalStages) return;

        clearTimeout(tree.timerId);

        const elapsed = Date.now() - tree.startTime;
        
        const progress = Math.min(elapsed / tree.growthTime, 1);
        
        // Логика переключения стадий:
        const calculatedStage = 1 + Math.floor(progress * (tree.totalStages - 1));

        if (elapsed >= tree.growthTime) {
            // Если время вышло — ставим сразу максимальную стадию (5)
            tree.currentStage = tree.totalStages;
        } else {
            // Иначе ставим расчетную, но не даем ей "упасть" ниже текущей (защита от багов)
            tree.currentStage = Math.max(tree.currentStage, calculatedStage);
        }

        renderPlot(index);

        if (tree.currentStage < tree.totalStages) {
            tree.timerId = setTimeout(() => {
                runGrowthCycle(index);
            }, 500); // Проверка каждые 0.5 сек
        }
    }

    function renderPlot(index) {
        const plotEl = plotsElements[index];
        plotEl.innerHTML = '';
        const data = gameState.treePlots[index];

        if (!data) return; // Пустая ячейка

        const config = TREES_CONFIG[data.type];
        const imgName = `${config.imgRoot}_${data.currentStage}.png`;

        const img = document.createElement('img');
        img.src = imgName;
        img.className = 'plant-img';
        img.alt = data.type;

        // Применяем кастомные стили, должны получится большие деревья
        if (config.customStyle) {
            Object.assign(img.style, config.customStyle);
            img.style.position = 'absolute';
        }

        // Клик для Инфо
        plotEl.onclick = (e) => {
             if (!e.target.classList.contains('harvest-btn')) {
                showInfo(data, index);
             }
        };

        // Кнопка сбора урожая
        if (data.currentStage === data.totalStages) {
            const harvestBtn = document.createElement('div');
            harvestBtn.className = 'harvest-btn';
            
            harvestBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                harvestTree(index);
            });
            
            plotEl.appendChild(harvestBtn);
        }

        plotEl.appendChild(img);
    }

    // Сбор Урожая (С сохранением дерева)
    function harvestTree(index) {
        const tree = gameState.treePlots[index];
        if (!tree) return;

        // Проверка амбара
        const totalCount = Object.values(gameState.barn).reduce((sum, count) => sum + count, 0);
        if (totalCount >= BARN_LIMIT) {
            alert(`Амбар заполнен!`);
            return;
        }

        // Добавляем в амбар
        if (!gameState.barn[tree.type]) gameState.barn[tree.type] = 0;
        gameState.barn[tree.type]++;
        updateUI();

        //Откат стадии
        const config = TREES_CONFIG[tree.type];
        
        tree.currentStage = config.regrowStage;
        
        const timeToRegrow = config.fruitRegrowTime || (config.baseTime * 0.3);
        
        // Считаем "виртуальное" прошедшее время
        const virtualElapsedTime = tree.growthTime - timeToRegrow;
        
        // Ставим startTime в прошлое
        tree.startTime = Date.now() - virtualElapsedTime;

        // Запускаем цикл заново
        runGrowthCycle(index);
        renderPlot(index);
        
        if(infoContent) infoContent.innerHTML = '<p class="placeholder">Фрукты собраны!</p>';
    }
    
    // Удаление дерева (Рубка)
    function chopTree(index) {
        if(confirm("Вы уверены, что хотите срубить это дерево?")) {
            const tree = gameState.treePlots[index];
            clearTimeout(tree.timerId);
            gameState.treePlots[index] = null;
            renderPlot(index);
            if(infoContent) infoContent.innerHTML = '<p class="placeholder">Дерево срублено.</p>';
        }
    }

    function showInfo(tree, index) {
        if (!tree) return;
        const config = TREES_CONFIG[tree.type];
        
        // Расчет времени
        const elapsed = Date.now() - tree.startTime;
        const timeLeft = Math.max(0, Math.ceil((tree.growthTime - elapsed) / 1000));

        const fertName = tree.usedFertilizer || 'Нет';
        
        infoContent.innerHTML = `
        <div style="text-align:center;">
            <img src="${config.icon}" style="width:50px;">
            <p><strong>${config.name}</strong></p>
        </div>
        <p>Удобрение: ${fertName}</p>
        <p>Стадия: ${tree.currentStage} / ${tree.totalStages}</p>
        ${tree.currentStage < tree.totalStages ? `<p>Зреет: ${timeLeft} сек</p>` : '<p style="color:green; font-weight:bold;">Готово к сбору!</p>'}
        <hr>
        <button id="btn-chop-${index}" class="action-btn" style="width:100%; background:#ffcdd2; border-color:#d32f2f; color:#b71c1c;">Срубить</button>
    `;
    
        // Вешаем обработчик на кнопку срубить
        setTimeout(() => {
            const btn = document.getElementById(`btn-chop-${index}`);
            if(btn) btn.onclick = () => chopTree(index);
        }, 0);
    }

    // ЗАПУСК (10 ячеек)
    createGrid(10); // Сетка 5x2 = 10 слотов
    renderSaplingsList();
}
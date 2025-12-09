
import { gameState, FERTILIZERS, BARN_LIMIT, updateUI, PLANTS_CONFIG } from './state.js';

export function initPlants() {
    console.log('Инициализация растений');

    // Получаем элементы заново внутри модуля, чтобы гарантировать доступ
    const plotsContainer = document.getElementById('plots-grid');
    const seedsListContainer = document.getElementById('seeds-list-container');
    const infoContent = document.getElementById('info-content');
    
    // Переменная для хранения списка грядок
    let plotsElements = [];

    //  Функции (Logic)

    function createGrid(count) {
        plotsContainer.innerHTML = '';
        gameState.plots = new Array(count).fill(null);

        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.classList.add('plot');
            div.dataset.id = i;
            plotsContainer.appendChild(div);
        }
        plotsElements = document.querySelectorAll('.plot');
    }

    function renderSeedsList() {
        seedsListContainer.innerHTML = '';
        Object.keys(PLANTS_CONFIG).forEach(key => {
            const plant = PLANTS_CONFIG[key];
            
            const seedItem = document.createElement('div');
            seedItem.classList.add('seed-item');
            seedItem.dataset.type = key;
            
            seedItem.innerHTML = `
                <img src="${plant.icon}" class="seed-icon-img" alt="${plant.name}">
                <span class="label">${plant.name}</span>
            `;

            seedItem.addEventListener('mousedown', (e) => {
                startDrag(e, key, null, plant.icon);
            });

            seedsListContainer.appendChild(seedItem);
        });
    }

    // --- Drag & Drop ---
    let draggedItem = null;
    let cloneElement = null;

    function startDrag(e, type, sourceIndex, visualSource) {
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

        let elem = document.elementFromPoint(e.clientX, e.clientY);
        let plot = elem?.closest('.plot');
        if (plot) plot.classList.add('hovered');
    }

    function onMouseUp(e) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (cloneElement) cloneElement.remove();
        plotsElements.forEach(plot => plot.classList.remove('hovered'));

        let elem = document.elementFromPoint(e.clientX, e.clientY);
        let plot = elem?.closest('.plot');

        if (plot && draggedItem) {
            const targetId = parseInt(plot.dataset.id);

            // 1. Посадка нового
            if (gameState.plots[targetId] === null && draggedItem.sourceIndex === null) {
                plantSeed(targetId, draggedItem.type);
            }
            // 2. Пересадка
            else if (gameState.plots[targetId] === null && draggedItem.sourceIndex !== null) {
                movePlant(draggedItem.sourceIndex, targetId);
            }
            // 3. Инфо
            else if (draggedItem.sourceIndex === targetId) {
                showInfo(gameState.plots[targetId]);
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

    //  Фермерство 
    function plantSeed(index, type) {
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

        const config = PLANTS_CONFIG[type];
        const finalTime = config.baseTime * multiplier;

        const plant = {
            type: type,
            currentStage: 1, 
            totalStages: config.stages,
            startTime: Date.now(),
            growthTime: finalTime,
            timerId: null,
            usedFertilizer: FERTILIZERS[fertType].name
        };

        gameState.plots[index] = plant;
        runGrowthCycle(index);
        renderPlot(index);
    }

    function runGrowthCycle(index) {
        const plant = gameState.plots[index];
        if (!plant || plant.currentStage >= plant.totalStages) return;

        clearTimeout(plant.timerId);

        const elapsed = Date.now() - plant.startTime;
        const progress = Math.min(elapsed / plant.growthTime, 1);
        const calculatedStage = 1 + Math.floor(progress * (plant.totalStages - 1));

        if (elapsed >= plant.growthTime) {
            plant.currentStage = plant.totalStages;
        } else {
            plant.currentStage = Math.max(1, calculatedStage);
        }

        renderPlot(index);

        if (plant.currentStage < plant.totalStages) {
            plant.timerId = setTimeout(() => {
                runGrowthCycle(index);
            }, 100);
        }
    }

    function renderPlot(index) {
        const plotEl = plotsElements[index];
        plotEl.innerHTML = '';
        const data = gameState.plots[index];

        if (!data) return;

        const config = PLANTS_CONFIG[data.type];
        const imgName = `${config.imgRoot}_${data.currentStage}.png`;

        const img = document.createElement('img');
        img.src = imgName;
        img.className = 'plant-img';
        img.alt = data.type;

        plotEl.addEventListener('click', (e) => {
            if (!e.target.classList.contains('harvest-btn')) {
                showInfo(data);
            }
        });

        // Сбор урожая
        if (data.currentStage === data.totalStages) {
            const harvestBtn = document.createElement('div');
            harvestBtn.className = 'harvest-btn';
            
            // Замена onclick на addEventListener
            harvestBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                harvest(index);
            });
            
            plotEl.appendChild(harvestBtn);
        }

        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.zIndex = '5';
        wrapper.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            startDrag(e, data.type, index, config.icon);
        });

        plotEl.appendChild(img);
        if (data.currentStage < data.totalStages) {
            plotEl.appendChild(wrapper);
        }
    }

    function harvest(index) {
        const plant = gameState.plots[index];
        if (!plant) return;

        // Валидация через gameState
        const totalCount = Object.values(gameState.barn).reduce((sum, count) => sum + count, 0);
        
        if (totalCount >= BARN_LIMIT) {
            alert(`Амбар заполнен! Максимум ${BARN_LIMIT} единиц урожая. Продайте что-нибудь.`);
            return;
        }

        if (!gameState.barn[plant.type]) gameState.barn[plant.type] = 0;
        gameState.barn[plant.type]++;

        updateUI();

        gameState.plots[index] = null;
        renderPlot(index);
        infoContent.innerHTML = '<p class="placeholder">Урожай собран!</p>';
    }

    function movePlant(fromIndex, toIndex) {
        const plant = gameState.plots[fromIndex];
        clearTimeout(plant.timerId);

        gameState.plots[toIndex] = plant;
        gameState.plots[fromIndex] = null;

        runGrowthCycle(toIndex);
        renderPlot(fromIndex);
        renderPlot(toIndex);
    }

    function showInfo(plant) {
        if (!plant) return;
        const elapsed = Date.now() - plant.startTime;
        const timeLeft = Math.max(0, Math.ceil((plant.growthTime - elapsed) / 1000));
        
        infoContent.innerHTML = `
        <div style="text-align:center;">
            <img src="${PLANTS_CONFIG[plant.type].icon}" style="width:50px;">
            <p><strong>${PLANTS_CONFIG[plant.type].name}</strong></p>
        </div>
        <p>Стадия: ${plant.currentStage} / ${plant.totalStages}</p>
        ${plant.currentStage < plant.totalStages ? `<p>Осталось: ${timeLeft} сек</p>` : '<p style="color:green; font-weight:bold;">Готово!</p>'}
        <hr>
        <p><small>Удобрение: ${plant.usedFertilizer}</small></p>
    `;
    }

    // ЗАПУСК ЛОГИКИ
    createGrid(15);
    renderSeedsList();
}
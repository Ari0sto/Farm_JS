import { updateUI, loadGame, renderBarnModal, renderShopModal, renderAchievementsModal } from './state.js';
import { initPlants } from './plants.js';
import { initTrees } from './trees.js';
import { initAnimals } from './animals.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Загрузка данных
    loadGame();

    // 2. Инициализация всех модулей
    initPlants();
    initTrees();
    initAnimals();

    // 3. Обновление UI
    updateUI();

    // === НАСТРОЙКА КАМЕРЫ ===
    // По умолчанию ставим камеру на Огород (центральный экран)
    const world = document.getElementById('world');
    // Сдвиг на -100vw перемещает нас на второй экран
    if(world) world.style.transform = 'translateX(-100vw)';


    // === НАВИГАЦИЯ ===
    const btnAnimals = document.getElementById('btn-animals');
    const btnPlants = document.getElementById('btn-plants');
    const btnTrees = document.getElementById('btn-trees');

    if (btnAnimals && world) btnAnimals.onclick = () => world.style.transform = 'translateX(0vw)';
    if (btnPlants && world) btnPlants.onclick = () => world.style.transform = 'translateX(-100vw)';
    if (btnTrees && world)  btnTrees.onclick = () => world.style.transform = 'translateX(-200vw)';


    // === МОДАЛЬНЫЕ ОКНА ===
    const modalBarn = document.getElementById('modal-barn');
    const modalShop = document.getElementById('modal-shop');
    
    const btnBarn = document.getElementById('btn-barn');
    const btnShop = document.getElementById('btn-shop');
    
    const closeBarn = document.getElementById('close-barn');
    const closeShop = document.getElementById('close-shop');

    const barnContent = document.getElementById('barn-modal-list');
    const shopContent = document.getElementById('shop-modal-list');

    const modalAch = document.getElementById('modal-achievements');
    const btnAch = document.getElementById('btn-achievements');
    const closeAch = document.getElementById('close-achievements');
    const listAch = document.getElementById('achievements-list');

   // === ЛОГИКА ОТКРЫТИЯ/ЗАКРЫТИЯ ===

    // 1. Амбар
    if (btnBarn) {
        btnBarn.onclick = () => {
            renderBarnModal(barnContent); // Сначала рендерим контент
            modalBarn.classList.remove('hidden'); // Потом показываем
        };
    }

    // 2. Магазин
    if (btnShop) {
        btnShop.onclick = () => {
            renderShopModal(shopContent);
            modalShop.classList.remove('hidden');
        };
    }

    // 3. Достижения
    if (btnAch) {
        btnAch.onclick = () => {
            renderAchievementsModal(listAch); // Генерируем список из state.js
            modalAch.classList.remove('hidden');
        };
    }

    // Закрытие по крестику
    if (closeBarn) closeBarn.onclick = () => modalBarn.classList.add('hidden');
    if (closeShop) closeShop.onclick = () => modalShop.classList.add('hidden');
    
    if (closeAch) closeAch.onclick = () => modalAch.classList.add('hidden');

    // Закрытие по клику на темный фон
    window.onclick = (event) => {
        if (event.target === modalBarn) modalBarn.classList.add('hidden');
        if (event.target === modalShop) modalShop.classList.add('hidden');
        if (event.target === modalAch) modalAch.classList.add('hidden');
    };
});
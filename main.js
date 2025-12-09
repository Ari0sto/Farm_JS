import { updateUI, loadGame, renderBarnModal, renderShopModal } from './state.js';
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


    // === МОДАЛЬНЫЕ ОКНА (АМБАР И МАГАЗИН) ===
    const modalBarn = document.getElementById('modal-barn');
    const modalShop = document.getElementById('modal-shop');
    
    const btnBarn = document.getElementById('btn-barn');
    const btnShop = document.getElementById('btn-shop');
    
    const closeBarn = document.getElementById('close-barn');
    const closeShop = document.getElementById('close-shop');

    const barnContent = document.getElementById('barn-modal-list');
    const shopContent = document.getElementById('shop-modal-list');

    // Открытие Амбара
    if (btnBarn) {
        btnBarn.onclick = () => {
            modalBarn.classList.remove('hidden');
            renderBarnModal(barnContent);
        };
    }

    // Открытие Магазина
    if (btnShop) {
        btnShop.onclick = () => {
            modalShop.classList.remove('hidden');
            renderShopModal(shopContent);
        };
    }

    // Закрытие
    if (closeBarn) closeBarn.onclick = () => modalBarn.classList.add('hidden');
    if (closeShop) closeShop.onclick = () => modalShop.classList.add('hidden');
});
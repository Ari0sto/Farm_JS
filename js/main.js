import { initPlants } from './plants.js';
import { initTrees } from './trees.js';
import { initAnimals } from './animals.js';
import { updateUI, renderBarnModal, renderShopModal } from './state.js';

// ==========================================
// 1. ПЕРЕМЕННЫЕ И ЭЛЕМЕНТЫ DOM
// ==========================================

// Мир и Навигация
const world = document.getElementById('world');
const btnAnimals = document.getElementById('btn-animals');
const btnPlants = document.getElementById('btn-plants');
const btnTrees = document.getElementById('btn-trees');

// Модальные окна
const modalBarn = document.getElementById('modal-barn');
const modalShop = document.getElementById('modal-shop');
const btnBarn = document.getElementById('btn-barn');
const btnShop = document.getElementById('btn-shop');
const closeBarn = document.getElementById('close-barn');
const closeShop = document.getElementById('close-shop');
const barnModalList = document.getElementById('barn-modal-list');
const shopModalList = document.getElementById('shop-modal-list');

// ==========================================
// 2. ФУНКЦИИ (Логика интерфейса)
// ==========================================

/**
 * Перемещение камеры к зоне
 * 0 = Животные, 1 = Огород, 2 = Сад
 */
function goToZone(zoneIndex) {
    const offset = zoneIndex * -100;
    world.style.transform = `translateX(${offset}vw)`;
    console.log(`Переход к зоне ${zoneIndex}`);
}

// ==========================================
// 3. ОБРАБОТЧИКИ СОБЫТИЙ (Listeners)
// ==========================================

// Навигация
if (btnAnimals) btnAnimals.addEventListener('click', () => goToZone(0));
if (btnPlants) btnPlants.addEventListener('click', () => goToZone(1));
if (btnTrees) btnTrees.addEventListener('click', () => goToZone(2));

// Амбар
if (btnBarn) {
    btnBarn.addEventListener('click', () => {
        modalBarn.classList.remove('hidden');
        renderBarnModal(barnModalList);
    });
}
if (closeBarn) closeBarn.addEventListener('click', () => modalBarn.classList.add('hidden'));
if (modalBarn) {
    modalBarn.addEventListener('click', (e) => {
        if (e.target === modalBarn) modalBarn.classList.add('hidden');
    });
}

// Магазин
if (btnShop) {
    btnShop.addEventListener('click', () => {
        modalShop.classList.remove('hidden');
        renderShopModal(shopModalList);
    });
}
if (closeShop) closeShop.addEventListener('click', () => modalShop.classList.add('hidden'));
if (modalShop) {
    modalShop.addEventListener('click', (e) => {
        if (e.target === modalShop) modalShop.classList.add('hidden');
    });
}

// ==========================================
// 4. ИНИЦИАЛИЗАЦИЯ ИГРЫ (Точка входа)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("Игра запускается...");

    // 1. Инициализируем подсистемы
    initPlants(); // Огород
    initTrees();  // Сад 
    initAnimals(); // Животные

    // 2. Обновляем интерфейс (деньги, инвентарь)
    updateUI();

    // 3. Ставим камеру на Огород (центр)
    goToZone(1);
});
import { initServiceSwitcher } from './modules/serviceSwitcher.js';
import { initMobileMenu } from './modules/mobileMenu.js';
import { initMastersData } from './modules/mastersData.js';
import { initGallery } from './modules/gallery.js';
import { initForms } from './modules/forms.js';
import { initAnimations } from './modules/animations.js';
import { initBookingForm } from './modules/bookingForm.js';

// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM ready, initializing modules...');
    
    try {
        initServiceSwitcher();
        initMobileMenu();
        initMastersData();
        initGallery();
        initForms();
        initBookingForm();
        
        console.log('✅ All modules initialized');
    } catch (error) {
        console.error('❌ Error initializing modules:', error);
    }
});

window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            // Даём время на анимацию пульсации
            setTimeout(() => {
                preloader.classList.add('preloader--hidden');
                // Убираем из DOM после исчезновения (необязательно)
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 800);
            }, 800);
        }
        
        // Анимации запускаем после исчезновения прелоадера
        setTimeout(() => {
            initAnimations();
        }, 1600);
    });
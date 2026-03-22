import { initServiceSwitcher } from './modules/serviceSwitcher.js';
import { initMobileMenu } from './modules/mobileMenu.js';
import { initMastersData } from './modules/mastersData.js';
import { initGallery } from './modules/gallery.js';
import { initForms } from './modules/forms.js';
import { initAnimations } from './modules/animations.js';
import { initBookingForm } from './modules/bookingForm.js';

window.addEventListener('load', function() {
    console.log('Page fully loaded');

    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader--hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }
    initApp();
});

function initApp() {
    console.log(' Initializing HOHLOMA app...');
    
    try {
        initServiceSwitcher();
        initMobileMenu();
        initMastersData();
        initGallery();
        initForms();
        initBookingForm();
        
        setTimeout(() => {
            initAnimations();
        }, 100);
        
        console.log('✅ All modules initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing modules:', error);
    }
}

window.showNotification = function(message, type = 'info') {
    const modal = document.getElementById('notification-modal');
    
    if (!modal) return;

    const modalMessage = modal.querySelector('.modal__message');
    const modalIcon = modal.querySelector('.modal__icon');

    if (modalMessage) {
        modalMessage.textContent = message;
    }

    if (modalIcon) {
        modalIcon.className = `modal__icon modal__icon--${type}`;
        modalIcon.textContent = type === 'success' ? '✓' : '✗';
    }

    modal.classList.add('modal--active');

    setTimeout(() => {
        modal.classList.remove('modal--active');
    }, 5000);
};
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
document.querySelectorAll('.footer__link[data-section-link]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const activeSection = document.querySelector('.service-content--active');
        
        if (activeSection) {
            const targetElement = activeSection.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                const fallbackElement = document.querySelector(targetId);
                if (fallbackElement) {
                    fallbackElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    });
});
window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('preloader--hidden');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 800);
            }, 800);
        }
        
        setTimeout(() => {
            initAnimations();
        }, 1600);
    });
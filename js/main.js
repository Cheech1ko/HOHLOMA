window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');

    if (preloader) {
        preloader.classList.add('preloader--hidden');

        this.setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
    initApp();
})

function initApp() {
    console.log('HOHLOMA site loaded and initialized!');

    // initServiceSwitcher();
    // initMobileMenu();
    // initBookingForm();
    // initAnimations();
    // initGallery();
    // initForms();
}
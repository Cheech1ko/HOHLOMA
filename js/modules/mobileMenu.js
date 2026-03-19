export function initMobileMenu() {
    console.log('Mobile menu initialized');
    
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    
    if (!burger || !nav) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    burger.addEventListener('click', function() {
        this.classList.toggle('burger--active');
        nav.classList.toggle('nav--active');
        
        // Блокируем скролл body при открытом меню
        if (nav.classList.contains('nav--active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Закрываем меню при клике на ссылку
    const navLinks = nav.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('burger--active');
            nav.classList.remove('nav--active');
            document.body.style.overflow = '';
        });
    });
}
export function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }
    
    console.log('Initializing animations...');
    
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // ==================== ФУНКЦИЯ АНИМАЦИИ ФОНА ====================
    function animateHeroBg(container) {
        if (!container) return;
        
        const hero = container.querySelector('.hero');
        if (!hero) return;
        
        const heroBg = hero.querySelector('.hero__bg img') || hero;
        
        // Убиваем предыдущие анимации
        gsap.killTweensOf(heroBg);
        
        // Устанавливаем начальное состояние
        gsap.set(heroBg, { scale: 1.1 });
        
        // Анимация масштабирования
        gsap.to(heroBg, {
            scale: 1,
            duration: 1.8,
            ease: 'power2.out',
            overwrite: true
        });
    }
    
    // ==================== АНИМАЦИИ СЕКЦИЙ ПРИ СКРОЛЛЕ ====================
    function animateContainer(container) {
        if (!container) return;
        
        // Заголовки секций
        container.querySelectorAll('.section-title').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Карточки мастеров
        container.querySelectorAll('.team-card').forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: 'back.out(0.4)',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Карточки прайса
        container.querySelectorAll('.price__master-card, .price__category, .price__card').forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: i * 0.08,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Инфо-карточки (пирсинг/массаж)
        container.querySelectorAll('.about__info-card').forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, y: 30, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    delay: i * 0.1,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Текстовые блоки
        container.querySelectorAll('.about__content, .price__intro').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }
    
    // ==================== АНИМАЦИЯ ТЕКУЩЕГО РАЗДЕЛА ====================
    function animateCurrent() {
        const activeContent = document.querySelector('.service-content--active');
        if (activeContent) {
            // Анимация фона hero
            animateHeroBg(activeContent);
            
            // Анимация контента при скролле
            animateContainer(activeContent);
        }
    }
    
    // ==================== ОТСЛЕЖИВАЕМ ПЕРЕКЛЮЧЕНИЕ РАЗДЕЛОВ ====================
    // При загрузке
    setTimeout(animateCurrent, 100);
    
    // При смене раздела
    window.addEventListener('serviceChanged', () => {
        setTimeout(animateCurrent, 50);
    });
    
    // ==================== ЭФФЕКТЫ НАВЕДЕНИЯ ====================
    document.querySelectorAll('.team-card, .price__master-card, .price__category, .about__info-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -5, duration: 0.25, ease: 'power2.out', overwrite: true });
            gsap.to(card, { boxShadow: '0 10px 25px rgba(0,0,0,0.2)', duration: 0.25, overwrite: true });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, duration: 0.25, ease: 'power2.out', overwrite: true });
            gsap.to(card, { boxShadow: 'none', duration: 0.25, overwrite: true });
        });
    });
    
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.03, duration: 0.2, overwrite: true }));
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.2, overwrite: true }));
    });
    
    // ==================== ПЛАВНЫЙ СКРОЛЛ ====================
    document.querySelectorAll('.nav__link[href^="#"]:not([data-service]), .hero__actions .btn--outline').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    gsap.to(window, {
                        duration: 0.8,
                        scrollTo: { y: target, offsetY: headerHeight },
                        ease: 'power2.inOut'
                    });
                }
            }
        });
    });
    
    // ==================== ПРЕЛОАДЕР ====================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.6,
            delay: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
                preloader.style.display = 'none';
            }
        });
    }
    
    console.log('Animations ready');
}
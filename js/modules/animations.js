export function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }
    
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // === HERO АНИМАЦИЯ ===
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    const heroActions = document.querySelector('.hero__actions');
    const heroLogo = document.querySelector('.hero__logo');
    
    const tl = gsap.timeline();
    
    if (heroLogo) {
        tl.fromTo(heroLogo, 
            { opacity: 0, y: -50, scale: 0.8 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(0.6)' }
        );
    }
    
    if (heroTitle) {
        tl.fromTo(heroTitle,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.4'
        );
    }
    
    if (heroSubtitle) {
        tl.fromTo(heroSubtitle,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.3'
        );
    }
    
    if (heroActions) {
        tl.fromTo(heroActions.children,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.15, duration: 0.5, ease: 'back.out(0.4)' },
            '-=0.2'
        );
    }
    
    // === СЕКЦИИ ПРИ СКРОЛЛЕ ===
    const sections = document.querySelectorAll('section:not(.hero)');
    
    sections.forEach(section => {
        const title = section.querySelector('.section-title');
        const grid = section.querySelector('.team__grid, .portfolio__grid, .price__grid, .price__masters');
        const cards = section.querySelectorAll('.team-card, .portfolio__item, .price__category, .price__master-card');
        
        if (title) {
            gsap.fromTo(title,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
        
        if (grid) {
            gsap.fromTo(grid,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    scrollTrigger: {
                        trigger: grid,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
        
        if (cards.length) {
            gsap.fromTo(cards,
                { opacity: 0, y: 50, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'back.out(0.4)',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
    });
    
    // === КАРТОЧКИ МАСТЕРОВ (при наведении) ===
    const masterCards = document.querySelectorAll('.team-card');
    
    masterCards.forEach(card => {
        const image = card.querySelector('.team-card__image');
        const content = card.querySelector('.team-card__content');
        
        card.addEventListener('mouseenter', () => {
            if (image) gsap.to(image, { scale: 1.08, duration: 0.4, ease: 'power2.out' });
            if (content) gsap.to(content, { y: -5, duration: 0.3, ease: 'power2.out' });
        });
        
        card.addEventListener('mouseleave', () => {
            if (image) gsap.to(image, { scale: 1, duration: 0.4, ease: 'power2.out' });
            if (content) gsap.to(content, { y: 0, duration: 0.3, ease: 'power2.out' });
        });
    });
    
    // === ГАЛЕРЕЯ ===
    const portfolioItems = document.querySelectorAll('.portfolio__item');
    
    portfolioItems.forEach(item => {
        const image = item.querySelector('.portfolio__image');
        
        item.addEventListener('mouseenter', () => {
            if (image) gsap.to(image, { scale: 1.1, duration: 0.5, ease: 'power2.out' });
        });
        
        item.addEventListener('mouseleave', () => {
            if (image) gsap.to(image, { scale: 1, duration: 0.5, ease: 'power2.out' });
        });
    });
    
    // === КНОПКИ (пульсация) ===
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'back.out(0.3)' });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { scale: 1, duration: 0.2, ease: 'back.inOut' });
        });
    });
    
    // === ПЛАВНЫЙ СКРОЛЛ ===
    const scrollLinks = document.querySelectorAll('.nav__link[href^="#"], .hero__actions .btn--outline');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const hash = this.getAttribute('href');
            if (hash && hash !== '#') {
                e.preventDefault();
                const target = document.querySelector(hash);
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: target,
                            offsetY: headerHeight
                        },
                        ease: 'power2.inOut'
                    });
                }
            }
        });
    });
    
    // === ПРЕЛОАДЕР ===
    const preloader = document.getElementById('preloader');
    if (preloader) {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.8,
            delay: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                preloader.style.display = 'none';
            }
        });
    }
}
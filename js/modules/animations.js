export function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }
    
    console.log('Initializing animations...');
    
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    function animateHeroBg(container) {
        if (!container) return;
        
        const hero = container.querySelector('.hero');
        if (!hero) return;
        
        const heroBg = hero.querySelector('.hero__bg img') || hero;
        
        gsap.killTweensOf(heroBg);
        
        gsap.set(heroBg, { scale: 1 });
        
        gsap.to(heroBg, {
            scale: 1,
            duration: 1.8,
            ease: 'power2.out',
            overwrite: true
        });
    }
    
    function animateContainer(container) {
        if (!container) return;
        
        animateHeroBg(container);
        
        container.querySelectorAll('.section-title').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        container.querySelectorAll('.about__content, .price__intro').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        container.querySelectorAll('.about__info-card').forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: 'back.out(0.4)',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        container.querySelectorAll('.team-card').forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, y: 60, scale: 0.9 },
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
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        container.querySelectorAll('.price__master-card, .price__category, .price__card').forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        container.querySelectorAll('.price__table tr').forEach((row, i) => {
            if (i === 0) return; 
            gsap.fromTo(row,
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    delay: i * 0.05,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 90%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        container.querySelectorAll('.portfolio__item').forEach((el, i) => {
            const fromX = i % 2 === 0 ? -50 : 50;
            gsap.fromTo(el,
                { opacity: 0, x: fromX, scale: 0.9 },
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: 'back.out(0.4)',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        container.querySelectorAll('.about__feature').forEach((el, i) => {
            const fromY = i % 2 === 0 ? -30 : 30;
            gsap.fromTo(el,
                { opacity: 0, y: fromY },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        container.querySelectorAll('.price__book, .price__buttons .btn').forEach(btn => {
            gsap.fromTo(btn,
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    ease: 'back.out(0.6)',
                    scrollTrigger: {
                        trigger: btn,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }
    
    function animateCurrent() {
        const activeContent = document.querySelector('.service-content--active');
        if (activeContent) {
            animateContainer(activeContent);
        }
    }
    
    setTimeout(animateCurrent, 200);
    
    window.addEventListener('serviceChanged', () => {
        setTimeout(animateCurrent, 150);
    });
    
    document.querySelectorAll('.team-card, .price__master-card, .price__category, .portfolio__item, .about__info-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -5,
                duration: 0.25,
                ease: 'power2.out',
                overwrite: true
            });
            gsap.to(card, {
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                duration: 0.25,
                overwrite: true
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.25,
                ease: 'power2.out',
                overwrite: true
            });
            gsap.to(card, {
                boxShadow: 'none',
                duration: 0.25,
                overwrite: true
            });
        });
    });
    
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.03,
                duration: 0.2,
                ease: 'power2.out',
                overwrite: true
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out',
                overwrite: true
            });
        });
    });
    
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
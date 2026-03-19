export function initAnimations() {
    console.log('Initializing animations');
    
    // Проверяем наличие GSAP
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }
    
    // Регистрируем ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Анимация появления секций при скролле
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        gsap.fromTo(section, 
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
    
    // Анимация карточек мастеров
    gsap.fromTo('.team-card', 
        {
            opacity: 0,
            scale: 0.9
        },
        {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.team__grid',
                start: 'top 80%'
            }
        }
    );
    
    // Анимация элементов портфолио
    gsap.fromTo('.portfolio__item', 
        {
            opacity: 0,
            scale: 0.8
        },
        {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.portfolio__grid',
                start: 'top 80%'
            }
        }
    );
    
    // Плавный скролл к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power2.inOut'
                });
            }
        });
    });
}

// Анимация для прелоадера (если хочешь красивое исчезновение)
export function hidePreloaderWithAnimation(preloader) {
    gsap.to(preloader, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            preloader.style.display = 'none';
        }
    });
}
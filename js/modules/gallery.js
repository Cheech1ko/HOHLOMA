export function initGallery() {
    console.log('Initializing galleries with GSAP...');

    // Проверяем, загружен ли GSAP
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, using fallback animations');
        createPlaceholdersWithoutGSAP();
        return;
    }

    // Создаём заглушки для всех трёх галерей с GSAP
    createPlaceholdersWithGSAP('tattoo-portfolio-grid', 'Тату');
    createPlaceholdersWithGSAP('barber-portfolio-grid', 'Барбершоп');
    createPlaceholdersWithGSAP('piercing-portfolio-grid', 'Пирсинг');
}

function createPlaceholdersWithGSAP(containerId, categoryName) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    // Создаём 6 карточек для каждой галереи
    const items = [];
    for (let i = 1; i <= 6; i++) {
        items.push(`
            <div class="portfolio__item placeholder-item" data-category="${categoryName}">
                <div class="portfolio__image placeholder-bg">
                    <div class="placeholder-content">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c9a227" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <span>Пример работы</span>
                        <small>Место для вашего фото</small>
                    </div>
                </div>
            </div>
        `);
    }

    container.innerHTML = items.join('');

    // GSAP анимация: карточки появляются каскадом с эффектом "выезжания" снизу
    const portfolioItems = container.querySelectorAll('.portfolio__item');
    
    // Устанавливаем начальное состояние (невидимые и смещённые вниз)
    gsap.set(portfolioItems, {
        opacity: 0,
        y: 60,
        scale: 0.9
    });

    // Создаём ScrollTrigger для каждой карточки с задержкой
    portfolioItems.forEach((item, index) => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                // Немного задержки для каскадного эффекта
                onEnter: () => {
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        delay: index * 0.08,
                        ease: 'back.out(0.4)',
                        overwrite: true
                    });
                },
                onLeaveBack: () => {
                    gsap.to(item, {
                        opacity: 0,
                        y: 60,
                        scale: 0.9,
                        duration: 0.4,
                        ease: 'power2.in',
                        overwrite: true
                    });
                }
            }
        });
    });
}

// Fallback без GSAP (на всякий случай)
function createPlaceholdersWithoutGSAP() {
    const containers = ['tattoo-portfolio-grid', 'barber-portfolio-grid', 'piercing-portfolio-grid'];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 1; i <= 6; i++) {
            container.innerHTML += `
                <div class="portfolio__item placeholder-item">
                    <div class="portfolio__image placeholder-bg">
                        <div class="placeholder-content">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c9a227" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            <span>Пример работы</span>
                            <small>Место для вашего фото</small>
                        </div>
                    </div>
                </div>
            `;
        }
        
        const items = container.querySelectorAll('.portfolio__item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(item);
        });
    });
}

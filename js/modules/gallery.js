export function initGallery() {
    console.log('Initializing galleries...');

    createPlaceholdersForGallery('tattoo-portfolio-grid');
    createPlaceholdersForGallery('barber-portfolio-grid');
    createPlaceholdersForGallery('piercing-portfolio-grid');
}

function createPlaceholdersForGallery(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    

    for (let i = 1; i <= 8; i++) {
        const item = document.createElement('div');
        item.className = 'portfolio__item';
        item.innerHTML = `
            <div class="portfolio__image placeholder-bg">
                <div class="placeholder-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="1">
                        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span>Пример работы</span>
                </div>
            </div>
        `;
        container.appendChild(item);
    }


    const items = container.querySelectorAll('.portfolio__item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    items.forEach((item, idx) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}
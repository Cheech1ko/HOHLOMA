const GALLERY_IMAGES = {
    tattoo: [
        { src: 'assets/images/portfolio/tattoo-1.jpg', category: 'Реализм' },
        { src: 'assets/images/portfolio/tattoo-2.jpg', category: 'Графика' },
        { src: 'assets/images/portfolio/tattoo-3.jpg', category: 'Олдскул' },
        { src: 'assets/images/portfolio/tattoo-4.jpg', category: 'Минимализм' },
        { src: 'assets/images/portfolio/tattoo-5.jpg', category: 'Биомеханика' },
        { src: 'assets/images/portfolio/tattoo-6.jpg', category: 'Треш-полька' }
    ],
    barber: [
        { src: 'assets/images/portfolio/barber-1.jpg', category: 'Стрижки' },
        { src: 'assets/images/portfolio/barber-2.jpg', category: 'Борода' },
        { src: 'assets/images/portfolio/barber-3.jpg', category: 'Бритьё' },
        { src: 'assets/images/portfolio/barber-4.jpg', category: 'Укладка' },
        { src: 'assets/images/portfolio/barber-5.jpg', category: 'Стрижки' },
        { src: 'assets/images/portfolio/barber-6.jpg', category: 'Борода' }
    ]
};


let currentImages = GALLERY_IMAGES.tattoo;
let currentFilter = 'all';

// Функция для отрисовки галереи
export function renderGallery(containerId, images) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const filteredImages = currentFilter === 'all' 
        ? images 
        : images.filter(img => img.category === currentFilter);
    
    container.innerHTML = filteredImages.map((img, index) => `
        <div class="portfolio__item" data-index="${index}">
            <img src="${img.src}" 
                alt="Portfolio image" 
                class="portfolio__image"
                loading="lazy"
                onerror="this.src='assets/images/placeholder.jpg'">
            <div class="portfolio__overlay">
                <div class="portfolio__info">
                    <span class="portfolio__category">${img.category}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    container.querySelectorAll('.portfolio__item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            openLightbox(filteredImages, index);
        });
    });
}

export function renderFilters(containerId, categories) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const filterButtons = ['all', ...new Set(categories)];
    
    container.innerHTML = filterButtons.map(filter => `
        <button class="portfolio__filter ${filter === currentFilter ? 'portfolio__filter--active' : ''}" 
                data-filter="${filter}">
            ${filter === 'all' ? 'Все работы' : filter}
        </button>
    `).join('');
    
    container.querySelectorAll('.portfolio__filter').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            
            container.querySelectorAll('.portfolio__filter').forEach(b => {
                b.classList.remove('portfolio__filter--active');
            });
            btn.classList.add('portfolio__filter--active');
            
            renderGallery('portfolio-grid', currentImages);
        });
    });
}

// Функция для открытия лайтбокса
function openLightbox(images, startIndex) {
    let lightbox = document.getElementById('portfolio-lightbox');
    
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'portfolio-lightbox';
        lightbox.className = 'portfolio-modal';
        lightbox.innerHTML = `
            <div class="portfolio-modal__content">
                <button class="portfolio-modal__close">&times;</button>
                <img src="" alt="" class="portfolio-modal__image">
                <button class="portfolio-modal__prev">❮</button>
                <button class="portfolio-modal__next">❯</button>
            </div>
        `;
        document.body.appendChild(lightbox);
    }
    
    const img = lightbox.querySelector('.portfolio-modal__image');
    const closeBtn = lightbox.querySelector('.portfolio-modal__close');
    const prevBtn = lightbox.querySelector('.portfolio-modal__prev');
    const nextBtn = lightbox.querySelector('.portfolio-modal__next');
    
    let currentIndex = startIndex;
    
    function showImage(index) {
        if (index >= 0 && index < images.length) {
            img.src = images[index].src;
            currentIndex = index;
        }
    }
    
    showImage(currentIndex);
    lightbox.classList.add('portfolio-modal--active');
    document.body.style.overflow = 'hidden';
    
    closeBtn.onclick = () => {
        lightbox.classList.remove('portfolio-modal--active');
        document.body.style.overflow = '';
    };
    
    prevBtn.onclick = () => showImage(currentIndex - 1);
    nextBtn.onclick = () => showImage(currentIndex + 1);
    
    document.addEventListener('keydown', function handler(e) {
        if (e.key === 'Escape') {
            lightbox.classList.remove('portfolio-modal--active');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handler);
        }
    });
}

// Инициализация галереи
export function initGallery() {
    console.log('Initializing gallery');

    const portfolioGrid = document.getElementById('portfolio-grid');
    const portfolioFilters = document.getElementById('portfolio-filters');
    
    if (!portfolioGrid) return;
    

    const currentService = localStorage.getItem('preferredService') || 'tattoo';
    currentImages = GALLERY_IMAGES[currentService] || GALLERY_IMAGES.tattoo;
    

    const categories = currentImages.map(img => img.category);
    

    if (portfolioFilters) {
        renderFilters('portfolio-filters', categories);
    }
    

    renderGallery('portfolio-grid', currentImages);
    
    // Слушаем смену сервиса
    window.addEventListener('serviceChanged', (e) => {
        currentImages = GALLERY_IMAGES[e.detail.service] || GALLERY_IMAGES.tattoo;
        currentFilter = 'all';
        
        const categories = currentImages.map(img => img.category);
        if (portfolioFilters) {
            renderFilters('portfolio-filters', categories);
        }
        renderGallery('portfolio-grid', currentImages);
    });
}
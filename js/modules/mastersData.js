export const SERVICE_MASTERS_MAP = {
    // Тату
    'tattoo-individual': ['daniil-tattoo', 'anastasia-tattoo', 'yuri-tattoo'],
    'tattoo-catalog': ['daniil-tattoo', 'anastasia-tattoo', 'yuri-tattoo'],
    'tattoo-cover': ['yuri-tattoo', 'daniil-tattoo'],
    
    // Пирсинг
    'piercing-ear': ['victoria-piercing', 'alexey-piercing'],
    'piercing-nose': ['victoria-piercing', 'alexey-piercing'],
    'piercing-lip': ['victoria-piercing'],
    'piercing-eyebrow': ['victoria-piercing'],
    'piercing-tongue': ['victoria-piercing'],
    'piercing-navel': ['victoria-piercing'],
    'piercing-intimate': ['victoria-piercing'],
    
    // Массаж
    'massage-classic': ['alexey-massage'],
    'massage-sport': ['alexey-massage'],
    'massage-anticellulite': ['alexey-massage'],
    
    // Барбершоп
    'barber-haircut-men': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber', 'maxim-barber', 'arianna-barber'],
    'barber-haircut-kids': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber'],
    'barber-beard-modeling': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber'],
    'barber-beard-care': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber'],
    'barber-shave-classic': ['vladimir-barber', 'kirill-barber', 'arianna-barber'],
    'barber-shave-razor': ['vladimir-barber', 'kirill-barber', 'arianna-barber']
};

// Полные данные о мастерах
export const MASTERS_DATA = {
    // Тату-мастера
    'daniil-tattoo': {
        id: 'daniil-tattoo',
        name: 'Даниил Грачёв',
        specialty: 'тату-мастер',
        experience: '8 лет',
        image: 'assets/images/masters/daniil-grachev-tatu-master.jpg',
        bio: 'Специализируется на реализме и графике. Участник международных конвенций.',
        category: 'tattoo',
        isTop: true
    },
    'anastasia-tattoo': {
        id: 'anastasia-tattoo',
        name: 'Анастасия Шиндина',
        specialty: 'тату-мастер',
        experience: '5 лет',
        image: 'assets/images/masters/anastasija-shindina-tatu-master.jpg',
        bio: 'Мастер женских тату, тонкие линии, орнаменты, акварель.',
        category: 'tattoo',
        isTop: true
    },
    'yuri-tattoo': {
        id: 'yuri-tattoo',
        name: 'Юрий Манохин',
        specialty: 'тату-мастер',
        experience: '10 лет',
        image: 'assets/images/masters/jurij-manohin-tatu-master.jpg',
        bio: 'Мастер крупных работ, биомеханика, треш-полька, перекрытия.',
        category: 'tattoo',
        isTop: true
    },
    
    // Барберы
    'vladimir-barber': {
        id: 'vladimir-barber',
        name: 'Владимир',
        specialty: 'топ-барбер',
        experience: '6 лет',
        image: 'assets/images/masters/vladimir-barber-master.jpg',
        bio: 'Стрижки, бритьё, моделирование бороды.',
        category: 'barber',
        isTop: true
    },
    'kirill-barber': {
        id: 'kirill-barber',
        name: 'Кирилл',
        specialty: 'топ-барбер',
        experience: '6 лет',
        image: 'assets/images/masters/kirill-barber-master.jpg',
        bio: 'Стрижки, бритьё, моделирование бороды.',
        category: 'barber',
        isTop: true
    },
    'evgeniy-barber': {
        id: 'evgeniy-barber',
        name: 'Евгений',
        specialty: 'топ-барбер',
        experience: '4 года',
        image: 'assets/images/masters/evgenij-top-barber-master.jpg',
        bio: 'Мастер мужских стрижек, фейд, андеркат.',
        category: 'barber',
        isTop: true
    },
    'maxim-barber': {
        id: 'maxim-barber',
        name: 'Максим',
        specialty: 'барбер',
        experience: '2 года',
        image: 'assets/images/masters/maksim-barber-master.jpg',
        bio: 'Мастер мужских стрижек, фейд, мидпарт, шторы.',
        category: 'barber',
        isTop: false
    },
    'arianna-barber': {
        id: 'arianna-barber',
        name: 'Арианна',
        specialty: 'PROF барбер',
        experience: '3 года',
        image: 'assets/images/masters/ariana-barber-master.jpg',
        bio: 'Специализируется на классических женских стрижках.',
        category: 'barber',
        isTop: false
    },
    
    // Пирсинг
    'victoria-piercing': {
        id: 'victoria-piercing',
        name: 'Виктория Томс',
        specialty: 'пирсер',
        experience: '7 лет',
        image: 'assets/images/masters/viktorija-pirser-master.jpg',
        bio: 'Медицинское образование. Любые виды пирсинга, микродермалы.',
        category: 'piercing',
        isTop: true
    },
    'alexey-piercing': {
        id: 'alexey-piercing',
        name: 'Алексей Бобров',
        specialty: 'младший пирсер',
        experience: '2 года',
        image: 'assets/images/masters/aleksej-mladshij-pirser.jpg',
        bio: 'Проколы мочек, хрящей, пупка.',
        category: 'piercing',
        isTop: false
    },
    
    // Массаж
    'alexey-massage': {
        id: 'alexey-massage',
        name: 'Алексей Авакумов',
        specialty: 'массажист',
        experience: '12 лет',
        image: 'assets/images/masters/aleksej-massazhist.jpg',
        bio: 'Классический, спортивный, антицеллюлитный массаж.',
        category: 'massage',
        isTop: true
    }
};

// Получить мастеров по услуге
export function getMastersByService(serviceId) {
    const masterIds = SERVICE_MASTERS_MAP[serviceId] || [];
    return masterIds.map(id => MASTERS_DATA[id]).filter(m => m);
}

// Получить мастеров по категории (для отображения на странице)
export function getMastersByCategory(category) {
    return Object.values(MASTERS_DATA).filter(m => m.category === category);
}

// Функция для отрисовки карточек мастеров
export function renderMasters(containerId, category) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let masters = [];
    
    switch(category) {
        case 'tattoo':
            masters = Object.values(MASTERS_DATA).filter(m => m.category === 'tattoo');
            break;
        case 'barber':
            masters = Object.values(MASTERS_DATA).filter(m => m.category === 'barber');
            break;
        case 'piercing':
            masters = Object.values(MASTERS_DATA).filter(m => m.category === 'piercing');
            break;
        case 'massage':
            masters = Object.values(MASTERS_DATA).filter(m => m.category === 'massage');
            break;
        default:
            masters = [];
    }
    
    const topMasters = masters.filter(m => m.isTop);
    const regularMasters = masters.filter(m => !m.isTop);
    
    let html = '';
    
    if (topMasters.length > 0) {
        html += `
            <div class="team__group">
                <h3 class="team__group-title">Ведущие мастера</h3>
                <div class="team__grid">
                    ${topMasters.map(m => renderMasterCard(m)).join('')}
                </div>
            </div>
        `;
    }
    
    if (regularMasters.length > 0) {
        html += `
            <div class="team__group">
                <h3 class="team__group-title">Мастера</h3>
                <div class="team__grid">
                    ${regularMasters.map(m => renderMasterCard(m)).join('')}
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function renderMasterCard(master) {
    const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23c9a227' font-family='Arial' font-size='24' font-weight='bold'%3E%D0%A5%D0%9E%D0%A5%D0%9B%D0%9E%D0%9C%D0%90%3C/text%3E%3C/svg%3E";
    
    return `
        <div class="team-card ${master.isTop ? 'team-card--top' : ''}" data-master-id="${master.id}">
            <div class="team-card__image-wrapper">
                <img src="${master.image}" 
                    alt="${master.name}" 
                    class="team-card__image"
                    style="object-position: center 20%;"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='${placeholderSvg}';">
            </div>
            <div class="team-card__content">
                <h3 class="team-card__name">${master.name}</h3>
                <p class="team-card__specialty">${master.specialty}</p>
                <p class="team-card__experience">Стаж: ${master.experience}</p>
                <p class="team-card__bio">${master.bio}</p>
            </div>
        </div>
    `;
}

export function initMastersData() {
    if (document.getElementById('tattoo-masters-grid')) {
        renderMasters('tattoo-masters-grid', 'tattoo');
    }
    if (document.getElementById('barber-masters-grid')) {
        renderMasters('barber-masters-grid', 'barber');
    }
    if (document.getElementById('piercing-masters-grid')) {
        renderMasters('piercing-masters-grid', 'piercing');
    }
    if (document.getElementById('massage-masters-grid')) {
        renderMasters('massage-masters-grid', 'massage');
    }
    
    window.addEventListener('serviceChanged', (e) => {
        const category = e.detail.service;
        const containerId = `${category}-masters-grid`;
        if (document.getElementById(containerId)) {
            renderMasters(containerId, category);
        }
    });
}
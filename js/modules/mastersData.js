export const MASTERS_DATA = {
    tattoo: [
        {
            id: 'daniil-tattoo',
            name: 'Даниил Грачёв',
            specialty: 'тату-мастер',
            experience: '8 лет',
            image: 'assets/images/masters/daniil-grachev-tatu-master.jpg',
            bio: 'Специализируется на реализме и графике. Участник международных конвенций.'
        },
        {
            id: 'anastasia-tattoo',
            name: 'Анастасия Шиндина',
            specialty: 'тату-мастер',
            experience: '5 лет',
            image: 'assets/images/masters/anastasija-shindina-tatu-master.jpg',
            bio: 'Мастер женских тату, тонкие линии, орнаменты, акварель.'
        },
        {
            id: 'yuri-tattoo',
            name: 'Юрий Манохин',
            specialty: 'тату-мастер',
            experience: '10 лет',
            image: 'assets/images/masters/jurij-manohin-tatu-master.jpg',
            bio: 'Мастер крупных работ, биомеханика, треш-полька, перекрытия.'
        }
    ],
    
    barber: [
        {
            id: 'vladimir-barber',
            name: 'Владимир',
            specialty: 'Топ-барбер',
            experience: '6 лет',
            image: 'assets/images/masters/vladimir-barber-master.jpg',
            bio: 'Стрижки, бритьё, моделирование бороды.',
            isTop: true
        },
        {
            id: 'kirill-barber',
            name: 'Кирилл',
            specialty: 'Топ-барбер',
            experience: '6 лет',
            image: 'assets/images/masters/kirill-barber-master.jpg',
            bio: 'Стрижки, бритьё, моделирование бороды.',
            isTop: true
        },
        {
            id: 'evgeniy-barber',
            name: 'Евгений',
            specialty: 'Топ-барбер',
            experience: '4 года',
            image: 'assets/images/masters/evgenij-top-barber-master.jpg',
            bio: 'Мастер мужских стрижек, фейд, андеркат.',
            isTop: true
        },
        {
            id: 'maxim-barber',
            name: 'Максим',
            specialty: 'барбер',
            experience: '2 года',
            image: 'assets/images/masters/maksim-barber-master.jpg',
            bio: 'Мастер мужских стрижек, фейд, мидпарт, шторы.',
            isTop: false
        },
        {
            id: 'arianna-barber',
            name: 'Арианна',
            specialty: 'PROF барбер',
            experience: '3 года',
            image: 'assets/images/masters/ariana-barber-master.jpg',
            bio: 'Специализируется на классических женских стрижках.',
            isTop: false
        }
    ],
    
    piercing: [
        {
            id: 'victoria-piercing',
            name: 'Виктория Томс',
            specialty: 'пирсер',
            experience: '7 лет',
            image: 'assets/images/masters/victoria-piercing.jpg',
            bio: 'Медицинское образование. Любые виды пирсинга, микродермалы.'
        },
        {
            id: 'alexey-piercing',
            name: 'Алексей Бобров',
            specialty: 'младший пирсер',
            experience: '2 года',
            image: 'assets/images/masters/alexey-piercing.jpg',
            bio: 'Проколы мочек, хрящей, пупка.'
        }
    ],
    
    massage: [
        {
            id: 'alexey-massage',
            name: 'Алексей Авакумов',
            specialty: 'массажист',
            experience: '12 лет',
            image: 'assets/images/masters/alexey-massage.jpg',
            bio: 'Классический, спортивный, антицеллюлитный массаж.'
        }
    ]
};

const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22300%22%20viewBox%3D%220%200%20300%20300%22%3E%3Crect%20width%3D%22300%22%20height%3D%22300%22%20fill%3D%22%23333%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23c9a227%22%20font-family%3D%22Arial%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%3E%D0%A5%D0%9E%D0%A5%D0%9B%D0%9E%D0%9C%D0%90%3C%2Ftext%3E%3C%2Fsvg%3E";
export function renderMasters(containerId, mastersArray) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found`);
        return;
    }
    
    if (!mastersArray || mastersArray.length === 0) {
        container.innerHTML = '<p class="text-center">Мастера временно отсутствуют</p>';
        return;
    }
    
    const topMasters = mastersArray.filter(m => m.isTop);
    const regularMasters = mastersArray.filter(m => !m.isTop);
    
    let html = '';

    if (topMasters.length > 0) {
        html += `
            <div class="team__group team__group--top">
                <h3 class="team__group-title">Ведущие мастера</h3>
                <div class="team__grid">
                    ${topMasters.map(m => renderMasterCard(m)).join('')}
                </div>
            </div>
        `;
    }
    
    if (regularMasters.length > 0) {
        html += `
            <div class="team__group team__group--regular">
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
    return `
        <div class="team-card ${master.isTop ? 'team-card--top' : ''}" data-master-id="${master.id}">
            <div class="team-card__image-wrapper">
                <img src="${master.image}" 
                    alt="${master.name}" 
                    class="team-card__image"
                    style="object-position: ${master.imagePosition || 'center 20%'};"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='${PLACEHOLDER_SVG}';">
            </div>
            <div class="team-card__content">
                <h3 class="team-card__name">${master.name}</h3>
                <p class="team-card__specialty">${master.specialty}</p>
                <p class="team-card__experience">Стаж: ${master.experience}</p>
                <p class="team-card__bio">${master.bio}</p>
                <button class="team-card__book" 
                data-master-id="${master.id}">
            Записаться
            </button>
            </div>
        </div>
    `;
}

export function updateMastersByService(service) {
    if (service == 'tattoo') {
        renderMasters('tattoo-masters-grid', MASTERS_DATA.tattoo);
    } else if (service === 'barber') {
        renderMasters('barber-masters-grid', MASTERS_DATA.barber);
    }
}

export function initMastersData() {
    console.log(`Initializing masters data`);

    const tattooGrid = document.getElementById('tattoo-masters-grid');
    const barberGrid = document.getElementById('barber-masters-grid');

    if (tattooGrid) {
        renderMasters('tattoo-masters-grid', MASTERS_DATA.tattoo);
    }
    
    if (barberGrid) {
        renderMasters('barber-masters-grid', MASTERS_DATA.barber);
    }

    window.addEventListener('serviceChanged', (e) => {
        updateMastersByService(e.detail.service);
    });
}
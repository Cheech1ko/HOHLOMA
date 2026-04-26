import { getMastersByService, MASTERS_DATA } from './mastersData.js';

let state = {
    serviceId: null,
    masterId: null,
    weekendSurcharge: 0,
    busySlots: new Set(),
    selectedDate: null,
    selectedTime: null,
    currentMonth: new Date(),
    mode: 'full',
    email: null,
    context: { presetMasterId: null, presetServiceId: null, section: 'all', source: 'nav' }
};

const API_URL = 'https://hohloma-backend.onrender.com/api';
const TIME_SLOTS = [];
for (let hour = 10; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 20 && minute > 0) continue;
        TIME_SLOTS.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
}

const mastersByService = {
    'tattoo-individual': ['daniil-tattoo', 'anastasia-tattoo', 'yuri-tattoo'],
    'tattoo-catalog': ['daniil-tattoo', 'anastasia-tattoo', 'yuri-tattoo'],
    'tattoo-cover': ['yuri-tattoo', 'daniil-tattoo'],
    'piercing-ear': ['victoria-piercing', 'alexey-piercing'],
    'piercing-nose': ['victoria-piercing', 'alexey-piercing'],
    'piercing-lip': ['victoria-piercing'],
    'piercing-eyebrow': ['victoria-piercing'],
    'piercing-tongue': ['victoria-piercing'],
    'piercing-navel': ['victoria-piercing'],
    'piercing-intimate': ['victoria-piercing'],
    'massage-classic': ['alexey-massage'],
    'massage-sport': ['alexey-massage'],
    'massage-anticellulite': ['alexey-massage'],
    'barber-haircut-men': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber', 'maxim-barber', 'arianna-barber'],
    'barber-haircut-kids': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber'],
    'barber-beard-modeling': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber'],
    'barber-beard-care': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber'],
    'barber-shave-classic': ['vladimir-barber', 'kirill-barber', 'arianna-barber'],
    'barber-shave-razor': ['vladimir-barber', 'kirill-barber', 'arianna-barber'],
    'barber-haircut-beard': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber', 'maxim-barber', 'arianna-barber'],
    'barber-haircut-machine': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber', 'maxim-barber', 'arianna-barber'],
    'barber-shave-bald': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber'],
    'barber-shave-royal': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber'],
    'barber-styling': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber', 'maxim-barber', 'arianna-barber'],
    'barber-correction': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber', 'maxim-barber', 'arianna-barber'],
    'barber-father-son': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber', 'maxim-barber', 'arianna-barber'],
    'barber-hair-toning': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber', 'maxim-barber', 'arianna-barber'],
    'barber-beard-toning': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber', 'maxim-barber', 'arianna-barber'],
    'barber-coloring': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber', 'maxim-barber', 'arianna-barber']
};

function getServicesList() {
    return [
        { id: 'barber-haircut-men', name: 'Мужская стрижка', basePrice: 1400, time: '1 час', category: 'barber' },
        { id: 'barber-haircut-kids', name: 'Детская стрижка (4-12 лет)', basePrice: 1100, time: '45 мин', category: 'barber' },
        { id: 'barber-beard-modeling', name: 'Оформление бороды / усов', basePrice: 900, time: '30 мин', category: 'barber' },
        { id: 'barber-haircut-beard', name: 'Стрижка + оформление бороды', basePrice: 2000, time: '1 час 30 мин', category: 'barber' },
        { id: 'barber-haircut-machine', name: 'Стрижка машинкой', basePrice: 800, time: '30 мин', category: 'barber' },
        { id: 'barber-shave-bald', name: 'Бритьё наголо', basePrice: 1000, time: '30 мин', category: 'barber' },
        { id: 'barber-shave-royal', name: 'Королевское бритьё', basePrice: 1100, time: '45 мин', category: 'barber' },
        { id: 'barber-styling', name: 'Укладка', basePrice: 500, time: '20 мин', category: 'barber' },
        { id: 'barber-correction', name: 'Коррекция стрижки', basePrice: 300, time: '20 мин', category: 'barber' },
        { id: 'barber-father-son', name: 'Отец + сын', basePrice: 2000, time: '1 час 30 мин', category: 'barber' },
        { id: 'barber-hair-toning', name: 'Тонирование волос', basePrice: 1500, time: '45 мин', category: 'barber' },
        { id: 'barber-beard-toning', name: 'Тонирование бороды', basePrice: 1100, time: '30 мин', category: 'barber' },
        { id: 'barber-coloring', name: 'Окрашивание', basePrice: 3000, time: '1 час 30 мин', category: 'barber' },
        { id: 'tattoo-individual', name: 'Татуировка (индивидуальный эскиз)', basePrice: 4000, time: '2 часа', category: 'tattoo' },
        { id: 'tattoo-catalog', name: 'Татуировка (из каталога)', basePrice: 4000, time: '2 часа', category: 'tattoo' },
        { id: 'tattoo-cover', name: 'Перекрытие/исправление тату', basePrice: 8000, time: '3 часа', category: 'tattoo' },
        { id: 'piercing-ear', name: 'Пирсинг уха', basePrice: 1000, time: '30 мин', category: 'piercing' },
        { id: 'piercing-nose', name: 'Пирсинг носа', basePrice: 1500, time: '30 мин', category: 'piercing' },
        { id: 'piercing-lip', name: 'Пирсинг губы', basePrice: 1500, time: '30 мин', category: 'piercing' },
        { id: 'piercing-navel', name: 'Пирсинг пупка', basePrice: 2000, time: '30 мин', category: 'piercing' },
        { id: 'massage-classic', name: 'Классический массаж', basePrice: 2000, time: '60 мин', category: 'massage' },
        { id: 'massage-sport', name: 'Спортивный массаж', basePrice: 2500, time: '60 мин', category: 'massage' },
        { id: 'massage-anticellulite', name: 'Антицеллюлитный массаж', basePrice: 2200, time: '60 мин', category: 'massage' }
    ];
}

function getServicePrice(serviceId) {
    return getServicesList().find(s => s.id === serviceId)?.basePrice || 0;
}

function getServiceName(serviceId) {
    return getServicesList().find(s => s.id === serviceId)?.name || serviceId;
}

function getMasterSurcharge(masterId) {
    const master = MASTERS_DATA[masterId];
    if (!master) return 0;
    if (master.id === 'vladimir-barber' || master.id === 'kirill-barber') return 400;
    if (master.id === 'evgeniy-barber') return 200;
    return 0;
}

function getTotalPrice() {
    return getServicePrice(state.serviceId) + getMasterSurcharge(state.masterId) + state.weekendSurcharge;
}

function getBlockedSlots(busyTimes) {
    const blocked = new Set();
    busyTimes.forEach(time => {
        const [hour, minute] = time.split(':').map(Number);
        
        const startMinute = Math.floor(minute / 15) * 15;
        
        for (let i = 0; i < 4; i++) {
            let newMinute = startMinute + i * 15;
            let newHour = hour;
            if (newMinute >= 60) {
                newMinute -= 60;
                newHour++;
            }
            if (newHour <= 20) {
                blocked.add(`${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`);
            }
        }
    });
    return blocked;
}

async function loadBusySlots(masterId, date) {
    try {
        const res = await fetch(`${API_URL}/bookings/check?master=${encodeURIComponent(masterId)}&date=${encodeURIComponent(date)}`);
        const data = await res.json();
        const rawSlots = Array.isArray(data.times) ? data.times : [];
        state.busySlots = getBlockedSlots(rawSlots);
        console.log(`📅 Загружены занятые слоты для ${masterId} на ${date}:`, state.busySlots);
    } catch (error) {
        console.error('❌ Ошибка загрузки слотов:', error);
        state.busySlots = new Set();
    }
}

async function loadNearestSlotsForMaster(masterId) {
    try {
        const response = await fetch(`${API_URL}/nearest-slots?masterId=${masterId}`);
        const data = await response.json();
        return data.slots || [];
    } catch (error) {
        console.error('❌ Ошибка загрузки ближайших слотов:', error);
        return [];
    }
}

function getAnyMasterId() {
    let masters = state.serviceId
        ? (mastersByService[state.serviceId] || []).map(id => MASTERS_DATA[id]).filter(Boolean)
        : Object.values(MASTERS_DATA).filter(m => m.category === state.context.section || state.context.section === 'all');
    return masters[0]?.id || null;
}

function getMasterServices(masterId) {
    const services = [];
    for (const [serviceId, masterIds] of Object.entries(mastersByService)) {
        if (masterIds.includes(masterId)) {
            services.push(serviceId);
        }
    }
    return services;
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function formatDateShort(dateStr) {
    const [day, month] = dateStr.split('.');
    return `${day}.${month}`;
}

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('.');
    return new Date(year, month - 1, day);
}

function generateMonthDays(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let startOffset = firstDay.getDay() - 1;
    if (startOffset === -1) startOffset = 6;
    
    const days = [];
    
    for (let i = 0; i < startOffset; i++) {
        days.push({ date: null, isEmpty: true });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push({ date: new Date(year, month, i), isEmpty: false });
    }
    
    return days;
}

function showWeekendNotice(show) {
    let notice = document.querySelector('.weekend-notice');
    if (show && !notice) {
        const slotsGrid = document.querySelector('.time-calendar__slots');
        if (slotsGrid?.parentNode) {
            notice = document.createElement('div');
            notice.className = 'weekend-notice';
            notice.innerHTML = '💰 В выходные и праздничные дни наценка +200₽';
            slotsGrid.parentNode.insertBefore(notice, slotsGrid.nextSibling);
        }
    }
    if (notice) notice.style.display = show ? 'block' : 'none';
}

function showNotification(message) {
    const modal = document.getElementById('notification-modal');
    if (!modal) return;
    const msgEl = modal.querySelector('.modal__message');
    if (msgEl) msgEl.textContent = message;
    modal.classList.add('modal--active');
    setTimeout(() => modal.classList.remove('modal--active'), 5000);
}

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const Templates = {
    full: `
        <div class="modal-booking__close-btn" id="modal-close">✕</div>
        <div id="full-start">
            <div class="booking-header">
                <h2 class="booking-header__title">ХОХЛОМА TATTOO&BARBER</h2>
                <div class="booking-header__address">
                    <span>Московская улица, 69</span>
                    <a href="#" class="booking-header__how-to-get">Как проехать?</a>
                </div>
            </div>
            <div class="booking-start__title">Онлайн-запись</div>
            <div class="booking-start__subtitle">Выберите, с чего вы хотите начать</div>
            <div class="booking-options">
                <button class="booking-option-btn" data-start="service">Выбрать услугу<span class="booking-option-btn__arrow">›</span></button>
                <button class="booking-option-btn" data-start="master">Выбрать мастера<span class="booking-option-btn__arrow">›</span></button>
                <button class="booking-option-btn" data-start="any-master">Любой мастер<span class="booking-option-btn__arrow">›</span></button>
            </div>
            <div class="booking-footer">
                <button class="booking-footer__btn" id="start-next">Далее</button>
                <div class="booking-footer__powered">Онлайн-запись</div>
            </div>
        </div>
        <div id="full-service" style="display:none;">
            <div class="booking-screen-header">
                <button class="booking-back-btn" data-back="start">← Назад</button>
                <h3>Выберите услугу</h3>
            </div>
            <div class="booking-services__grid" id="services-grid"></div>
            <div class="booking-footer"><button class="booking-footer__btn" id="service-next">Далее</button></div>
        </div>
        <div id="full-master" style="display:none;">
            <div class="booking-screen-header">
                <button class="booking-back-btn" data-back="start">← Назад</button>
                <h3>Выберите мастера</h3>
            </div>
            <div class="booking-masters__grid" id="masters-grid"></div>
            <div class="booking-footer"><button class="booking-footer__btn" id="master-next">Далее</button></div>
        </div>
        <div id="full-time" style="display:none;">
            <div class="booking-screen-header">
                <button class="booking-back-btn" data-back="start">← Назад</button>
                <h3>Выберите дату и время</h3>
            </div>
            <div class="time-calendar">
                <div class="price-preview" id="full-price-preview">
                    <span> Итого: </span>
                    <strong id="full-total-price-display">0 ₽</strong>
                </div>
                <div class="time-calendar__header">
                    <button class="time-calendar__prev" id="full-calendar-prev">‹</button>
                    <div class="time-calendar__month" id="full-calendar-month">Апрель 2026</div>
                    <button class="time-calendar__next" id="full-calendar-next">›</button>
                </div>
                <div class="time-calendar__weekdays">
                    <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
                </div>
                <div class="time-calendar__days" id="full-days-grid"></div>
                <div class="time-calendar__slots-wrapper" id="full-slots-wrapper">
                    <div class="time-calendar__slots" id="full-slots-grid"></div>
                </div>
            </div>
            <div class="booking-footer"><button class="booking-footer__btn" id="time-next">Далее</button></div>
        </div>
        <div id="full-client" style="display:none;">
            <div class="booking-screen-header">
                <button class="booking-back-btn" data-back="time">← Назад</button>
                <h3>Ваши данные</h3>
            </div>
            <div class="booking-summary" id="summary"></div>
            <div class="form-row">
                <div class="form-group"><label>Имя</label><input type="text" id="name" class="form-input" placeholder="Имя"></div>
                <div class="form-group"><label>Телефон</label><input type="tel" id="phone" class="form-input" placeholder="+7 (___) ___-__-__"></div>
                <div class="form-group"><label>Email *</label><input type="email" id="email" class="form-input" placeholder="example@mail.ru" required></div>
            </div>
            <div class="form-group"><label>Комментарий</label><textarea id="comment" class="form-textarea" rows="3"></textarea></div>
            <div class="form-group--policy"><input type="checkbox" id="policy" checked><label>Я согласен на обработку персональных данных</label></div>
            <div class="booking-footer"><button class="booking-footer__btn" id="submit-booking">Записаться</button></div>
        </div>
    `,
    step: `
        <div class="modal-booking__close-btn" id="modal-close">✕</div>
    <div class="booking-steps__nav">
        <div class="booking-steps__step" data-step="1"><span class="booking-steps__number">1</span><span class="booking-steps__label">Услуги</span></div>
        <div class="booking-steps__step" data-step="2"><span class="booking-steps__number">2</span><span class="booking-steps__label">Мастер</span></div>
        <div class="booking-steps__step" data-step="3"><span class="booking-steps__number">3</span><span class="booking-steps__label">Время</span></div>
        <div class="booking-steps__step" data-step="4"><span class="booking-steps__number">4</span><span class="booking-steps__label">Данные</span></div>
    </div>
    
    <!-- ШАГ 1: УСЛУГИ -->
    <div class="booking-step" data-step="1">
        <div class="booking-step__header">
            <button class="booking-step__back" data-prev="1" style="visibility: hidden;">← Назад</button>
            <h3>Выберите услугу</h3>
            <div style="width: 80px;"></div>
        </div>
        <div class="booking-services__grid" id="step-services-grid"></div>
        <div class="booking-step__footer">
            <button class="btn btn--primary btn-next" data-next="2">Далее</button>
        </div>
    </div>
    
    <!-- ШАГ 2: МАСТЕРА -->
    <div class="booking-step" data-step="2" style="display:none;">
        <div class="booking-step__header">
            <button class="booking-step__back" data-prev="1">← Назад</button>
            <h3>Выберите мастера</h3>
            <div style="width: 80px;"></div>
        </div>
        <div class="booking-masters__grid" id="step-masters-grid"></div>
        <div class="booking-step__footer">
            <button class="btn btn--primary btn-next" data-next="3">Далее</button>
        </div>
    </div>
    
    <!-- ШАГ 3: ДАТА И ВРЕМЯ -->
    <div class="booking-step" data-step="3" style="display:none;">
        <div class="booking-step__header">
            <button class="booking-step__back" data-prev="2">← Назад</button>
            <h3>Выберите дату и время</h3>
            <div style="width: 80px;"></div>
        </div>
        <div class="time-calendar">
            <div class="price-preview" id="step-price-preview-calendar">
                <span>Итого: </span>
                <strong id="step-calendar-price-display">0 ₽</strong>
            </div>
            <div class="time-calendar__header">
                <button class="time-calendar__prev" id="step-calendar-prev">‹</button>
                <div class="time-calendar__month" id="step-calendar-month">Апрель 2026</div>
                <button class="time-calendar__next" id="step-calendar-next">›</button>
            </div>
            <div class="time-calendar__weekdays">
                <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
            </div>
            <div class="time-calendar__days" id="step-days-grid"></div>
            <div class="time-calendar__slots-wrapper" id="step-slots-wrapper">
                <div class="time-calendar__slots" id="step-slots-grid"></div>
            </div>
        </div>
        <div class="booking-step__footer">
            <button class="btn btn--primary" id="step-time-next">Далее</button>
        </div>
    </div>
    
    <!-- ШАГ 4: ДАННЫЕ КЛИЕНТА -->
    <div class="booking-step" data-step="4" style="display:none;">
        <div class="booking-step__header">
            <button class="booking-step__back" data-prev="3">← Назад</button>
            <h3>Ваши данные</h3>
            <div style="width: 80px;"></div>
        </div>
        <div class="booking-summary" id="step-summary"></div>
        <div class="form-row">
            <div class="form-group"><label>Имя</label><input type="text" id="step-name" class="form-input" placeholder="Имя"></div>
            <div class="form-group"><label>Телефон</label><input type="tel" id="step-phone" class="form-input" placeholder="+7 (___) ___-__-__"></div>
        </div>
        <div class="form-group"><label>Email *</label><input type="email" id="step-email" class="form-input" placeholder="example@mail.ru" required></div>
        <div class="form-group"><label>Комментарий</label><textarea id="step-comment" class="form-textarea" rows="3"></textarea></div>
        <div class="form-group--policy"><input type="checkbox" id="step-policy" checked><label>Я согласен на обработку персональных данных</label></div>
        <div class="booking-step__footer">
            <button class="btn btn--primary" id="step-submit">Записаться</button>
        </div>
    </div>
`
};

const FullMode = {
    showScreen(screen) {
        ['start', 'service', 'master', 'time', 'client'].forEach(s => {
            const el = document.getElementById(`full-${s}`);
            if (el) el.style.display = s === screen ? 'block' : 'none';
        });
    },

    updatePricePreview() {
        const priceDisplay = document.getElementById('full-total-price-display');
        if (!priceDisplay) return;
        const totalPrice = getTotalPrice();
        priceDisplay.textContent = `${totalPrice} ₽`;
        let tooltip = `${getServicePrice(state.serviceId)} ₽ (база)`;
        const masterSurcharge = getMasterSurcharge(state.masterId);
        if (masterSurcharge > 0) tooltip += ` + ${masterSurcharge} ₽ (уровень мастера)`;
        if (state.weekendSurcharge > 0) tooltip += ` + ${state.weekendSurcharge} ₽ (выходной)`;
        priceDisplay.title = tooltip;
    },

    renderServices(services) {
        const grid = document.getElementById('services-grid');
        if (!grid) return;
        grid.innerHTML = services.map(s => `
            <div class="booking-service" data-service-id="${s.id}">
                <div class="booking-service__info"><h4>${s.name}</h4><div>от ${s.basePrice}₽ • ${s.time}</div></div>
                <div class="booking-service__select"></div>
            </div>
        `).join('');
        grid.querySelectorAll('.booking-service').forEach(el => {
            el.addEventListener('click', () => {
                grid.querySelectorAll('.booking-service').forEach(s => s.classList.remove('selected'));
                el.classList.add('selected');
                state.serviceId = el.dataset.serviceId;
                FullMode.updatePricePreview();
            });
        });
    },

    renderMasters(masters) {
        const grid = document.getElementById('masters-grid');
        if (!grid) return;
        grid.innerHTML = masters.map(m => `
            <div class="booking-master" data-master-id="${m.id}">
                <div class="booking-master__avatar"><img src="${m.image || 'assets/images/placeholder.jpg'}" alt="${m.name}"></div>
                <div class="booking-master__info"><h4>${m.name}</h4><p>${m.specialty || 'мастер'}</p><div>★★★★★ 5,0</div></div>
                <div class="booking-master__select"></div>
            </div>
        `).join('');
        grid.querySelectorAll('.booking-master').forEach(el => {
            el.addEventListener('click', () => {
                grid.querySelectorAll('.booking-master').forEach(m => m.classList.remove('selected'));
                el.classList.add('selected');
                state.masterId = el.dataset.masterId;
                FullMode.updatePricePreview();
            });
        });
    },

    initServicesGrid() {
        let services = getServicesList();
        if (state.context.section !== 'all') {
            services = services.filter(s => s.category === state.context.section);
        }
        this.renderServices(services);
    },

initMastersGrid() {
    const grid = document.getElementById('masters-grid');
    if (!grid) return;
    
    let masters = state.serviceId
        ? (mastersByService[state.serviceId] || []).map(id => MASTERS_DATA[id]).filter(Boolean)
        : Object.values(MASTERS_DATA).filter(m => m.category === state.context.section || state.context.section === 'all');
    
    grid.innerHTML = masters.map(m => `
        <div class="booking-master" data-master-id="${m.id}">
            <div class="booking-master__avatar"><img src="${m.image || 'assets/images/placeholder.jpg'}" alt="${m.name}"></div>
            <div class="booking-master__info">
                <h4>${m.name}</h4>
                <p>${m.specialty || 'мастер'}</p>
                <div>★★★★★ 5,0</div>
                <div class="master-slots-container" data-master="${m.id}" style="display: none; margin-top: 10px;">
                    <div class="slots-title"> Ближайшие слоты:</div>
                    <div class="slots-buttons"></div>
                </div>
            </div>
            <div class="booking-master__select"></div>
        </div>
    `).join('');
    
    // Загружаем слоты для каждого мастера
    masters.forEach(async (master) => {
        const slotsContainer = document.querySelector(`.master-slots-container[data-master="${master.id}"]`);
        if (!slotsContainer) return;
        
        const slots = await loadNearestSlotsForMaster(master.id);
        const slotsButtons = slotsContainer.querySelector('.slots-buttons');
        
        if (slots && slots.length > 0) {
            slotsButtons.innerHTML = slots.map(slot => `
                <button class="slot-btn" data-date="${slot.date}" data-time="${slot.time}">
                    ${formatDateShort(slot.date)} ${slot.time}
                </button>
            `).join('');
            
            slotsButtons.querySelectorAll('.slot-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Сохраняем мастера, дату и время
                    state.masterId = master.id;
                    state.selectedDate = parseDate(btn.dataset.date);
                    state.selectedTime = btn.dataset.time;
                    
                    // Находим услуги этого мастера
                    const servicesForMaster = getMasterServices(state.masterId);
                    if (servicesForMaster.length) {
                        const allServices = getServicesList();
                        const filtered = allServices.filter(s => servicesForMaster.includes(s.id));
                        
                        // Показываем услуги мастера
                        const servicesGrid = document.getElementById('services-grid');
                        if (servicesGrid) {
                            servicesGrid.innerHTML = filtered.map(s => `
                                <div class="booking-service" data-service-id="${s.id}">
                                    <div class="booking-service__info">
                                        <h4>${s.name}</h4>
                                        <div>от ${s.basePrice}₽ • ${s.time}</div>
                                    </div>
                                    <div class="booking-service__select"></div>
                                </div>
                            `).join('');
                            
                            servicesGrid.querySelectorAll('.booking-service').forEach(serviceEl => {
                                serviceEl.addEventListener('click', () => {
                                    servicesGrid.querySelectorAll('.booking-service').forEach(s => s.classList.remove('selected'));
                                    serviceEl.classList.add('selected');
                                    state.serviceId = serviceEl.dataset.serviceId;
                                    FullMode.updateSummary();
                                    FullMode.showScreen('client');
                                });
                            });
                        }
                        
                        // Переключаемся на экран услуг
                        FullMode.showScreen('service');
                    }
                });
            });
            slotsContainer.style.display = 'block';
        }
    });
    
    grid.querySelectorAll('.booking-master').forEach(el => {
        el.addEventListener('click', () => {
            grid.querySelectorAll('.booking-master').forEach(m => m.classList.remove('selected'));
            el.classList.add('selected');
            state.masterId = el.dataset.masterId;
        });
    });
    },

    renderDays() {
const daysGrid = document.getElementById('full-days-grid');
    if (!daysGrid) return;
    
    const monthSpan = document.getElementById('full-calendar-month');
    if (monthSpan) {
        monthSpan.textContent = `${monthNames[state.currentMonth.getMonth()]} ${state.currentMonth.getFullYear()}`;
    }
    
    const days = generateMonthDays(state.currentMonth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    daysGrid.innerHTML = days.map(day => {
        if (day.isEmpty) {
            return `<div class="time-calendar__day empty"></div>`;
        }
        
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);
        
        const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
        const isPast = dayDate < today;
        const isSelected = state.selectedDate && formatDate(day.date) === formatDate(state.selectedDate);
        
        let classes = 'time-calendar__day';
        if (isSelected) classes += ' selected';
        if (isPast) classes += ' disabled';
        if (isWeekend) classes += ' weekend';
        
        return `<div class="${classes}" data-date="${formatDate(day.date)}">${day.date.getDate()}</div>`;
    }).join('');
        daysGrid.querySelectorAll('.time-calendar__day:not(.disabled)').forEach(el => {
            el.addEventListener('click', async () => {
                daysGrid.querySelectorAll('.time-calendar__day').forEach(d => d.classList.remove('selected'));
                el.classList.add('selected');
                const dateStr = el.dataset.date;
                const [day, month, year] = dateStr.split('.');
                state.selectedDate = new Date(year, month - 1, day);
                const masterName = MASTERS_DATA[state.masterId]?.name || state.masterId;
                await loadBusySlots(masterName, dateStr);
                this.renderSlots();
                const isWeekend = state.selectedDate.getDay() === 0 || state.selectedDate.getDay() === 6;
                state.weekendSurcharge = isWeekend ? 200 : 0;
                showWeekendNotice(isWeekend);
                this.updatePricePreview();
            });
        });
    },

    renderSlots() {
        const slotsGrid = document.getElementById('full-slots-grid');
        if (!slotsGrid) return;
        
        slotsGrid.innerHTML = TIME_SLOTS.map(slot => {
            const isDisabled = state.busySlots.has(slot);
            const isSelected = state.selectedTime === slot;
            
            let isInRange = false;
            if (state.selectedTime && !isSelected) {
                const [selectedHour, selectedMinute] = state.selectedTime.split(':').map(Number);
                const [currentHour, currentMinute] = slot.split(':').map(Number);
                const selectedMinutes = selectedHour * 60 + selectedMinute;
                const currentMinutes = currentHour * 60 + currentMinute;
                if (currentMinutes > selectedMinutes && currentMinutes <= selectedMinutes + 45) {
                    isInRange = true;
                }
            }
            
            let classes = 'time-calendar__slot';
            if (isSelected) classes += ' selected';
            if (isDisabled) classes += ' disabled';
            if (isInRange) classes += ' in-range';
            
            return `<div class="${classes}" data-time="${slot}">${slot}</div>`;
        }).join('');
        
        slotsGrid.querySelectorAll('.time-calendar__slot:not(.disabled)').forEach(el => {
            el.addEventListener('click', () => {
                slotsGrid.querySelectorAll('.time-calendar__slot').forEach(s => s.classList.remove('selected'));
                el.classList.add('selected');
                state.selectedTime = el.dataset.time;
                this.renderSlots();
                this.updatePricePreview();
            });
        });
    },

    initTimeCalendar() {
        this.renderDays();
        this.renderSlots();
        const prevBtn = document.getElementById('full-calendar-prev');
        const nextBtn = document.getElementById('full-calendar-next');
        if (prevBtn) {
            prevBtn.replaceWith(prevBtn.cloneNode(true));
            document.getElementById('full-calendar-prev')?.addEventListener('click', () => {
                state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() - 1, 1);
                this.renderDays();
            });
        }
        if (nextBtn) {
            nextBtn.replaceWith(nextBtn.cloneNode(true));
            document.getElementById('full-calendar-next')?.addEventListener('click', () => {
                state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() + 1, 1);
                this.renderDays();
            });
        }
        this.updatePricePreview();
    },

    updateSummary() {
        const summary = document.getElementById('summary');
        if (!summary) return;
        const master = MASTERS_DATA[state.masterId];
        const serviceName = getServiceName(state.serviceId);
        const dateStr = state.selectedDate ? formatDate(state.selectedDate) : '—';
        summary.innerHTML = `
            <div><strong>Услуга:</strong> ${serviceName}</div>
            <div><strong>Мастер:</strong> ${master?.name || '—'}${master?.specialty ? ` (${master.specialty})` : ''}</div>
            <div><strong>Дата/время:</strong> ${dateStr} ${state.selectedTime || '—'}</div>
            <div><strong>Итого:</strong> ${getTotalPrice()}₽</div>
        `;
    },

    initPhoneMask() {
        const input = document.getElementById('phone');
        if (!input) return;
        input.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '');
            if (!v.length) return;
            if (v.length <= 1) v = '+7';
            else if (v.length <= 4) v = '+7 (' + v.substring(1, 4);
            else if (v.length <= 7) v = '+7 (' + v.substring(1, 4) + ') ' + v.substring(4, 7);
            else if (v.length <= 9) v = '+7 (' + v.substring(1, 4) + ') ' + v.substring(4, 7) + '-' + v.substring(7, 9);
            else v = '+7 (' + v.substring(1, 4) + ') ' + v.substring(4, 7) + '-' + v.substring(7, 9) + '-' + v.substring(9, 11);
            e.target.value = v;
        });
    },

    async submit() {
        const name = document.getElementById('name')?.value;
        const phone = document.getElementById('phone')?.value;
        const email = document.getElementById('email')?.value;
        const comment = document.getElementById('comment')?.value || '';
            document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
        el.classList.remove('error');
        const msg = el.parentNode?.querySelector('.error-message');
        if (msg) msg.remove();
    });
    
    let isValid = true;
    
    if (!name || name.trim() === '') {
        const nameInput = document.getElementById('name');
        nameInput.classList.add('error');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = 'Введите имя';
        nameInput.parentNode.appendChild(errorSpan);
        isValid = false;
    }
    
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phone || !phoneRegex.test(phone)) {
        const phoneInput = document.getElementById('phone');
        phoneInput.classList.add('error');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = 'Введите номер в формате +7 (XXX) XXX-XX-XX';
        phoneInput.parentNode.appendChild(errorSpan);
        isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        const emailInput = document.getElementById('email');
        emailInput.classList.add('error');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = 'Введите корректный email (пример: name@mail.ru)';
        emailInput.parentNode.appendChild(errorSpan);
        isValid = false;
    }
    
    if (!state.serviceId) {
        showNotification('Выберите услугу');
        return;
    }
    if (!state.masterId) {
        showNotification('Выберите мастера');
        return;
    }
    if (!state.selectedDate || !state.selectedTime) {
        showNotification('Выберите дату и время');
        return;
    }
    
    if (!isValid) return;
    
    const master = MASTERS_DATA[state.masterId];
    const booking = {
        name: name.trim(),
        phone, email,
        service: getServiceName(state.serviceId),
        master: master?.name || state.masterId,
        masterLevel: master?.specialty || '',
        date: formatDate(state.selectedDate),
        time: state.selectedTime,
        price: getTotalPrice(),
        comment,
        createdAt: new Date().toISOString()
    };
    
    const btn = document.getElementById('submit-booking');
    const original = btn.textContent;
    btn.textContent = 'Отправка...';
    btn.disabled = true;
    
    try {
        const res = await fetch(`${API_URL}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(booking) });
        const data = await res.json();
            if (data.success) {
                showNotification('✅ Запись сохранена!');
                setTimeout(() => {
                    const modal = document.getElementById('modal-booking');
                    if (modal) modal.classList.remove('modal-booking--active');
                    document.body.style.overflow = '';
                }, 2000);
            } else if (data.error === 'Это время уже занято') {
                showNotification('❌ Это время уже занято');
                const masterName = MASTERS_DATA[state.masterId]?.name || state.masterId;
                await loadBusySlots(masterName, formatDate(state.selectedDate));
                this.renderSlots();
            } else {
                showNotification(data.error || 'Ошибка');
            }
        } catch (error) {
            showNotification('Ошибка соединения');
        } finally {
            btn.textContent = original;
            btn.disabled = false;
        }
    },

    reset() {
        state.selectedDate = null;
        state.selectedTime = null;
        state.busySlots = new Set();
        state.weekendSurcharge = 0;
        state.currentMonth = new Date();
        state.email = null;
        ['name', 'phone', 'email', 'comment'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
        if (el) el.classList.remove('error');
        const msg = el?.parentNode?.querySelector('.error-message');
        if (msg) msg.remove();
    });
    },

    attachEvents() {
        document.querySelectorAll('[data-start]').forEach(btn => {
            btn.addEventListener('click', () => {
                const start = btn.dataset.start;
                if (start === 'service') {
                    state.masterId = null;
                    this.initServicesGrid();
                    this.showScreen('service');
                } else if (start === 'master') {
                    state.serviceId = null;
                    state.masterId = null;
                    this.initMastersGrid();
                    this.showScreen('master');
                } else if (start === 'any-master') {
                    state.masterId = 'any';
                    this.initServicesGrid();
                    this.showScreen('service');
                }
            });
        });
        document.querySelectorAll('[data-back]').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.back;
                if (target === 'time') {

                this.initTimeCalendar();
                this.showScreen('time');
            } else {
                this.showScreen(target);
            }
        });
    });
        document.getElementById('start-next')?.addEventListener('click', async () => {
            if (!state.serviceId && !state.masterId) {
                showNotification('Выберите услугу или мастера');
                return;
            }
            if (state.masterId === 'any') {
                const anyId = getAnyMasterId();
                if (!anyId) {
                    showNotification('Нет доступных мастеров');
                    return;
                }
                state.masterId = anyId;
            }
            if (state.masterId && !state.serviceId) {
                const servicesForMaster = getMasterServices(state.masterId);
                if (servicesForMaster.length) {
                    const allServices = getServicesList();
                    const filtered = allServices.filter(s => servicesForMaster.includes(s.id));
                    this.renderServices(filtered);
                    this.showScreen('service');
                    return;
                }
            }
            if (state.serviceId && !state.masterId) {
                this.initMastersGrid();
                this.showScreen('master');
                return;
            }
            if (state.serviceId && state.masterId) {
                this.initTimeCalendar();
                this.showScreen('time');
            }
        });

        document.getElementById('service-next')?.addEventListener('click', () => {
            if (!state.serviceId) {
                showNotification('Выберите услугу');
                return;
            }
            if (state.masterId) {
                this.initTimeCalendar();
                this.showScreen('time');
            } else {
                this.initMastersGrid();
                this.showScreen('master');
            }
        });

        document.getElementById('master-next')?.addEventListener('click', () => {
            if (!state.masterId) {
                showNotification('Выберите мастера');
                return;
            }
            if (state.serviceId) {
                this.initTimeCalendar();
                this.showScreen('time');
            } else {
                const servicesForMaster = getMasterServices(state.masterId);
                if (servicesForMaster.length) {
                    const allServices = getServicesList();
                    const filtered = allServices.filter(s => servicesForMaster.includes(s.id));
                    this.renderServices(filtered);
                    this.showScreen('service');
                } else {
                    showNotification('У этого мастера нет услуг');
                }
            }
        });

        document.getElementById('time-next')?.addEventListener('click', () => {
            if (!state.selectedDate || !state.selectedTime) {
                showNotification('Выберите дату и время');
                return;
            }
            this.updateSummary();
            this.showScreen('client');
        });

        document.getElementById('submit-booking')?.addEventListener('click', () => this.submit());

        document.querySelectorAll('[data-back]').forEach(btn => {
            btn.addEventListener('click', () => this.showScreen(btn.dataset.back));
        });

        this.initServicesGrid();
        this.initMastersGrid();
        this.initPhoneMask();
        this.showScreen('start');
    }
};

const StepMode = {
    currentStep: 1,

    showStep(step) {
        this.currentStep = step;
        document.querySelectorAll('.booking-step').forEach(el => {
            if (el.dataset.step == step) {
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        });
        document.querySelectorAll('.booking-steps__step').forEach((el, i) => {
            el.classList.remove('active', 'completed');
            if (i + 1 < step) el.classList.add('completed');
            if (i + 1 === step) el.classList.add('active');
        });
        if (step === 2 && state.serviceId) this.initMastersGrid();
        if (step === 3) { 
            this.initCalendar(); 
            this.updateCalendarPricePreview();
        }
        if (step === 4) this.updateSummary();
    },

    updatePricePreview(displayElementId) {
        const priceDisplay = document.getElementById(displayElementId);
        if (!priceDisplay) return;
        const totalPrice = getTotalPrice();
        priceDisplay.textContent = `${totalPrice} ₽`;
        let tooltip = `${getServicePrice(state.serviceId)} ₽ (база)`;
        const masterSurcharge = getMasterSurcharge(state.masterId);
        if (masterSurcharge > 0) tooltip += ` + ${masterSurcharge} ₽ (уровень мастера)`;
        if (state.weekendSurcharge > 0) tooltip += ` + ${state.weekendSurcharge} ₽ (выходной)`;
        priceDisplay.title = tooltip;
    },

    updateCalendarPricePreview() {
        this.updatePricePreview('step-calendar-price-display');
    },

    async showNearestSlotsForMaster(masterId) {
        const slots = await loadNearestSlotsForMaster(masterId);
        const container = document.getElementById('step-nearest-slots-list');
        const slotsContainer = document.getElementById('step-master-slots-container');
        
        if (!container || !slotsContainer) return;
        
        if (slots.length > 0) {
            container.innerHTML = slots.map(slot => `
                <button class="slot-btn" data-date="${slot.date}" data-time="${slot.time}">
                    ${formatDateShort(slot.date)} ${slot.time}
                </button>
            `).join('');
            
            container.querySelectorAll('.slot-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    state.selectedDate = parseDate(btn.dataset.date);
                    state.selectedTime = btn.dataset.time;
                    StepMode.updateSummary();
                    StepMode.showStep(4);
                });
            });
            slotsContainer.style.display = 'block';
        } else {
            slotsContainer.style.display = 'none';
        }
        this.updatePricePreview('step-total-price-display');
    },

    initServicesGrid() {
        const grid = document.getElementById('step-services-grid');
        if (!grid) return;
        
        let services = getServicesList();
        if (state.context.section !== 'all') {
            services = services.filter(s => s.category === state.context.section);
        }
        if (state.context.presetMasterId) {
            const masterServices = getMasterServices(state.context.presetMasterId);
            services = services.filter(s => masterServices.includes(s.id));
        }
        
        grid.innerHTML = services.map(s => `
            <div class="booking-service" data-service-id="${s.id}">
                <div class="booking-service__info"><h4>${s.name}</h4><div>от ${s.basePrice}₽ • ${s.time}</div></div>
                <div class="booking-service__select"></div>
            </div>
        `).join('');
        
        grid.querySelectorAll('.booking-service').forEach(el => {
            el.addEventListener('click', () => {
                grid.querySelectorAll('.booking-service').forEach(s => s.classList.remove('selected'));
                el.classList.add('selected');
                state.serviceId = el.dataset.serviceId;
                this.updatePricePreview('step-total-price-display');
            });
        });
        
        if (state.context.presetServiceId) {
            const presetEl = document.querySelector(`.booking-service[data-service-id="${state.context.presetServiceId}"]`);
            if (presetEl) presetEl.click();
        }
    },

initMastersGrid() {
    const grid = document.getElementById('step-masters-grid');
    if (!grid) {
        return;
    }
    let masters = state.serviceId
        ? (mastersByService[state.serviceId] || []).map(id => MASTERS_DATA[id]).filter(Boolean)
        : Object.values(MASTERS_DATA).filter(m => m.category === state.context.section || state.context.section === 'all');
    grid.innerHTML = masters.map(m => `
        <div class="booking-master" data-master-id="${m.id}">
            <div class="booking-master__avatar"><img src="${m.image || 'assets/images/placeholder.jpg'}" alt="${m.name}"></div>
            <div class="booking-master__info">
                <h4>${m.name}</h4>
                <p>${m.specialty || 'мастер'}</p>
                <div>★★★★★ 5,0</div>
                <div class="master-slots-container" data-master="${m.id}" style="display: none; margin-top: 10px;">
                    <div class="slots-title">Ближайшие слоты:</div>
                    <div class="slots-buttons"></div>
                </div>
            </div>
            <div class="booking-master__select"></div>
        </div>
    `).join('');

    // Загружаем слоты для каждого мастера
    masters.forEach(async (master) => {
        const slotsContainer = document.querySelector(`.master-slots-container[data-master="${master.id}"]`);
        if (!slotsContainer) return;

        const slots = await loadNearestSlotsForMaster(master.id);
        const slotsButtons = slotsContainer.querySelector('.slots-buttons');

        if (slots && slots.length > 0) {
            slotsButtons.innerHTML = slots.map(slot => `
                <button class="slot-btn" data-date="${slot.date}" data-time="${slot.time}">
                    ${formatDateShort(slot.date)} ${slot.time}
                </button>
            `).join('');

            slotsButtons.querySelectorAll('.slot-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    state.masterId = master.id;
                    state.selectedDate = parseDate(btn.dataset.date);
                    state.selectedTime = btn.dataset.time;
                    StepMode.updateSummary();
                    StepMode.showStep(4);
                });
            });
            slotsContainer.style.display = 'block';
        }
    });
    grid.querySelectorAll('.booking-master').forEach(el => {
        el.addEventListener('click', () => {
            grid.querySelectorAll('.booking-master').forEach(m => m.classList.remove('selected'));
            el.classList.add('selected');
            state.masterId = el.dataset.masterId;
        });
    });

    if (state.context.presetMasterId) {
        const presetEl = document.querySelector(`.booking-master[data-master-id="${state.context.presetMasterId}"]`);
        if (presetEl) presetEl.click();
    }
},

    renderDays() {
        const daysGrid = document.getElementById('step-days-grid');
        if (!daysGrid) return;
        const monthSpan = document.getElementById('step-calendar-month');
        if (monthSpan) {
            monthSpan.textContent = `${monthNames[state.currentMonth.getMonth()]} ${state.currentMonth.getFullYear()}`;
        }
        const days = generateMonthDays(state.currentMonth);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        daysGrid.innerHTML = days.map(day => {
            if (day.isEmpty || !day.date) {
                return `<div class="time-calendar__day empty"></div>`;
            }
            const dayDate = new Date(day.date);
            dayDate.setHours(0, 0, 0, 0);
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
            const isPast = dayDate < today;
            const isSelected = state.selectedDate && formatDate(day.date) === formatDate(state.selectedDate);
            let classes = 'time-calendar__day';
            if (isSelected) classes += ' selected';
            if (isPast) classes += ' disabled';
            if (isWeekend) classes += ' weekend';
            return `<div class="${classes}" data-date="${formatDate(day.date)}">${day.date.getDate()}</div>`;
        }).join('');
        daysGrid.querySelectorAll('.time-calendar__day:not(.disabled)').forEach(el => {
            el.addEventListener('click', async () => {
                daysGrid.querySelectorAll('.time-calendar__day').forEach(d => d.classList.remove('selected'));
                el.classList.add('selected');
                const dateStr = el.dataset.date;
                const [day, month, year] = dateStr.split('.');
                state.selectedDate = new Date(year, month - 1, day);
                const masterName = MASTERS_DATA[state.masterId]?.name || state.masterId;
                await loadBusySlots(masterName, dateStr);
                this.renderSlots();
                const isWeekend = state.selectedDate.getDay() === 0 || state.selectedDate.getDay() === 6;
                state.weekendSurcharge = isWeekend ? 200 : 0;
                showWeekendNotice(isWeekend);
                this.updateCalendarPricePreview();
            });
        });
    },

    renderSlots() {
        const slotsGrid = document.getElementById('step-slots-grid');
        if (!slotsGrid) return;
        
        slotsGrid.innerHTML = TIME_SLOTS.map(slot => {
            const isDisabled = state.busySlots.has(slot);
            const isSelected = state.selectedTime === slot;
            
            let isInRange = false;
            if (state.selectedTime && !isSelected) {
                const [selectedHour, selectedMinute] = state.selectedTime.split(':').map(Number);
                const [currentHour, currentMinute] = slot.split(':').map(Number);
                const selectedMinutes = selectedHour * 60 + selectedMinute;
                const currentMinutes = currentHour * 60 + currentMinute;
                if (currentMinutes > selectedMinutes && currentMinutes <= selectedMinutes + 45) {
                    isInRange = true;
                }
            }
            
            let classes = 'time-calendar__slot';
            if (isSelected) classes += ' selected';
            if (isDisabled) classes += ' disabled';
            if (isInRange) classes += ' in-range';
            
            return `<div class="${classes}" data-time="${slot}">${slot}</div>`;
        }).join('');
        
        slotsGrid.querySelectorAll('.time-calendar__slot:not(.disabled)').forEach(el => {
            el.addEventListener('click', () => {
                slotsGrid.querySelectorAll('.time-calendar__slot').forEach(s => s.classList.remove('selected'));
                el.classList.add('selected');
                state.selectedTime = el.dataset.time;
                this.renderSlots();
                this.updateCalendarPricePreview();
            });
        });
    },

    initCalendar() {
        this.renderDays();
        this.renderSlots();
        const prevBtn = document.getElementById('step-calendar-prev');
        const nextBtn = document.getElementById('step-calendar-next');
        if (prevBtn) {
            prevBtn.replaceWith(prevBtn.cloneNode(true));
            document.getElementById('step-calendar-prev')?.addEventListener('click', () => {
                state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() - 1, 1);
                this.renderDays();
            });
        }
        if (nextBtn) {
            nextBtn.replaceWith(nextBtn.cloneNode(true));
            document.getElementById('step-calendar-next')?.addEventListener('click', () => {
                state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() + 1, 1);
                this.renderDays();
            });
        }
        this.updateCalendarPricePreview();
    },

    updateSummary() {
        const summary = document.getElementById('step-summary');
        if (!summary) return;
        const master = MASTERS_DATA[state.masterId];
        const serviceName = getServiceName(state.serviceId);
        const dateStr = state.selectedDate ? formatDate(state.selectedDate) : '—';
        summary.innerHTML = `
            <div><strong>Услуга:</strong> ${serviceName}</div>
            <div><strong>Мастер:</strong> ${master?.name || '—'}${master?.specialty ? ` (${master.specialty})` : ''}</div>
            <div><strong>Дата/время:</strong> ${dateStr} ${state.selectedTime || '—'}</div>
            <div><strong>Итого:</strong> ${getTotalPrice()}₽</div>
        `;
    },

    initPhoneMask() {
        const input = document.getElementById('step-phone');
        if (!input) return;
        input.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '');
            if (!v.length) return;
            if (v.length <= 1) v = '+7';
            else if (v.length <= 4) v = '+7 (' + v.substring(1, 4);
            else if (v.length <= 7) v = '+7 (' + v.substring(1, 4) + ') ' + v.substring(4, 7);
            else if (v.length <= 9) v = '+7 (' + v.substring(1, 4) + ') ' + v.substring(4, 7) + '-' + v.substring(7, 9);
            else v = '+7 (' + v.substring(1, 4) + ') ' + v.substring(4, 7) + '-' + v.substring(7, 9) + '-' + v.substring(9, 11);
            e.target.value = v;
        });
    },

    async submit() {
    console.log('🔴 StepMode.submit started');
    
    const nameInput = document.getElementById('step-name');
    const phoneInput = document.getElementById('step-phone');
    const emailInput = document.getElementById('step-email');
    const commentInput = document.getElementById('step-comment');
    
    const name = nameInput?.value || '';
    const phone = phoneInput?.value || '';
    const email = emailInput?.value || '';
    const comment = commentInput?.value || '';
    
    [nameInput, phoneInput, emailInput].forEach(input => {
        if (input) {
            input.classList.remove('error');
            const msg = input.parentNode?.querySelector('.error-message');
            if (msg) msg.remove();
        }
    });
    
    let isValid = true;
    
    if (!name || name.trim() === '') {
        if (nameInput) {
            nameInput.classList.add('error');
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.textContent = 'Введите имя';
            nameInput.parentNode.appendChild(errorSpan);
        }
        isValid = false;
    }
    
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phone || !phoneRegex.test(phone)) {
        if (phoneInput) {
            phoneInput.classList.add('error');
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.textContent = 'Введите номер в формате +7 (XXX) XXX-XX-XX';
            phoneInput.parentNode.appendChild(errorSpan);
        }
        isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        if (emailInput) {
            emailInput.classList.add('error');
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.textContent = 'Введите корректный email';
            emailInput.parentNode.appendChild(errorSpan);
        }
        isValid = false;
    }
    
    if (!state.serviceId) {
        alert('Выберите услугу');
        return;
    }
    if (!state.masterId) {
        alert('Выберите мастера');
        return;
    }
    if (!state.selectedDate || !state.selectedTime) {
        alert('Выберите дату и время');
        return;
    }
    
    if (!isValid) return;
    
    const master = MASTERS_DATA[state.masterId];
    const booking = {
        name: name.trim(),
        phone,
        email,
        service: getServiceName(state.serviceId),
        master: master?.name || state.masterId,
        masterLevel: master?.specialty || '',
        date: formatDate(state.selectedDate),
        time: state.selectedTime,
        price: getTotalPrice(),
        comment,
        createdAt: new Date().toISOString()
    };
    
    const btn = document.getElementById('step-submit');
    const original = btn?.textContent || 'Записаться';
    if (btn) {
        btn.textContent = 'Отправка...';
        btn.disabled = true;
    }
    
    try {
        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
        });
        const data = await res.json();
        
        if (data.success) {
            showNotification('✅ Запись сохранена!');
            setTimeout(() => {
                const modal = document.getElementById('modal-booking');
                if (modal) {
                    modal.classList.remove('modal-booking--active');
                    document.body.style.overflow = '';
                }
                StepMode.reset();
            }, 1500);
        } else if (data.error === 'Это время уже занято') {
            showNotification(' Это время уже занято. Выберите другое время.');
            const masterName = MASTERS_DATA[state.masterId]?.name || state.masterId;
            await loadBusySlots(masterName, formatDate(state.selectedDate));
            StepMode.renderSlots();
        } else {
            showNotification(data.error || 'Ошибка при сохранении');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('Ошибка соединения с сервером');
    } finally {
        if (btn) {
            btn.textContent = original;
            btn.disabled = false;
        }
    }
    },

    reset() {
        state.selectedDate = null;
        state.selectedTime = null;
        state.busySlots = new Set();
        state.weekendSurcharge = 0;
        state.currentMonth = new Date();
        state.email = null;
        ['name', 'phone', 'email', 'comment'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
        if (el) el.classList.remove('error');
        const msg = el?.parentNode?.querySelector('.error-message');
        if (msg) msg.remove();
    });
    },

    attachEvents() {
        document.querySelectorAll('.btn-next').forEach(btn => {
            btn.addEventListener('click', () => {
                if (StepMode.currentStep === 1 && !state.serviceId) { showNotification('Выберите услугу'); return; }
                if (StepMode.currentStep === 2 && !state.masterId) { showNotification('Выберите мастера'); return; }
                if (StepMode.currentStep === 3) {
                    if (!state.selectedDate || !state.selectedTime) { showNotification('Выберите дату и время'); return; }
                }
                let nextStep = parseFloat(btn.dataset.next);
                if (StepMode.currentStep === 1 && state.masterId) {
                    StepMode.showStep(2);
                    return;
                }
                StepMode.showStep(nextStep);
            });
        });

        document.querySelectorAll('.booking-step__back').forEach(btn => {
            btn.addEventListener('click', () => {
            const prevStep = parseFloat(btn.dataset.prev);
            if (prevStep === 1 && state.masterId && !state.serviceId) {
                StepMode.showStep(2);
                } else {
                    StepMode.showStep(prevStep);
                }
            });
        });
        
        document.querySelectorAll('.btn-prev').forEach(btn => {
            btn.addEventListener('click', () => {
                let prevStep = parseFloat(btn.dataset.prev);
                StepMode.showStep(prevStep);
            });
        });
        
        document.getElementById('step-time-next')?.addEventListener('click', () => {
            if (!state.selectedDate || !state.selectedTime) {
                showNotification('Выберите дату и время');
                return;
            }
            StepMode.showStep(4);
        });
        
        document.getElementById('step-submit')?.addEventListener('click', () => StepMode.submit());
        
        StepMode.initServicesGrid();
        StepMode.initPhoneMask();
        StepMode.showStep(1);
    }
};

export function initBookingForm() {
    const modal = document.getElementById('modal-booking');
    if (!modal) return;

    window.openBookingModal = (context = {}) => {
        console.log('openBookingModal called with:', context);
        
        state.context = { ...state.context, ...context };
        
        if (state.context.source === 'nav') {
            state.mode = 'full';
        } else {
            state.mode = 'step';
        }
        
        state.serviceId = state.context.presetServiceId || null;
        state.masterId = state.context.presetMasterId || null;
        state.busySlots = new Set();
        state.selectedDate = null;
        state.selectedTime = null;
        state.email = null;
        state.weekendSurcharge = 0;
        state.currentMonth = new Date();

        const modalBody = modal.querySelector('.modal-booking__body');
        modalBody.innerHTML = state.mode === 'full' ? Templates.full : Templates.step;

        const closeBtn = document.getElementById('modal-close');
        if (closeBtn) closeBtn.addEventListener('click', () => {
            modal.classList.remove('modal-booking--active');
            document.body.style.overflow = '';
        });

        if (state.mode === 'full') FullMode.attachEvents();
        else StepMode.attachEvents();

        modal.classList.add('modal-booking--active');
        document.body.style.overflow = 'hidden';
    };

    const overlay = modal.querySelector('.modal-booking__overlay');
    if (overlay) overlay.addEventListener('click', () => {
        modal.classList.remove('modal-booking--active');
        document.body.style.overflow = '';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-booking--active')) {
            modal.classList.remove('modal-booking--active');
            document.body.style.overflow = '';
        }
    });

    attachGlobalButtons();
}

function attachGlobalButtons() {
    const selectors = '[data-modal-open], .team-card__book, .price__book, .hero__actions .btn--primary, .nav__link--primary';
    document.querySelectorAll(selectors).forEach(btn => {
        btn.removeEventListener('click', handleGlobalClick);
        btn.addEventListener('click', handleGlobalClick);
    });
}

function handleGlobalClick(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    
    let source = 'hero';
    if (btn.classList.contains('nav__link--primary')) {
        source = 'nav';
    } else if (btn.classList.contains('price__book')) {
        source = 'price';
    }
    
    window.openBookingModal({
        presetMasterId: btn.getAttribute('data-master-id'),
        presetServiceId: btn.getAttribute('data-service-id'),
        section: btn.getAttribute('data-section') || 'all',
        source: source
    });
}
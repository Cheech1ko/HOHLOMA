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
        
        // Находим начальную минуту слота (0, 15, 30, 45)
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

function generateMonthDays(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startOffset = firstDay.getDay() - 1;
    if (startOffset === -1) startOffset = 6;
    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
        days.push({ date: new Date(year, month - 1, prevMonthLastDay - i), isCurrentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
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
                <div class="booking-footer__powered">Онлайн-запись: программа Арника</div>
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
        <div class="booking-step" data-step="1"><h3>Выберите услугу</h3><div class="booking-services__grid" id="step-services-grid"></div><div class="booking-step__actions"><button class="btn btn--primary btn-next" data-next="2">Далее</button></div></div>
        <div class="booking-step" data-step="2" style="display:none;"><h3>Выберите мастера</h3><div class="booking-masters__grid" id="step-masters-grid"></div><div class="booking-step__actions"><button class="btn btn--outline btn-prev" data-prev="1">Назад</button><button class="btn btn--primary btn-next" data-next="3">Далее</button></div></div>
        <div class="booking-step" data-step="3" style="display:none;">
            <h3>Выберите дату и время</h3>
            <div class="time-calendar">
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
            <div class="booking-step__actions">
                <button class="btn btn--outline btn-prev" data-prev="2">Назад</button>
                <button class="btn btn--primary" id="step-time-next">Далее</button>
            </div>
        </div>
        <div class="booking-step" data-step="4" style="display:none;"><h3>Ваши данные</h3><div class="booking-summary" id="step-summary"></div><div class="form-row"><div class="form-group"><label>Имя</label><input type="text" id="step-name" class="form-input" placeholder="Имя"></div><div class="form-group"><label>Телефон</label><input type="tel" id="step-phone" class="form-input" placeholder="+7 (___) ___-__-__"></div></div><div class="form-group"><label>Комментарий</label><textarea id="step-comment" class="form-textarea" rows="3"></textarea></div><div class="form-group--policy"><input type="checkbox" id="step-policy" checked><label>Я согласен на обработку персональных данных</label></div><div class="booking-step__actions"><button class="btn btn--outline btn-prev" data-prev="3">Назад</button><button class="btn btn--primary" id="step-submit">Записаться</button></div></div>
    `
};

const FullMode = {
    showScreen(screen) {
        ['start', 'service', 'master', 'time', 'client'].forEach(s => {
            const el = document.getElementById(`full-${s}`);
            if (el) el.style.display = s === screen ? 'block' : 'none';
        });
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
        let masters = state.serviceId
            ? (mastersByService[state.serviceId] || []).map(id => MASTERS_DATA[id]).filter(Boolean)
            : Object.values(MASTERS_DATA).filter(m => m.category === state.context.section || state.context.section === 'all');
        this.renderMasters(masters);
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
            });
        });
    },

renderSlots() {
    const slotsGrid = document.getElementById('full-slots-grid');
    if (!slotsGrid) return;
    
    slotsGrid.innerHTML = TIME_SLOTS.map(slot => {
        const isDisabled = state.busySlots.has(slot);
        const isSelected = state.selectedTime === slot;
        
        // Проверяем, попадает ли слот в диапазон выбранного времени + 45 минут
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
        const comment = document.getElementById('comment')?.value || '';
        if (!name || !phone || !state.serviceId || !state.masterId || !state.selectedDate || !state.selectedTime) {
            showNotification('Заполните все поля');
            return;
        }
        if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone)) {
            showNotification('Введите корректный номер телефона');
            return;
        }
        const master = MASTERS_DATA[state.masterId];
        const booking = {
            name, phone, service: getServiceName(state.serviceId), master: master?.name || state.masterId,
            masterLevel: master?.specialty || '', date: formatDate(state.selectedDate), time: state.selectedTime,
            price: getTotalPrice(), comment, createdAt: new Date().toISOString()
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
        ['name', 'phone', 'comment'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
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
        document.querySelectorAll('.booking-step').forEach(el => el.style.display = el.dataset.step == step ? 'block' : 'none');
        document.querySelectorAll('.booking-steps__step').forEach((el, i) => {
            el.classList.remove('active', 'completed');
            if (i + 1 < step) el.classList.add('completed');
            if (i + 1 === step) el.classList.add('active');
        });
        if (step === 2 && state.serviceId) this.initMastersGrid();
        if (step === 3) this.initTimeCalendar();
        if (step === 4) this.updateSummary();
    },

    initServicesGrid() {
        const grid = document.getElementById('step-services-grid');
        if (!grid) return;
        
        let services = getServicesList();
        
        // Фильтруем по секции
        if (state.context.section !== 'all') {
            services = services.filter(s => s.category === state.context.section);
        }
        
        // Если есть предустановленный мастер — показываем только его услуги
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
            });
        });
        
        // Если есть предустановленная услуга — выбираем её
        if (state.context.presetServiceId) {
            const presetEl = document.querySelector(`.booking-service[data-service-id="${state.context.presetServiceId}"]`);
            if (presetEl) {
                presetEl.click();
            }
        }
    },

    initMastersGrid() {
        const grid = document.getElementById('step-masters-grid');
        if (!grid) return;
        
        let masters = state.serviceId
            ? (mastersByService[state.serviceId] || []).map(id => MASTERS_DATA[id]).filter(Boolean)
            : Object.values(MASTERS_DATA).filter(m => m.category === state.context.section || state.context.section === 'all');
        
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
            });
        });
        
        // Если есть предустановленный мастер — выбираем его
        if (state.context.presetMasterId) {
    setTimeout(() => {
        const presetEl = document.querySelector(`.booking-master[data-master-id="${state.context.presetMasterId}"]`);
        if (presetEl) {
            presetEl.click();
            // Переходим к следующему шагу
            setTimeout(() => {
                const nextBtn = document.querySelector('.btn-next[data-next="3"]');
                if (nextBtn) nextBtn.click();
            }, 200);
        }
    }, 100);
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
        });
    });
},

    initTimeCalendar() {
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
        const name = document.getElementById('step-name')?.value;
        const phone = document.getElementById('step-phone')?.value;
        const comment = document.getElementById('step-comment')?.value || '';
        if (!name || !phone || !state.serviceId || !state.masterId || !state.selectedDate || !state.selectedTime) {
            showNotification('Заполните все поля');
            return;
        }
        if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone)) {
            showNotification('Введите корректный номер телефона');
            return;
        }
        const master = MASTERS_DATA[state.masterId];
        const booking = {
            name, phone, service: getServiceName(state.serviceId), master: master?.name || state.masterId,
            masterLevel: master?.specialty || '', date: formatDate(state.selectedDate), time: state.selectedTime,
            price: getTotalPrice(), comment, createdAt: new Date().toISOString()
        };
        const btn = document.getElementById('step-submit');
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
        ['step-name', 'step-phone', 'step-comment'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
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
                if (StepMode.currentStep === 1 && state.masterId) {
                    StepMode.showStep(3);
                    return;
                }
                if (StepMode.currentStep === 2 && state.serviceId) {
                    StepMode.showStep(3);
                    return;
                }
                StepMode.showStep(StepMode.currentStep + 1);
            });
        });
        document.querySelectorAll('.btn-prev').forEach(btn => {
            btn.addEventListener('click', () => StepMode.showStep(StepMode.currentStep - 1));
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
        
        // Определяем режим
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
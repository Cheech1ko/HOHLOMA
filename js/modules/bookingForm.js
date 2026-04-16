import { getMastersByService, MASTERS_DATA } from './mastersData.js';

let state = {
    serviceId: null,
    masterId: null,
    weekendSurcharge: 0,
    busySlots: [],
    mode: 'full',
    context: { presetMasterId: null, presetServiceId: null, section: 'all', source: 'nav' }
};

const API_URL = 'https://hohloma-backend.onrender.com/api';
const TIME_SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

const mastersByService = {
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
    
    // Барбершоп (базовые)
    'barber-haircut-men': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber', 'maxim-barber', 'arianna-barber'],
    'barber-haircut-kids': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber'],
    'barber-beard-modeling': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber'],
    'barber-beard-care': ['vladimir-barber', 'kirill-barber', 'evgeniy-barber'],
    'barber-shave-classic': ['vladimir-barber', 'kirill-barber', 'arianna-barber'],
    'barber-shave-razor': ['vladimir-barber', 'kirill-barber', 'arianna-barber'],
    
    // Барбершоп (дополнительные)
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

async function loadBusySlots(masterId, date) {
    try {
        const res = await fetch(`${API_URL}/bookings/check?master=${encodeURIComponent(masterId)}&date=${encodeURIComponent(date)}`);
        const data = await res.json();
        state.busySlots = Array.isArray(data.times) ? data.times : [];
        console.log(` Загружены занятые слоты для ${masterId} на ${date}:`, state.busySlots);
    } catch (error) {
        console.error(' Ошибка загрузки слотов:', error);
        state.busySlots = [];
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

function showWeekendNotice(show) {
    let notice = document.querySelector('.weekend-notice');
    if (show && !notice) {
        const dateField = document.getElementById('date') || document.getElementById('step-date');
        if (dateField?.parentNode) {
            notice = document.createElement('div');
            notice.className = 'weekend-notice';
            notice.innerHTML = '💰 В выходные и праздничные дни наценка +200₽';
            dateField.parentNode.appendChild(notice);
        }
    }
    if (notice) {
        notice.style.display = show ? 'block' : 'none';
    }
}

function showNotification(message) {
    const modal = document.getElementById('notification-modal');
    if (!modal) return;
    const msgEl = modal.querySelector('.modal__message');
    if (msgEl) msgEl.textContent = message;
    modal.classList.add('modal--active');
    setTimeout(() => modal.classList.remove('modal--active'), 5000);
}

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
            <div class="form-row">
                <div class="form-group"><label>Дата</label><input type="text" id="date" class="form-input" placeholder="ДД.ММ.ГГГГ" readonly></div>
                <div class="form-group"><label>Время</label><select id="time" class="form-select" disabled><option value="">— Выберите время —</option></select></div>
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
        <div class="booking-step" data-step="3" style="display:none;"><h3>Выберите дату и время</h3><div class="form-row"><div class="form-group"><label>Дата</label><input type="text" id="step-date" class="form-input" placeholder="ДД.ММ.ГГГГ" readonly></div><div class="form-group"><label>Время</label><select id="step-time" class="form-select" disabled><option value="">— Выберите время —</option></select></div></div><div class="booking-step__actions"><button class="btn btn--outline btn-prev" data-prev="2">Назад</button><button class="btn btn--primary btn-next" data-next="4">Далее</button></div></div>
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

    initCalendar() {
        const input = document.getElementById('date');
        if (!input || typeof flatpickr === 'undefined') return;


        if (input._flatpickr) {
            input._flatpickr.destroy();
        }


        input.value = '';
        input.removeAttribute('value');

        const today = new Date();
        today.setHours(0, 0, 0, 0);


        const fp = flatpickr(input, {
            locale: 'ru',
            minDate: 'today',
            dateFormat: 'd.m.Y',
            defaultDate: null,
            disable: [
                function(date) {
                    return date < today;
                }
            ],
            onChange: async (selectedDates, dateStr) => {
                if (selectedDates && selectedDates.length === 1 && dateStr && state.masterId && state.masterId !== 'any') {
                    await loadBusySlots(state.masterId, dateStr);
                    const timeSelect = document.getElementById('time');
                    if (timeSelect) timeSelect.disabled = false;
                    await FullMode.refreshTimeSlots();
                    const isWeekend = selectedDates[0].getDay() === 0 || selectedDates[0].getDay() === 6;
                    state.weekendSurcharge = isWeekend ? 200 : 0;
                    showWeekendNotice(isWeekend);
                }
            },
            onReady: function(selectedDates, dateStr, instance) {

                instance.clear();
                input.value = '';
            },
            onOpen: function(selectedDates, dateStr, instance) {

                instance.clear();
                input.value = '';
            }
        });
    },

    initTimeSlots() {
        const select = document.getElementById('time');
        if (!select) return;
        select.innerHTML = '<option value="">— Выберите время —</option>';
        TIME_SLOTS.forEach(slot => {
            const opt = document.createElement('option');
            opt.value = slot;
            opt.textContent = slot;
            select.appendChild(opt);
        });
    },

async refreshTimeSlots() {
    const select = document.getElementById('time');
    const date = document.getElementById('date')?.value;
    if (!select || !date || !state.masterId || state.masterId === 'any') return;
    
    console.log(' Запрашиваем занятые слоты для:', state.masterId, date);
    await loadBusySlots(state.masterId, date);
    console.log(' Занятые слоты после загрузки:', state.busySlots);
    
    select.innerHTML = '<option value="">— Выберите время —</option>';
    TIME_SLOTS.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        if (state.busySlots.includes(slot)) {
            option.disabled = true;
            option.style.cssText = 'color:#999;text-decoration:line-through';
        }
        select.appendChild(option);
    });
    },

    updateSummary() {
        const summary = document.getElementById('summary');
        if (!summary) return;
        const master = MASTERS_DATA[state.masterId];
        summary.innerHTML = `
            <div><strong>Услуга:</strong> ${getServiceName(state.serviceId)}</div>
            <div><strong>Мастер:</strong> ${master?.name || '—'}${master?.specialty ? ` (${master.specialty})` : ''}</div>
            <div><strong>Дата/время:</strong> ${document.getElementById('date')?.value || '—'} ${document.getElementById('time')?.value || '—'}</div>
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
        const date = document.getElementById('date')?.value;
        const time = document.getElementById('time')?.value;
        const comment = document.getElementById('comment')?.value || '';
        if (!name || !phone || !state.serviceId || !state.masterId || !date || !time) {
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
            masterLevel: master?.specialty || '', date, time, price: getTotalPrice(), comment,
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
                await FullMode.refreshTimeSlots();
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
        ['name', 'phone', 'comment', 'date'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const timeSelect = document.getElementById('time');
        if (timeSelect) timeSelect.disabled = true;
    },

    attachEvents() {
    // Кнопки выбора на стартовом экране
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

    // Кнопка «Далее» на стартовом экране
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

        // СЛУЧАЙ 1: выбран мастер → показываем его услуги
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

        // СЛУЧАЙ 2: выбрана услуга → показываем мастеров
        if (state.serviceId && !state.masterId) {
            this.initMastersGrid();
            this.showScreen('master');
            return;
        }

        // СЛУЧАЙ 3: выбрано и то, и то → время
        if (state.serviceId && state.masterId) {
            this.showScreen('time');
        }
    });

    // Кнопка «Далее» на экране услуг
    document.getElementById('service-next')?.addEventListener('click', () => {
        if (!state.serviceId) {
            showNotification('Выберите услугу');
            return;
        }
        // После выбора услуги идём ко времени
        this.showScreen('time');
    });

    // Кнопка «Далее» на экране мастеров
    document.getElementById('master-next')?.addEventListener('click', () => {
        if (!state.masterId) {
            showNotification('Выберите мастера');
            return;
        }
        // Показываем услуги выбранного мастера
        const servicesForMaster = getMasterServices(state.masterId);
        if (servicesForMaster.length) {
            const allServices = getServicesList();
            const filtered = allServices.filter(s => servicesForMaster.includes(s.id));
            this.renderServices(filtered);
            this.showScreen('service');
        } else {
            showNotification('У этого мастера нет услуг');
        }
    });

    // Кнопка «Далее» на экране времени
    document.getElementById('time-next')?.addEventListener('click', () => {
        const date = document.getElementById('date')?.value;
        const time = document.getElementById('time')?.value;
        if (!date || !time) {
            showNotification('Выберите дату и время');
            return;
        }
        this.updateSummary();
        this.showScreen('client');
    });

    // Отправка формы
    document.getElementById('submit-booking')?.addEventListener('click', () => this.submit());

    // Кнопки «Назад»
    document.querySelectorAll('[data-back]').forEach(btn => {
        btn.addEventListener('click', () => this.showScreen(btn.dataset.back));
    });

    // Инициализация
    this.initServicesGrid();
    this.initMastersGrid();
    this.initCalendar();
    this.initTimeSlots();
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
        if (step === 3) { this.initCalendar(); this.initTimeSlots(); }
        if (step === 4) this.updateSummary();
    },

    initServicesGrid() {
        const grid = document.getElementById('step-services-grid');
        if (!grid) return;
        let services = getServicesList();
        if (state.context.section !== 'all') services = services.filter(s => s.category === state.context.section);
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
    },

    initCalendar() {
    const input = document.getElementById('step-date');
    if (!input || typeof flatpickr === 'undefined') return;
    
    if (input._flatpickr) {
        input._flatpickr.destroy();
    }
    
    input.value = '';
    input.removeAttribute('value');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    flatpickr(input, {
        locale: 'ru',
        minDate: 'today',
        dateFormat: 'd.m.Y',
        defaultDate: null,
        disable: [date => date < today],
        onChange: async (selectedDates, dateStr, instance) => {
            if (selectedDates && selectedDates.length === 1 && dateStr && state.masterId) {
                await loadBusySlots(state.masterId, dateStr);
                const timeSelect = document.getElementById('step-time');
                if (timeSelect) {
                    timeSelect.disabled = false;
                }
                await StepMode.refreshTimeSlots();
                const isWeekend = selectedDates[0].getDay() === 0 || selectedDates[0].getDay() === 6;
                state.weekendSurcharge = isWeekend ? 200 : 0;
                showWeekendNotice(isWeekend);
            }
        },
        onReady: function(selectedDates, dateStr, instance) {
            instance.clear();
            input.value = '';
        },
        onOpen: function(selectedDates, dateStr, instance) {
            instance.clear();
            input.value = '';
        }
    });
    },

    initTimeSlots() {
        const select = document.getElementById('step-time');
        if (!select) return;
        select.innerHTML = '<option value="">— Выберите время —</option>';
        TIME_SLOTS.forEach(slot => {
            const opt = document.createElement('option');
            opt.value = slot;
            opt.textContent = slot;
            select.appendChild(opt);
        });
    },

async refreshTimeSlots() {
    const select = document.getElementById('step-time');
    const date = document.getElementById('step-date')?.value;
    if (!select || !date || !state.masterId) return;
    
    await loadBusySlots(state.masterId, date);
    console.log('Занятые слоты (step):', state.busySlots);
    
    select.innerHTML = '<option value="">— Выберите время —</option>';
    TIME_SLOTS.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        if (state.busySlots.includes(slot)) {
            option.disabled = true;
            option.style.cssText = 'color:#999;text-decoration:line-through';
        }
        select.appendChild(option);
    });
    },

    updateSummary() {
        const summary = document.getElementById('step-summary');
        if (!summary) return;
        const master = MASTERS_DATA[state.masterId];
        summary.innerHTML = `
            <div><strong>Услуга:</strong> ${getServiceName(state.serviceId)}</div>
            <div><strong>Мастер:</strong> ${master?.name || '—'}${master?.specialty ? ` (${master.specialty})` : ''}</div>
            <div><strong>Дата/время:</strong> ${document.getElementById('step-date')?.value || '—'} ${document.getElementById('step-time')?.value || '—'}</div>
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
        const date = document.getElementById('step-date')?.value;
        const time = document.getElementById('step-time')?.value;
        const comment = document.getElementById('step-comment')?.value || '';
        if (!name || !phone || !state.serviceId || !state.masterId || !date || !time) {
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
            masterLevel: master?.specialty || '', date, time, price: getTotalPrice(), comment,
            createdAt: new Date().toISOString()
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
                await StepMode.refreshTimeSlots();
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
        ['step-name', 'step-phone', 'step-comment', 'step-date'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const timeSelect = document.getElementById('step-time');
        if (timeSelect) timeSelect.disabled = true;
    },

    attachEvents() {
        document.querySelectorAll('.btn-next').forEach(btn => {
            btn.addEventListener('click', () => {
                if (StepMode.currentStep === 1 && !state.serviceId) { showNotification('Выберите услугу'); return; }
                if (StepMode.currentStep === 2 && !state.masterId) { showNotification('Выберите мастера'); return; }
                if (StepMode.currentStep === 3) {
                    const date = document.getElementById('step-date')?.value;
                    const time = document.getElementById('step-time')?.value;
                    if (!date || !time) { showNotification('Выберите дату и время'); return; }
                }
                StepMode.showStep(StepMode.currentStep + 1);
            });
        });
        document.querySelectorAll('.btn-prev').forEach(btn => {
            btn.addEventListener('click', () => StepMode.showStep(StepMode.currentStep - 1));
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
        state.context = { ...state.context, ...context };
        state.mode = state.context.source === 'nav' ? 'full' : 'step';
        state.serviceId = state.context.presetServiceId || null;
        state.masterId = state.context.presetMasterId || null;
        state.busySlots = [];
        state.weekendSurcharge = 0;

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
    window.openBookingModal({
        masterId: btn.getAttribute('data-master-id'),
        serviceId: btn.getAttribute('data-service-id'),
        section: btn.getAttribute('data-section') || 'all',
        source: btn.classList.contains('nav__link--primary') ? 'nav' : 'hero'
    });
}
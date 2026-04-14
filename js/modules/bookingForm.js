import { getMastersByService, MASTERS_DATA } from './mastersData.js';

let currentStep = 1;
let selectedServiceId = null;
let selectedMasterId = null;
let weekendSurcharge = 0;
let currentContext = { presetMasterId: null, presetServiceId: null, source: null };

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
    'barber-shave-razor': ['vladimir-barber', 'kirill-barber', 'arianna-barber']
};

function getServicesList() {
    return [
        // БАРБЕРШОП
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
        
        // ТАТУ
        { id: 'tattoo-individual', name: 'Татуировка (индивидуальный эскиз)', basePrice: 4000, time: '2 часа', category: 'tattoo' },
        { id: 'tattoo-catalog', name: 'Татуировка (из каталога)', basePrice: 4000, time: '2 часа', category: 'tattoo' },
        { id: 'tattoo-cover', name: 'Перекрытие/исправление тату', basePrice: 8000, time: '3 часа', category: 'tattoo' },
        
        // ПИРСИНГ
        { id: 'piercing-ear', name: 'Пирсинг уха', basePrice: 1000, time: '30 мин', category: 'piercing' },
        { id: 'piercing-nose', name: 'Пирсинг носа', basePrice: 1500, time: '30 мин', category: 'piercing' },
        { id: 'piercing-lip', name: 'Пирсинг губы', basePrice: 1500, time: '30 мин', category: 'piercing' },
        { id: 'piercing-navel', name: 'Пирсинг пупка', basePrice: 2000, time: '30 мин', category: 'piercing' },
        
        // МАССАЖ
        { id: 'massage-classic', name: 'Классический массаж', basePrice: 2000, time: '60 мин', category: 'massage' },
        { id: 'massage-sport', name: 'Спортивный массаж', basePrice: 2500, time: '60 мин', category: 'massage' },
        { id: 'massage-anticellulite', name: 'Антицеллюлитный массаж', basePrice: 2200, time: '60 мин', category: 'massage' }
    ];
}

function getBasePrice(serviceId) {
    const services = getServicesList();
    const service = services.find(s => s.id === serviceId);
    return service ? service.basePrice : 0;
}

function getMasterSurcharge(masterId) {
    const master = MASTERS_DATA[masterId];
    if (!master) return 0;
    if (master.id === 'vladimir-barber' || master.id === 'kirill-barber') return 400;
    if (master.id === 'evgeniy-barber') return 200;
    return 0;
}

function getTotalPrice(serviceId, masterId, weekend = false) {
    const basePrice = getBasePrice(serviceId);
    const masterSurcharge = getMasterSurcharge(masterId);
    const weekendSurchargeValue = weekend ? 200 : 0;
    return basePrice + masterSurcharge + weekendSurchargeValue;
}

function getServiceName(serviceId) {
    const services = getServicesList();
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
}

export function initBookingForm() {
    console.log('Initializing booking form...');
    
    const modal = document.getElementById('modal-booking');
    const modalClose = document.getElementById('modal-booking-close');
    const modalOverlay = modal?.querySelector('.modal-booking__overlay');
    const modalBody = document.querySelector('.modal-booking__body');
    
    if (!modal) return;
    
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="booking-steps">
                <div class="booking-steps__nav">
                    <div class="booking-steps__step" data-step="1">
                        <span class="booking-steps__number">1</span>
                        <span class="booking-steps__label">Услуги</span>
                    </div>
                    <div class="booking-steps__step" data-step="2">
                        <span class="booking-steps__number">2</span>
                        <span class="booking-steps__label">Мастер</span>
                    </div>
                    <div class="booking-steps__step" data-step="3">
                        <span class="booking-steps__number">3</span>
                        <span class="booking-steps__label">Время</span>
                    </div>
                    <div class="booking-steps__step" data-step="4">
                        <span class="booking-steps__number">4</span>
                        <span class="booking-steps__label">Данные</span>
                    </div>
                </div>
                
                <form id="booking-form">
                    <div class="booking-step" data-step="1">
                        <h3 class="booking-step__title">Выберите услугу</h3>
                        <div class="booking-services__grid" id="services-grid"></div>
                        <div class="booking-step__actions">
                            <button type="button" class="btn btn--primary btn-next" data-next="2">Далее</button>
                        </div>
                    </div>
                    
                    <div class="booking-step" data-step="2" style="display: none;">
                        <h3 class="booking-step__title">Выберите мастера</h3>
                        <div class="booking-masters__grid" id="masters-grid"></div>
                        <div class="booking-step__actions">
                            <button type="button" class="btn btn--outline btn-prev" data-prev="1">Назад</button>
                            <button type="button" class="btn btn--primary btn-next" data-next="3">Далее</button>
                        </div>
                    </div>
                    
                    <div class="booking-step" data-step="3" style="display: none;">
                        <h3 class="booking-step__title">Выберите дату и время</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Дата *</label>
                                <input type="text" id="date" name="date" class="form-input" placeholder="ДД.ММ.ГГГГ" required readonly>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Время *</label>
                                <select id="time" name="time" class="form-select" required disabled>
                                    <option value="">— Сначала выберите дату —</option>
                                </select>
                            </div>
                        </div>
                        <div class="booking-step__actions">
                            <button type="button" class="btn btn--outline btn-prev" data-prev="2">Назад</button>
                            <button type="button" class="btn btn--primary btn-next" data-next="4">Далее</button>
                        </div>
                    </div>
                    
                    <div class="booking-step" data-step="4" style="display: none;">
                        <h3 class="booking-step__title">Ваши данные</h3>
                        <div class="booking-summary" id="booking-summary"></div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Ваше имя *</label>
                                <input type="text" id="name" name="name" class="form-input" placeholder="Имя" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Телефон *</label>
                                <input type="tel" id="phone" name="phone" class="form-input" placeholder="+7 (___) ___-__-__" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Комментарий (опционально)</label>
                            <textarea name="comment" class="form-textarea" rows="3" placeholder="Дополнительная информация..."></textarea>
                        </div>
                        <div class="form-group form-group--policy">
                            <input type="checkbox" id="policy" name="policy" required checked>
                            <label for="policy">Я согласен на обработку персональных данных</label>
                        </div>
                        <div class="booking-step__actions">
                            <button type="button" class="btn btn--outline btn-prev" data-prev="3">Назад</button>
                            <button type="submit" class="btn btn--primary">Записаться</button>
                        </div>
                    </div>
                </form>
            </div>
        `;
    }
    
    // initServicesGrid(currentContext.section);
    initStepNavigation();
    initPhoneMask();
    
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) bookingForm.addEventListener('submit', handleFormSubmit);
    
    attachBookingButtons();
    
window.openBookingModal = function(context = {}) {
    console.log('📌 openBookingModal вызван с контекстом:', context);
    
    currentContext = {
        presetMasterId: context.masterId || null,
        presetServiceId: context.serviceId || null,
        source: context.source || null,
        section: context.section || 'all'
    };
    
    // 👇 ВОТ ЭТО ВАЖНО — обновляем услуги при открытии
    initServicesGrid(currentContext.section);
    
    modal.classList.add('modal-booking--active');
    document.body.style.overflow = 'hidden';
    
    if (currentContext.presetMasterId) {
        setTimeout(() => applyPresetContext(), 100);
    }
};
    
    if (modalClose) modalClose.addEventListener('click', () => {
        modal.classList.remove('modal-booking--active');
        document.body.style.overflow = '';
        resetForm();
    });
    
    if (modalOverlay) modalOverlay.addEventListener('click', () => {
        modal.classList.remove('modal-booking--active');
        document.body.style.overflow = '';
        resetForm();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-booking--active')) {
            modal.classList.remove('modal-booking--active');
            document.body.style.overflow = '';
            resetForm();
        }
    });
}

function initServicesGrid(section = 'all') {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;
    
    const services = getServicesList();
    
    let filteredServices = services;
    if (section !== 'all') {
        filteredServices = services.filter(s => s.category === section);
    }
    
    console.log(`📋 Отображаем услуги для секции: ${section}`, filteredServices);
    
    servicesGrid.innerHTML = filteredServices.map(s => `
        <div class="booking-service" data-service-id="${s.id}" data-category="${s.category}">
            <div class="booking-service__info">
                <h4 class="booking-service__name">${s.name}</h4>
                <div class="booking-service__meta">
                    <span class="booking-service__price">от ${s.basePrice}₽</span>
                    <span class="booking-service__time">⏱ ${s.time}</span>
                </div>
            </div>
            <div class="booking-service__select"><span class="booking-service__radio"></span></div>
        </div>
    `).join('');
    
    document.querySelectorAll('.booking-service').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.booking-service').forEach(s => s.classList.remove('selected'));
            el.classList.add('selected');
            selectedServiceId = el.dataset.serviceId;
        });
    });
}

function loadMastersForService(serviceId) {
    const mastersGrid = document.getElementById('masters-grid');
    if (!mastersGrid) return;
    
    const masterIds = mastersByService[serviceId] || [];
    const masters = masterIds.map(id => MASTERS_DATA[id]).filter(m => m);
    
    mastersGrid.innerHTML = masters.map(master => `
        <div class="booking-master" data-master-id="${master.id}">
            <div class="booking-master__avatar">
                <img src="${master.image || 'assets/images/placeholder.jpg'}" alt="${master.name}">
            </div>
            <div class="booking-master__info">
                <h4 class="booking-master__name">${master.name}</h4>
                <p class="booking-master__specialty">${master.specialty || 'мастер'}</p>
                <div class="booking-master__rating">
                    <span class="booking-master__stars">★★★★★</span>
                    <span class="booking-master__reviews">5,0</span>
                </div>
            </div>
            <div class="booking-master__select"><span class="booking-master__radio"></span></div>
        </div>
    `).join('');
    
    document.querySelectorAll('.booking-master').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.booking-master').forEach(m => m.classList.remove('selected'));
            el.classList.add('selected');
            selectedMasterId = el.dataset.masterId;
        });
    });
}

function initStepNavigation() {
    const stepContents = document.querySelectorAll('.booking-step');
    
    function showStep(stepNumber) {
        stepContents.forEach(content => {
            content.style.display = content.dataset.step == stepNumber ? 'block' : 'none';
        });
        
        document.querySelectorAll('.booking-steps__step').forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            if (stepNum < stepNumber) step.classList.add('completed');
            if (stepNum === stepNumber) step.classList.add('active');
        });
        
        currentStep = stepNumber;
        
        if (stepNumber === 2 && selectedServiceId) loadMastersForService(selectedServiceId);
        if (stepNumber === 3) { initCalendar(); initTimeSlots(); }
        if (stepNumber === 4) updateBookingSummary();
    }
    
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.dataset.next);
            if (currentStep === 1 && !selectedServiceId) { showNotification('Выберите услугу', 'error'); return; }
            if (currentStep === 2 && !selectedMasterId) { showNotification('Выберите мастера', 'error'); return; }
            if (currentStep === 3) {
                const date = document.getElementById('date')?.value;
                const time = document.getElementById('time')?.value;
                if (!date || !time) { showNotification('Выберите дату и время', 'error'); return; }
            }
            showStep(nextStep);
        });
    });
    
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => showStep(parseInt(btn.dataset.prev)));
    });
    
    showStep(1);
}

function updateBookingSummary() {
    const summary = document.getElementById('booking-summary');
    if (!summary) return;
    
    const serviceName = getServiceName(selectedServiceId);
    const basePrice = getBasePrice(selectedServiceId);
    const masterSurcharge = getMasterSurcharge(selectedMasterId);
    const master = MASTERS_DATA[selectedMasterId];
    const masterName = master?.name || '—';
    const date = document.getElementById('date')?.value || '—';
    const time = document.getElementById('time')?.value || '—';
    
    const totalPrice = basePrice + masterSurcharge + weekendSurcharge;
    
    let priceHtml = `${basePrice}₽`;
    if (masterSurcharge > 0) {
        priceHtml = `${basePrice}₽ + ${masterSurcharge}₽ (${master?.specialty || 'профи'})`;
    }
    if (weekendSurcharge > 0) {
        priceHtml += ` + 200₽ (выходной)`;
    }
    
    summary.innerHTML = `
        <div class="booking-summary__item">
            <span class="booking-summary__label">Услуга:</span>
            <span class="booking-summary__value">${serviceName}</span>
        </div>
        <div class="booking-summary__item">
            <span class="booking-summary__label">Мастер:</span>
            <span class="booking-summary__value">${masterName}${master?.specialty ? ` (${master.specialty})` : ''}</span>
        </div>
        <div class="booking-summary__item">
            <span class="booking-summary__label">Дата и время:</span>
            <span class="booking-summary__value">${date} ${time}</span>
        </div>
        <div class="booking-summary__item booking-summary__total">
            <span class="booking-summary__label">Итого:</span>
            <span class="booking-summary__value">${totalPrice}₽</span>
        </div>
        <div class="booking-summary__detail">
            <small>${priceHtml}</small>
        </div>
    `;
}

function initCalendar() {
    const dateInput = document.getElementById('date');
    if (!dateInput || typeof flatpickr === 'undefined') return;
    if (dateInput._flatpickr) dateInput._flatpickr.destroy();
    
    const today = new Date(); today.setHours(0, 0, 0, 0);
    
    flatpickr(dateInput, {
        locale: 'ru', minDate: 'today', dateFormat: 'd.m.Y',
        disable: [date => date < today],
        onDayCreate: (dObj, dStr, fp, dayElem) => {
            const dayDate = dayElem.dateObj;
            if (dayDate < today) { dayElem.style.cssText = 'color:#666;opacity:0.5;text-decoration:line-through;background:#2a2a2a'; }
            else if (dayDate.toDateString() === today.toDateString()) dayElem.style.border = '2px solid #c9a227';
            else if (dayDate.getDay() === 0 || dayDate.getDay() === 6) dayElem.style.color = '#dbb957';
        },
        onChange: (dates, dateStr) => {
            const timeSelect = document.getElementById('time');
            if (timeSelect && dateStr) timeSelect.disabled = false;
            const isWeekend = dates[0] && (dates[0].getDay() === 0 || dates[0].getDay() === 6);
            weekendSurcharge = isWeekend ? 200 : 0;
            showWeekendNotice(isWeekend);
            if (currentStep === 4) updateBookingSummary();
        }
    });
}

function initTimeSlots() {
    const timeSelect = document.getElementById('time');
    if (!timeSelect) return;
    timeSelect.innerHTML = '<option value="">— Выберите время —</option>';
    ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        timeSelect.appendChild(opt);
    });
}

function showWeekendNotice(show) {
    let notice = document.querySelector('.weekend-notice');
    if (show && !notice) {
        const dateField = document.getElementById('date');
        if (dateField?.parentNode) {
            notice = document.createElement('div');
            notice.className = 'weekend-notice';
            notice.innerHTML = '💰 В выходные и праздничные дни наценка +200₽';
            dateField.parentNode.appendChild(notice);
        }
    }
    if (notice) notice.style.display = show ? 'block' : 'none';
}

function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    phoneInput.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 0) {
            if (v.length <= 1) v = '+7';
            else if (v.length <= 4) v = '+7 (' + v.substring(1, 4);
            else if (v.length <= 7) v = '+7 (' + v.substring(1, 4) + ') ' + v.substring(4, 7);
            else if (v.length <= 9) v = '+7 (' + v.substring(1, 4) + ') ' + v.substring(4, 7) + '-' + v.substring(7, 9);
            else v = '+7 (' + v.substring(1, 4) + ') ' + v.substring(4, 7) + '-' + v.substring(7, 9) + '-' + v.substring(9, 11);
            e.target.value = v;
        }
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name')?.value;
    const phone = document.getElementById('phone')?.value;
    const date = document.getElementById('date')?.value;
    const time = document.getElementById('time')?.value;
    const comment = document.querySelector('[name="comment"]')?.value || '';
    
    if (!name || !phone || !selectedServiceId || !selectedMasterId || !date || !time) {
        showNotification('Заполните все поля', 'error');
        return;
    }
    
    if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone)) {
        showNotification('Введите корректный номер телефона', 'error');
        return;
    }
    
    const master = MASTERS_DATA[selectedMasterId];
    const serviceName = getServiceName(selectedServiceId);
    const totalPrice = getTotalPrice(selectedServiceId, selectedMasterId, weekendSurcharge > 0);
    
    const bookingData = {
        name: name,
        phone: phone,
        service: serviceName,
        master: master?.name || selectedMasterId,
        masterLevel: master?.specialty || '',
        date: date,
        time: time,
        price: totalPrice,
        comment: comment
    };
    
    const submitBtn = document.querySelector('#booking-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('https://hohloma-backend.onrender.com/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            const bookings = JSON.parse(localStorage.getItem('hohloma_bookings') || '[]');
            bookings.push({ ...bookingData, id: Date.now(), createdAt: new Date().toISOString() });
            localStorage.setItem('hohloma_bookings', JSON.stringify(bookings));
            
            console.log('📋 Запись отправлена на сервер:', bookingData);
            showNotification('✅ Запись сохранена!', 'success');
            
            document.getElementById('booking-form').reset();
            
            setTimeout(() => {
                const modal = document.getElementById('modal-booking');
                if (modal) {
                    modal.classList.remove('modal-booking--active');
                    document.body.style.overflow = '';
                }
            }, 5000);
        } else {
            showNotification('Ошибка при сохранении. Попробуйте позже.', 'error');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('Ошибка соединения с сервером', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function resetForm() {
    selectedServiceId = null;
    selectedMasterId = null;
    document.querySelectorAll('.booking-service, .booking-master').forEach(el => el.classList.remove('selected'));
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    if (dateInput) dateInput.value = '';
    if (timeSelect) { timeSelect.innerHTML = '<option value="">— Выберите время —</option>'; timeSelect.disabled = true; }
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    showStep(1);
}

function showStep(stepNumber) {
    document.querySelectorAll('.booking-step').forEach(content => {
        content.style.display = content.dataset.step == stepNumber ? 'block' : 'none';
    });
    document.querySelectorAll('.booking-steps__step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        if (stepNum < stepNumber) step.classList.add('completed');
        if (stepNum === stepNumber) step.classList.add('active');
    });
    currentStep = stepNumber;
    if (stepNumber === 2 && selectedServiceId) loadMastersForService(selectedServiceId);
    if (stepNumber === 3) { initCalendar(); initTimeSlots(); }
    if (stepNumber === 4) updateBookingSummary();
}

function applyPresetContext() {
    const { presetMasterId, presetServiceId } = currentContext;
    if (presetServiceId) {
        const serviceEl = document.querySelector(`.booking-service[data-service-id="${presetServiceId}"]`);
        if (serviceEl) { serviceEl.click(); selectedServiceId = presetServiceId; }
    }
    if (selectedServiceId) {
        loadMastersForService(selectedServiceId);
        if (presetMasterId) {
            setTimeout(() => {
                const masterEl = document.querySelector(`.booking-master[data-master-id="${presetMasterId}"]`);
                if (masterEl) { masterEl.click(); selectedMasterId = presetMasterId; }
                setTimeout(() => { const nextBtn = document.querySelector('.btn-next[data-next="2"]'); if (nextBtn) nextBtn.click(); }, 200);
            }, 300);
        } else {
            setTimeout(() => { const nextBtn = document.querySelector('.btn-next[data-next="2"]'); if (nextBtn) nextBtn.click(); }, 200);
        }
    } else if (presetMasterId) {
        for (const [sId, mIds] of Object.entries(mastersByService)) {
            if (mIds.includes(presetMasterId)) {
                const serviceEl = document.querySelector(`.booking-service[data-service-id="${sId}"]`);
                if (serviceEl) { serviceEl.click(); selectedServiceId = sId; break; }
            }
        }
        setTimeout(() => {
            if (selectedServiceId) {
                loadMastersForService(selectedServiceId);
                setTimeout(() => {
                    const masterEl = document.querySelector(`.booking-master[data-master-id="${presetMasterId}"]`);
                    if (masterEl) { masterEl.click(); selectedMasterId = presetMasterId; }
                    setTimeout(() => { const nextBtn = document.querySelector('.btn-next[data-next="2"]'); if (nextBtn) nextBtn.click(); }, 200);
                }, 300);
            }
        }, 100);
    }
}

function showNotification(message, type) {
    alert(message); 
}

function attachBookingButtons() {
    const btns = document.querySelectorAll('[data-modal-open], .team-card__book, .price__book, .hero__actions .btn--primary, .nav__link--primary');
    btns.forEach(btn => {
        btn.removeEventListener('click', handleBookingClick);
        btn.addEventListener('click', handleBookingClick);
    });
}

function handleBookingClick(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const section = btn.getAttribute('data-section') || 'all';
    
    window.openBookingModal({
        masterId: btn.getAttribute('data-master-id'),
        serviceId: btn.getAttribute('data-service-id'),
        source: btn.classList.contains('price__book') ? 'price' : 
                btn.classList.contains('team-card__book') ? 'master-card' : 'nav',
        section: section
    });
}
import { getMastersByService, MASTERS_DATA } from './mastersData.js';

export function initBookingForm() {
    console.log('Initializing booking form...');
    
    const modal = document.getElementById('modal-booking');
    const modalClose = document.getElementById('modal-booking-close');
    const modalOverlay = modal?.querySelector('.modal-booking__overlay');
    const modalBody = document.querySelector('.modal-booking__body');
    
    if (!modal) {
        console.warn('Booking modal not found');
        return;
    }
    
    // ВСТАВЛЯЕМ ФОРМУ
    if (modalBody) {
        modalBody.innerHTML = `
            <form id="booking-form" class="booking-form">
                <!-- ШАГ 1: УСЛУГА -->
                <div class="form-group">
                    <label class="form-label">Услуга *</label>
                    <select id="service" name="service" class="form-select" required>
                        <option value="">— Выберите услугу —</option>
                        <option value="tattoo-individual">Татуировка (индивидуальный эскиз)</option>
                        <option value="tattoo-catalog">Татуировка (из каталога)</option>
                        <option value="tattoo-cover">Перекрытие/исправление тату</option>
                        <option value="piercing-ear">Пирсинг уха</option>
                        <option value="piercing-nose">Пирсинг носа</option>
                        <option value="piercing-lip">Пирсинг губы</option>
                        <option value="piercing-eyebrow">Пирсинг брови</option>
                        <option value="piercing-tongue">Пирсинг языка</option>
                        <option value="piercing-navel">Пирсинг пупка</option>
                        <option value="piercing-intimate">Интимный пирсинг</option>
                        <option value="massage-classic">Классический массаж</option>
                        <option value="massage-sport">Спортивный массаж</option>
                        <option value="massage-anticellulite">Антицеллюлитный массаж</option>
                        <option value="barber-haircut-men">Мужская стрижка</option>
                        <option value="barber-haircut-kids">Детская стрижка</option>
                        <option value="barber-beard-modeling">Моделирование бороды</option>
                        <option value="barber-beard-care">Уход за бородой</option>
                        <option value="barber-shave-classic">Классическое бритьё</option>
                        <option value="barber-shave-razor">Бритьё опасной бритвой</option>
                    </select>
                </div>
                
                <!-- ШАГ 2: МАСТЕР (появляется после выбора услуги) -->
                <div class="form-group" id="master-group" style="display: none;">
                    <label class="form-label">Мастер *</label>
                    <select id="master" name="master" class="form-select" required disabled>
                        <option value="">— Сначала выберите услугу —</option>
                    </select>
                </div>
                
                <!-- ШАГ 3: ДАТА И ВРЕМЯ (появляются после выбора мастера) -->
                <div id="datetime-group" style="display: none;">
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
                </div>
                
                <!-- КОНТАКТНЫЕ ДАННЫЕ (всегда видны) -->
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
                
                <button type="submit" class="btn btn--primary btn--large btn--full" id="submit-btn" style="display: none;">Записаться</button>
            </form>
        `;
        console.log('Form inserted into modal');
    }
    
    // Функция открытия модалки
    window.openBookingModal = function() {
        console.log('Opening modal...');
        modal.classList.add('modal-booking--active');
        document.body.style.overflow = 'hidden';
        resetForm();
    };
    
    function resetForm() {
        const form = document.getElementById('booking-form');
        if (form) form.reset();
        
        const masterGroup = document.getElementById('master-group');
        const datetimeGroup = document.getElementById('datetime-group');
        const submitBtn = document.getElementById('submit-btn');
        
        if (masterGroup) masterGroup.style.display = 'none';
        if (datetimeGroup) datetimeGroup.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'none';
        
        const masterSelect = document.getElementById('master');
        if (masterSelect) {
            masterSelect.innerHTML = '<option value="">— Сначала выберите услугу —</option>';
            masterSelect.disabled = true;
        }
        
        const timeSelect = document.getElementById('time');
        if (timeSelect) {
            timeSelect.innerHTML = '<option value="">— Сначала выберите дату —</option>';
            timeSelect.disabled = true;
        }
        
        const notice = document.querySelector('.weekend-notice');
        if (notice) notice.remove();
    }
    
    function closeModal() {
        modal.classList.remove('modal-booking--active');
        document.body.style.overflow = '';
        resetForm();
    }
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('modal-booking--active')) {
            closeModal();
        }
    });
    
    initServiceMasterDependency();
    initPhoneMask();
    
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmit);
    }
    
    attachBookingButtons();
}

// ==================== ЗАВИСИМОСТЬ УСЛУГА → МАСТЕР (из mastersData) ====================
function initServiceMasterDependency() {
    const serviceSelect = document.getElementById('service');
    const masterGroup = document.getElementById('master-group');
    const masterSelect = document.getElementById('master');
    
    if (!serviceSelect || !masterSelect) return;
    
    serviceSelect.addEventListener('change', function() {
        const service = this.value;
        
        if (!service) {
            masterGroup.style.display = 'none';
            return;
        }
        
        // Используем данные из mastersData.js
        const masters = getMastersByService(service);
        
        masterSelect.innerHTML = '<option value="">— Выберите мастера —</option>';
        
        if (masters.length > 0) {
            masters.forEach(master => {
                const option = document.createElement('option');
                option.value = master.id;
                // Показываем имя + звездочку для топ-мастеров
                const star = master.isTop ? '⭐ ' : '';
                const specialty = master.specialty ? ` (${master.specialty})` : '';
                option.textContent = `${star}${master.name}${specialty}`;
                masterSelect.appendChild(option);
            });
            masterSelect.disabled = false;
            masterGroup.style.display = 'block';
            masterSelect.removeEventListener('change', onMasterSelect);
            masterSelect.addEventListener('change', onMasterSelect);
        } else {
            masterSelect.innerHTML = '<option value="">— Нет доступных мастеров —</option>';
            masterSelect.disabled = true;
            masterGroup.style.display = 'block';
        }
    });
}

function onMasterSelect() {
    const masterSelect = document.getElementById('master');
    const datetimeGroup = document.getElementById('datetime-group');
    const submitBtn = document.getElementById('submit-btn');
    
    if (masterSelect.value) {
        datetimeGroup.style.display = 'block';
        initCalendar();
        initTimeSlots();
        submitBtn.style.display = 'block';
    } else {
        datetimeGroup.style.display = 'none';
        submitBtn.style.display = 'none';
    }
}

// ==================== КАЛЕНДАРЬ ====================
function initCalendar() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;
    
    if (typeof flatpickr === 'undefined') {
        console.warn('Flatpickr not loaded');
        return;
    }
    
    if (dateInput._flatpickr) {
        dateInput._flatpickr.destroy();
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    flatpickr(dateInput, {
        locale: 'ru',
        minDate: 'today',
        dateFormat: 'd.m.Y',
        disable: [function(date) { return date < today; }],
        onDayCreate: function(dObj, dStr, fp, dayElem) {
            const dayDate = dayElem.dateObj;
            if (dayDate < today) {
                dayElem.style.color = '#666';
                dayElem.style.opacity = '0.5';
                dayElem.style.textDecoration = 'line-through';
                dayElem.style.background = '#2a2a2a';
                dayElem.style.cursor = 'not-allowed';
            } else if (dayDate.toDateString() === today.toDateString()) {
                dayElem.style.border = '2px solid #c9a227';
                dayElem.style.color = '#c9a227';
            } else if ((dayDate.getDay() === 0 || dayDate.getDay() === 6) && dayDate >= today) {
                dayElem.style.color = '#dbb957';
            } else {
                dayElem.style.color = '#fff';
                dayElem.style.opacity = '1';
                dayElem.style.textDecoration = 'none';
                dayElem.style.background = 'transparent';
            }
        },
        onChange: function(selectedDates, dateStr) {
            const timeSelect = document.getElementById('time');
            if (timeSelect && dateStr) {
                timeSelect.disabled = false;
            }
            if (selectedDates[0]) {
                const dayOfWeek = selectedDates[0].getDay();
                const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
                showWeekendNotice(isWeekend);
            }
        }
    });
}

function showWeekendNotice(show) {
    let notice = document.querySelector('.weekend-notice');
    if (show) {
        if (!notice) {
            const dateField = document.getElementById('date');
            if (dateField && dateField.parentNode) {
                notice = document.createElement('div');
                notice.className = 'weekend-notice';
                notice.innerHTML = `
                    <span class="weekend-notice__icon">💰</span>
                    <span class="weekend-notice__text">В выходные и праздничные дни наценка +200₽</span>
                `;
                dateField.parentNode.appendChild(notice);
            }
        }
        if (notice) notice.style.display = 'flex';
    } else {
        if (notice) notice.style.display = 'none';
    }
}

// ==================== ВРЕМЕННЫЕ СЛОТЫ ====================
function initTimeSlots() {
    const timeSelect = document.getElementById('time');
    if (!timeSelect) return;
    
    const firstOption = timeSelect.querySelector('option[value=""]');
    timeSelect.innerHTML = '';
    if (firstOption) timeSelect.appendChild(firstOption);
    
    const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    timeSlots.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
}

// ==================== МАСКА ТЕЛЕФОНА ====================
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 1) {
                value = '+7';
            } else if (value.length <= 4) {
                value = '+7 (' + value.substring(1, 4);
            } else if (value.length <= 7) {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7);
            } else if (value.length <= 9) {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9);
            } else {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
            }
            e.target.value = value;
        }
    });
}

// ==================== ОТПРАВКА ФОРМЫ (ТЕСТОВЫЙ РЕЖИМ) ====================
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const phone = formData.get('phone');
    const serviceCode = formData.get('service');
    const masterId = formData.get('master');
    const date = formData.get('date');
    const time = formData.get('time');
    const comment = formData.get('comment') || '';
    
    if (!name || !phone || !serviceCode || !masterId || !date || !time) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(phone)) {
        showNotification('Введите корректный номер телефона', 'error');
        return;
    }
    
    // Получаем данные мастера из MASTERS_DATA
    const master = MASTERS_DATA[masterId];
    const masterName = master ? master.name : masterId;
    const masterSpecialty = master?.specialty || '';
    const isTopMaster = master?.isTop || false;
    
    // Получаем название услуги из select
    const serviceSelect = document.getElementById('service');
    const serviceName = serviceSelect.options[serviceSelect.selectedIndex]?.text || serviceCode;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // ТЕСТОВЫЙ РЕЖИМ: сохраняем в localStorage
    const booking = {
        id: Date.now(),
        name,
        phone,
        service: serviceName,
        master: masterName,
        masterSpecialty,
        isTopMaster,
        date,
        time,
        comment,
        createdAt: new Date().toISOString()
    };
    
    const bookings = JSON.parse(localStorage.getItem('hohloma_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('hohloma_bookings', JSON.stringify(bookings));
    
    // Выводим в консоль
    console.log('📋 НОВАЯ ЗАПИСЬ:');
    console.log('├─ Имя:', name);
    console.log('├─ Телефон:', phone);
    console.log('├─ Услуга:', serviceName);
    console.log(`├─ Мастер: ${isTopMaster ? '⭐ ' : ''}${masterName}${masterSpecialty ? ` (${masterSpecialty})` : ''}`);
    console.log('├─ Дата/время:', date, time);
    console.log('└─ Комментарий:', comment || '—');
    console.log(`📊 Всего записей: ${bookings.length}`);
    
    // Очищаем форму
    form.reset();
    
    const masterSelect = document.getElementById('master');
    const timeSelect = document.getElementById('time');
    if (masterSelect) {
        masterSelect.innerHTML = '<option value="">— Сначала выберите услугу —</option>';
        masterSelect.disabled = true;
    }
    if (timeSelect) {
        timeSelect.innerHTML = '<option value="">— Сначала выберите дату —</option>';
        timeSelect.disabled = true;
    }
    
    const masterGroup = document.getElementById('master-group');
    const datetimeGroup = document.getElementById('datetime-group');
    const submitBtn2 = document.getElementById('submit-btn');
    if (masterGroup) masterGroup.style.display = 'none';
    if (datetimeGroup) datetimeGroup.style.display = 'none';
    if (submitBtn2) submitBtn2.style.display = 'none';
    
    const notice = document.querySelector('.weekend-notice');
    if (notice) notice.remove();
    
    showNotification('✅ Запись сохранена! Хорошего дня!', 'success');
    
    setTimeout(() => {
        const modal = document.getElementById('modal-booking');
        if (modal) {
            modal.classList.remove('modal-booking--active');
            document.body.style.overflow = '';
        }
    }, 2000);
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
}

function showNotification(message, type = 'info') {
    const modal = document.getElementById('notification-modal');
    if (!modal) return;
    
    const modalMessage = modal.querySelector('.modal__message');
    const modalIcon = modal.querySelector('.modal__icon');
    
    if (modalMessage) modalMessage.textContent = message;
    
    if (modalIcon) {
        modalIcon.className = `modal__icon modal__icon--${type}`;
        modalIcon.textContent = type === 'success' ? '✓' : '✗';
    }
    
    modal.classList.add('modal--active');
    
    setTimeout(() => {
        modal.classList.remove('modal--active');
    }, 5000);
}

function attachBookingButtons() {
    const allButtons = document.querySelectorAll('.team-card__book, [data-modal-open], .nav__link--primary, .hero__actions .btn--primary');
    allButtons.forEach(btn => {
        btn.removeEventListener('click', handleBookingClick);
        btn.addEventListener('click', handleBookingClick);
    });
}

function handleBookingClick(e) {
    e.preventDefault();
    if (window.openBookingModal) {
        window.openBookingModal();
    }
}
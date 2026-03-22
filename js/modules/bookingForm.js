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
    
    if (modalBody) {
        modalBody.innerHTML = `
            <form id="booking-form" class="booking-form">
                <div class="form-row">
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
                    
                    <div class="form-group">
                        <label class="form-label">Мастер *</label>
                        <select id="master" name="master" class="form-select" required disabled>
                            <option value="">— Сначала выберите услугу —</option>
                        </select>
                    </div>
                </div>
                
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
                
                <button type="submit" class="btn btn--primary btn--large btn--full">Записаться</button>
            </form>
        `;
        console.log('Form inserted into modal');
    }
    
    window.openBookingModal = function() {
        console.log('Opening modal...');
        modal.classList.add('modal-booking--active');
        document.body.style.overflow = 'hidden';
    };
    
    function closeModal() {
        modal.classList.remove('modal-booking--active');
        document.body.style.overflow = '';
        const notice = document.querySelector('.weekend-notice');
        if (notice) notice.remove();
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('modal-booking--active')) {
            closeModal();
        }
    });
    
    initServiceMasterDependency();
    initCalendar();
    initTimeSlots();
    initPhoneMask();
    
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmit);
        console.log('Form submit handler attached');
    }
    
    attachBookingButtons();
}

// ==================== МАППИНГ УСЛУГ К МАСТЕРАМ ====================
const mastersByService = {
    // Тату
    'tattoo-individual': ['Даниил Грачёв', 'Анастасия Шиндина', 'Юрий Манохин'],
    'tattoo-catalog': ['Даниил Грачёв', 'Анастасия Шиндина', 'Юрий Манохин'],
    'tattoo-cover': ['Юрий Манохин', 'Даниил Грачёв'],
    // Пирсинг
    'piercing-ear': ['Виктория Томс', 'Алексей Бобров'],
    'piercing-nose': ['Виктория Томс', 'Алексей Бобров'],
    'piercing-lip': ['Виктория Томс'],
    'piercing-eyebrow': ['Виктория Томс'],
    'piercing-tongue': ['Виктория Томс'],
    'piercing-navel': ['Виктория Томс'],
    'piercing-intimate': ['Виктория Томс'],
    // Массаж
    'massage-classic': ['Алексей Авакумов'],
    'massage-sport': ['Алексей Авакумов'],
    'massage-anticellulite': ['Алексей Авакумов'],
    // Барбершоп
    'barber-haircut-men': ['Алексей (барбер)', 'Даниил (барбер)', 'Виктория (барбер)'],
    'barber-haircut-kids': ['Алексей (барбер)', 'Даниил (барбер)'],
    'barber-beard-modeling': ['Алексей (барбер)', 'Даниил (барбер)'],
    'barber-beard-care': ['Алексей (барбер)', 'Даниил (барбер)'],
    'barber-shave-classic': ['Алексей (барбер)', 'Виктория (барбер)'],
    'barber-shave-razor': ['Алексей (барбер)', 'Виктория (барбер)']
};

// ==================== ЗАВИСИМОСТЬ УСЛУГА → МАСТЕР ====================
function initServiceMasterDependency() {
    const serviceSelect = document.getElementById('service');
    const masterSelect = document.getElementById('master');
    
    if (!serviceSelect || !masterSelect) return;
    
    serviceSelect.addEventListener('change', function() {
        const service = this.value;
        const masters = mastersByService[service] || [];
        
        masterSelect.innerHTML = '<option value="">— Выберите мастера —</option>';
        
        if (masters.length > 0) {
            masters.forEach(master => {
                const option = document.createElement('option');
                option.value = master;
                option.textContent = master;
                masterSelect.appendChild(option);
            });
            masterSelect.disabled = false;
        } else {
            masterSelect.innerHTML = '<option value="">— Нет доступных мастеров —</option>';
            masterSelect.disabled = true;
        }
    });
}

// ==================== КАЛЕНДАРЬ ====================
function initCalendar() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;
    
    if (typeof flatpickr === 'undefined') {
        console.warn('Flatpickr not loaded');
        return;
    }
    
    flatpickr(dateInput, {
        locale: 'ru',
        minDate: 'today',
        dateFormat: 'd.m.Y',
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

// ==================== ОТПРАВКА ФОРМЫ ====================
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const master = formData.get('master');
    const date = formData.get('date');
    const time = formData.get('time');
    
    if (!name || !phone || !service || !master || !date || !time) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(phone)) {
        showNotification('Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX', 'error');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('php/send-booking.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
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
            
            const notice = document.querySelector('.weekend-notice');
            if (notice) notice.remove();
            
            showNotification('Спасибо! Мы свяжемся с вами в ближайшее время для подтверждения записи.', 'success');
            
            setTimeout(() => {
                const modal = document.getElementById('modal-booking');
                if (modal) {
                    modal.classList.remove('modal-booking--active');
                    document.body.style.overflow = '';
                }
            }, 2000);
        } else {
            showNotification(result.error || 'Ошибка при отправке. Пожалуйста, попробуйте позже.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Ошибка соединения. Проверьте интернет или попробуйте позже.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ==================== УВЕДОМЛЕНИЯ ====================
function showNotification(message, type = 'info') {
    const modal = document.getElementById('notification-modal');
    if (!modal) return;
    
    const modalMessage = modal.querySelector('.modal__message');
    if (modalMessage) modalMessage.textContent = message;
    
    modal.classList.add('modal--active');
    
    setTimeout(() => {
        modal.classList.remove('modal--active');
    }, 5000);
}

// ==================== КНОПКИ ЗАПИСИ ====================
function attachBookingButtons() {
    console.log('Attaching booking buttons...');
    
    const allButtons = document.querySelectorAll('.team-card__book, [data-modal-open], .nav__link--primary, .hero__actions .btn--primary');
    console.log('Found buttons:', allButtons.length);
    
    allButtons.forEach(btn => {
        btn.removeEventListener('click', handleBookingClick);
        btn.addEventListener('click', handleBookingClick);
    });
}

function handleBookingClick(e) {
    e.preventDefault();
    console.log('Booking button clicked');
    
    if (window.openBookingModal) {
        window.openBookingModal();
    }
}
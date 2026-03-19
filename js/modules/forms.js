export function phoneMask(phoneInput) {
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

export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validatePhone(phone) {
    const re = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    return re.test(phone);
}

// Показать ошибку валидации
export function showInputError(input, message) {
    input.classList.add('form-input--error');
    
    const oldError = input.parentNode.querySelector('.form-error');
    if (oldError) oldError.remove();
    
    const error = document.createElement('span');
    error.className = 'form-error';
    error.textContent = message;
    error.style.color = '#dc3545';
    error.style.fontSize = '0.85rem';
    error.style.marginTop = '5px';
    error.style.display = 'block';
    
    input.parentNode.appendChild(error);
}

export function hideInputError(input) {
    input.classList.remove('form-input--error');
    const error = input.parentNode.querySelector('.form-error');
    if (error) error.remove();
}

export function initForms() {
    console.log('Initializing forms');
    
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(phoneMask);
    
    // Валидация при отправке
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const phoneInput = this.querySelector('input[type="tel"]');
            const emailInput = this.querySelector('input[type="email"]');
            const nameInput = this.querySelector('input[name="name"]');
            
            if (phoneInput) {
                if (!validatePhone(phoneInput.value)) {
                    showInputError(phoneInput, 'Введите корректный номер телефона');
                    isValid = false;
                } else {
                    hideInputError(phoneInput);
                }
            }
            
            if (emailInput && emailInput.value) {
                if (!validateEmail(emailInput.value)) {
                    showInputError(emailInput, 'Введите корректный email');
                    isValid = false;
                } else {
                    hideInputError(emailInput);
                }
            }
            
            if (nameInput && !nameInput.value.trim()) {
                showInputError(nameInput, 'Введите имя');
                isValid = false;
            } else if (nameInput) {
                hideInputError(nameInput);
            }
            
            if (isValid) {
                console.log('Form is valid, submitting...');
                showSuccessMessage();
            }
        });
    });
}

// Сообщение об успехе
function showSuccessMessage() {
    const modal = document.getElementById('notification-modal');
    if (!modal) return;
    
    const message = modal.querySelector('.modal__message');
    if (message) {
        message.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
    }
    
    modal.classList.add('modal--active');
    
    setTimeout(() => {
        modal.classList.remove('modal--active');
    }, 5000);
}
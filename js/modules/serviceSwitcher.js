export function initServiceSwitcher() {
    console.log('Service switcher initialized');
    
    const switcherBtns = document.querySelectorAll('.nav__link--switcher');
    const contents = document.querySelectorAll('.service-content');
    
    if (!switcherBtns.length || !contents.length) {
        console.warn('Service switcher elements not found');
        return;
    }
    
    function switchService(serviceName) {
        console.log('Switching to:', serviceName);
        
        contents.forEach(content => {
            content.classList.remove('service-content--active');
        });
        
        const activeContent = document.getElementById(`${serviceName}-content`);
        if (activeContent) {
            activeContent.classList.add('service-content--active');
        }
        
        switcherBtns.forEach(btn => {
            btn.classList.remove('nav__link--active');
            if (btn.dataset.service === serviceName) {
                btn.classList.add('nav__link--active');
            }
        });
        
        localStorage.setItem('preferredService', serviceName);
    }
    
    switcherBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const service = this.dataset.service;
            switchService(service);
        });
    });
    
    const savedService = localStorage.getItem('preferredService');
    if (savedService && (savedService === 'tattoo' || savedService === 'barber')) {
        switchService(savedService);
    } else {
        switchService('barber');
    }
}
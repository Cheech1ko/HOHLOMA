export function initServiceSwitcher() {
    console.log('Service switcher initialized');
    
    const switcherBtns = document.querySelectorAll('.nav__link--switcher');
    const contents = document.querySelectorAll('.service-content');
    
    if (!switcherBtns.length || !contents.length) {
        console.warn('Service switcher elements not found');
        return;
    }
    
    function switchService(serviceName, addToHistory = true) {
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

        if (addToHistory) {
            const newUrl = `${window.location.pathname}?service=${serviceName}`;
            window.history.pushState({ service: serviceName }, '', newUrl);
        }
        
        localStorage.setItem('preferredService', serviceName);

        window.dispatchEvent(new CustomEvent('serviceChanged', { detail: { service: serviceName}
        }));
    }

    function getServiceFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const service = urlParams.get('service');
        if (service === 'tattoo' || service === 'barber') {
            return service;
        }
        return null;
    }

    switcherBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const service = this.dataset.service;
            switchService(service, true);
        });
    });

    window.addEventListener('popstate', function(event) {
        const service = event.state?.service || getServiceFromUrl();
        if (service) {
            switchService(service, false); 
        } else {
            switchService('tattoo', false);
        }
    })

    let initialService = getServiceFromUrl();
    if (!initialService) {
        initialService = localStorage.getItem('preferredService');
    }

    if (initialService && (initialService === 'tattoo' || initialService === 'barber')) {
        switchService(initialService, false);
    } else {
        switchService('tattoo', false);
    }
    
    const savedService = localStorage.getItem('preferredService');
    if (savedService && (savedService === 'tattoo' || savedService === 'barber')) {
        switchService(savedService);
    } else {
        switchService('barber');
    }
}
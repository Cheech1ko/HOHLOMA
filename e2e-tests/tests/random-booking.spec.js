import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker/locale/ru';

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRussianPhone() {
    const code = Math.floor(Math.random() * 900) + 100; // 100-999
    const num1 = Math.floor(Math.random() * 900) + 100; // 100-999
    const num2 = Math.floor(Math.random() * 100);       // 0-99
    const num3 = Math.floor(Math.random() * 100);       // 0-99
    return `+7 (${code}) ${num1}-${num2.toString().padStart(2, '0')}-${num3.toString().padStart(2, '0')}`;
}

const SERVICES = [
    'Мужская стрижка',
    'Детская стрижка (4-12 лет)',
    'Оформление бороды / усов',
    'Стрижка + оформление бороды',
    'Стрижка машинкой',
    'Бритьё наголо',
    'Королевское бритьё',
    'Укладка',
    'Коррекция стрижки',
    'Отец + сын',
    'Тонирование волос',
    'Тонирование бороды',
    'Окрашивание',
    'Татуировка (индивидуальный эскиз)',
    'Татуировка (из каталога)',
    'Перекрытие/исправление тату',
    'Пирсинг уха',
    'Пирсинг носа',
    'Пирсинг губы',
    'Пирсинг пупка',
    'Классический массаж',
    'Спортивный массаж',
    'Антицеллюлитный массаж'
];

const SERVICE_MASTERS_MAP = {
    'Мужская стрижка': ['Владимир', 'Кирилл', 'Евгений', 'Максим', 'Арианна'],
    'Детская стрижка (4-12 лет)': ['Владимир', 'Кирилл', 'Евгений'],
    'Оформление бороды / усов': ['Владимир', 'Кирилл', 'Евгений'],
    'Стрижка + оформление бороды': ['Владимир', 'Кирилл', 'Евгений', 'Максим', 'Арианна'],
    'Стрижка машинкой': ['Владимир', 'Кирилл', 'Евгений', 'Максим', 'Арианна'],
    'Бритьё наголо': ['Владимир', 'Кирилл', 'Евгений'],
    'Королевское бритьё': ['Владимир', 'Кирилл', 'Евгений'],
    'Укладка': ['Владимир', 'Кирилл', 'Евгений', 'Максим', 'Арианна'],
    'Коррекция стрижки': ['Владимир', 'Кирилл', 'Евгений', 'Максим', 'Арианна'],
    'Отец + сын': ['Владимир', 'Кирилл', 'Евгений', 'Максим', 'Арианна'],
    'Тонирование волос': ['Владимир', 'Кирилл', 'Евгений', 'Максим', 'Арианна'],
    'Тонирование бороды': ['Владимир', 'Кирилл', 'Евгений', 'Максим', 'Арианна'],
    'Окрашивание': ['Владимир', 'Кирилл', 'Евгений', 'Максим', 'Арианна'],
    'Татуировка (индивидуальный эскиз)': ['Даниил Грачёв', 'Анастасия Шиндина', 'Юрий Манохин'],
    'Татуировка (из каталога)': ['Даниил Грачёв', 'Анастасия Шиндина', 'Юрий Манохин'],
    'Перекрытие/исправление тату': ['Юрий Манохин', 'Даниил Грачёв'],
    'Пирсинг уха': ['Виктория Томс', 'Алексей Бобров'],
    'Пирсинг носа': ['Виктория Томс', 'Алексей Бобров'],
    'Пирсинг губы': ['Виктория Томс'],
    'Пирсинг пупка': ['Виктория Томс'],
    'Классический массаж': ['Алексей Авакумов'],
    'Спортивный массаж': ['Алексей Авакумов'],
    'Антицеллюлитный массаж': ['Алексей Авакумов']
};

function getRandomMasterForService(service) {
    const masters = SERVICE_MASTERS_MAP[service];
    if (!masters || masters.length === 0) return null;
    return getRandomItem(masters);
}

test.describe('Рандомное тестирование записи', () => {

    test('Случайная запись через навбар', async ({ page }) => {

        const service = getRandomItem(SERVICES);
        const master = getRandomMasterForService(service);

        const testData = {
            name: faker.person.fullName(),
            phone: generateRussianPhone(),
            email: faker.internet.email(),
            comment: faker.lorem.sentence(),
            service: service,
            master: master
        };

        console.log('Тестовые данные:', testData);

        await page.goto('http://localhost:5500');
        await page.click('.nav__link--primary');

        await page.click('.booking-option-btn[data-start="service"]');
        await page.click(`.booking-service:has-text("${testData.service}")`);
        await page.click('#service-next');

        await page.click(`.booking-master:has-text("${testData.master}")`);
        await page.click('#master-next');

        const availableDays = await page.locator('.time-calendar__day:not(.disabled)').all();
        if (availableDays.length === 0) throw new Error('Нет доступных дней');
        const randomDay = availableDays[Math.floor(Math.random() * availableDays.length)];
        await randomDay.click();
        await page.waitForTimeout(500);
        
        await page.waitForSelector('.time-calendar__slot:not(.disabled)');
        const availableSlots = await page.locator('.time-calendar__slot:not(.disabled)').all();
        if (availableSlots.length === 0) throw new Error('Нет доступных слотов');
        const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
        await randomSlot.click();
        await page.click('#time-next');
        await page.waitForTimeout(500);

        await page.fill('#name', `${testData.name} (Тест QA)`);
        await page.fill('#phone', testData.phone);
        await page.fill('#email', testData.email);
        await page.fill('#comment', testData.comment);

        await page.click('#submit-booking');

        await expect(page.locator('.modal__message')).toHaveText('✅ Запись сохранена!');
        console.log('✅ Тест пройден!');
    });
})
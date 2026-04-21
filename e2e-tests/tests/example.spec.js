// @ts-check
import { test, expect } from '@playwright/test';

test('Успешная запись через форму из навбара', async ({page}) => {
  await page.goto('http://localhost:5500');
  console.log('Шаг 1: Открыли сайт');

  await page.click('.nav__link--primary');
  console.log('Шаг 2: Открыли модалку');

  await page.click('.booking-option-btn[data-start="service"]');
  await page.click('.booking-service:has-text("Мужская стрижка")');
  await page.click('#service-next');
  console.log('Шаг 3: выбрали услугу');

  await page.click('.booking-master:has-text("Максим")');
  await page.click('#master-next');
  console.log('Шаг 4: Выбрали мастера');

  await page.click('.time-calendar__day:not(.disabled)');
  await page.click('.time-calendar__slot:not(.disabled)');
  await page.click('#time-next');
  console.log('Шаг 5: Выбрали дату и время');

  await page.fill('#name', 'Тест QA');
  await page.fill('#phone', '+7 (999)-999-99-99');
  await page.click('#submit-booking');
  console.log('Шаг 6: Отправили форму');

  await expect(page.locator('.modal__message')).toContainText('Запись сохранена');
  console.log('Тест пройден: запись успешно создана!');
});

<?php
header('Content-Type: application/json; charset=utf-8');

// Настройки (временно сохраняем в файл для теста)
$logFile = __DIR__ . '/bookings.log';

// Получаем данные
$service = htmlspecialchars($_POST['service'] ?? '');
$master = htmlspecialchars($_POST['master'] ?? '');
$date = htmlspecialchars($_POST['date'] ?? '');
$time = htmlspecialchars($_POST['time'] ?? '');
$name = htmlspecialchars($_POST['name'] ?? '');
$phone = htmlspecialchars($_POST['phone'] ?? '');
$comment = htmlspecialchars($_POST['comment'] ?? '');

// Преобразуем код услуги в название
$serviceNames = [
    'tattoo-individual' => 'Татуировка (индивидуальный эскиз)',
    'tattoo-catalog' => 'Татуировка (из каталога)',
    'tattoo-cover' => 'Перекрытие/исправление тату',
    'piercing-ear' => 'Пирсинг уха',
    'piercing-nose' => 'Пирсинг носа',
    'piercing-lip' => 'Пирсинг губы',
    'piercing-eyebrow' => 'Пирсинг брови',
    'piercing-tongue' => 'Пирсинг языка',
    'piercing-navel' => 'Пирсинг пупка',
    'piercing-intimate' => 'Интимный пирсинг',
    'massage-classic' => 'Классический массаж',
    'massage-sport' => 'Спортивный массаж',
    'massage-anticellulite' => 'Антицеллюлитный массаж',
    'barber-haircut-men' => 'Мужская стрижка',
    'barber-haircut-kids' => 'Детская стрижка',
    'barber-beard-modeling' => 'Моделирование бороды',
    'barber-beard-care' => 'Уход за бородой',
    'barber-shave-classic' => 'Классическое бритьё',
    'barber-shave-razor' => 'Бритьё опасной бритвой'
];

$serviceName = $serviceNames[$service] ?? $service;

// Валидация
$errors = [];
if (empty($name)) $errors[] = 'Имя не заполнено';
if (empty($phone)) $errors[] = 'Телефон не заполнен';
if (empty($service)) $errors[] = 'Услуга не выбрана';
if (empty($master)) $errors[] = 'Мастер не выбран';
if (empty($date)) $errors[] = 'Дата не выбрана';
if (empty($time)) $errors[] = 'Время не выбрано';

if (!empty($errors)) {
    echo json_encode(['success' => false, 'error' => implode(', ', $errors)], JSON_UNESCAPED_UNICODE);
    exit;
}

// Сохраняем в лог-файл
$logEntry = date('Y-m-d H:i:s') . " | $name | $phone | $serviceName | $master | $date $time | $comment\n";
file_put_contents($logFile, $logEntry, FILE_APPEND);

// Отправляем ответ об успехе
echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
?>
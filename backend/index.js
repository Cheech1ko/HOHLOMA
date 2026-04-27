const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const nodemailer = require('nodemailer');
const { saveBooking, getAllBookings, pool } = require('./database');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://cheech1ko.github.io']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

const MASTERS_DATA = {
    'daniil-tattoo': { name: 'Даниил Грачёв' },
    'anastasia-tattoo': { name: 'Анастасия Шиндина' },
    'yuri-tattoo': { name: 'Юрий Манохин' },
    'vladimir-barber': { name: 'Владимир' },
    'kirill-barber': { name: 'Кирилл' },
    'evgeniy-barber': { name: 'Евгений' },
    'maxim-barber': { name: 'Максим' },
    'arianna-barber': { name: 'Арианна' },
    'victoria-piercing': { name: 'Виктория Томс' },
    'alexey-piercing': { name: 'Алексей Бобров' },
    'alexey-massage': { name: 'Алексей Авакумов' }
};


// Отправка письма клиенту
async function sendClientEmail(booking) {
    const msg = {
        from: '"Хохлома" <pleshakov.iljuha@yandex.ru>',
        to: booking.email,
        subject: '✅ Подтверждение записи в студию Хохлома',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
                <h2 style="color: #c9a227;">Спасибо за запись!</h2>
                <p>Вы записаны на:</p>
                <ul>
                    <li><strong>Услуга:</strong> ${booking.service}</li>
                    <li><strong>Мастер:</strong> ${booking.master}</li>
                    <li><strong>Дата и время:</strong> ${booking.date} ${booking.time}</li>
                    <li><strong>Цена:</strong> ${booking.price}₽</li>
                </ul>
                <p>При себе иметь паспорт и сменную обувь.</p>
                <p>По вопросам: +7 (8412) 248-398</p>
                <hr>
                <p style="font-size: 12px; color: #666;">Это письмо создано автоматически. Пожалуйста, не отвечайте на него.</p>
            </div>
        `
    };
    
    const info = await transporter.sendMail(msg);
    console.log('✉️ Письмо клиенту отправлено:', info.messageId);
    return info;
}


app.get('/api/nearest-slots', async (req, res) => {
            try {
                const { masterId } = req.query;
                const master = MASTERS_DATA[masterId];
                const masterName = master?.name || masterId;
                
                const today = new Date();
                const nextWeek = new Date();
                nextWeek.setDate(today.getDate() + 7);
                
                const formatForDB = (date) => {
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}.${month}.${year}`;
                };
                
                const busyResult = await pool.query(
                    `SELECT date, time FROM bookings 
                    WHERE master = $1 
                    AND date >= $2 AND date <= $3`,
                    [masterName, formatForDB(today), formatForDB(nextWeek)]
                );
                
                const busySet = new Set(busyResult.rows.map(r => `${r.date}|${r.time}`));
                
                const allSlots = [];
                for (let i = 0; i <= 7; i++) {
                    const date = new Date();
                    date.setDate(today.getDate() + i);
                    const dateStr = formatForDB(date);
                    if (date < today) continue;
                    
                    for (let hour = 10; hour <= 19; hour++) {
                        for (let minute = 0; minute < 60; minute += 15) {
                            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                            if (!busySet.has(`${dateStr}|${timeStr}`)) {
                                allSlots.push({ date: dateStr, time: timeStr });
                            }
                        }
                    }
                }
                
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
                
                const availableSlots = allSlots.filter(slot => {
                    const [slotDay, slotMonth, slotYear] = slot.date.split('.').map(Number);
                    const slotDate = new Date(slotYear, slotMonth - 1, slotDay);
                    
                    if (slotDate < now) return false;
                    if (slotDate.toDateString() === now.toDateString()) {
                        const [slotHour, slotMinute] = slot.time.split(':').map(Number);
                        return (slotHour > currentHour) || (slotHour === currentHour && slotMinute > currentMinute);
                    }
                    return true;
                });
                
                const nearestSlots = [];
                const usedDates = new Set();
                for (const slot of availableSlots) {
                    if (!usedDates.has(slot.date)) {
                        usedDates.add(slot.date);
                        nearestSlots.push(slot);
                        if (nearestSlots.length === 3) break;
                    }
                }
                
                res.json({ slots: nearestSlots });
            } catch (err) {
                console.error('❌ Ошибка получения слотов:', err);
                res.status(500).json({ error: 'Ошибка сервера' });
            }
        });

app.get('/api/admin/bookings', async (req, res) => {
        try {
        const { status, master, from, to, sort, order } = req.query;
        let query = `SELECT * FROM bookings WHERE 1=1`;
        const params = [];
        
        if (status) {
            query += ` AND status = $${params.length + 1}`;
            params.push(status);
        }
        if (master && master !== '') {
            query += ` AND master ILIKE $${params.length + 1}`;
            params.push(`%${master}%`);
        }
        if (from) {
            query += ` AND date >= $${params.length + 1}`;
            params.push(from);
        }
        if (to) {
            query += ` AND date <= $${params.length + 1}`;
            params.push(to);
        }
        
        const sortField = sort === 'date' ? 'date' : 'id';
        const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(' Ошибка получения:', err);
        res.status(500).json({ error: 'Ошибка базы данных' });
    }
});


app.post('/api/bookings', async (req, res) => {
    try {
        const booking = req.body;
        console.log('📝 Email в заявке:', booking.email);
        console.log(' Новая заявка:', booking);
        
        const checkResult = await pool.query(
            `SELECT id FROM bookings WHERE master = $1 AND date = $2 AND time = $3`,
            [booking.master, booking.date, booking.time]
        );
        
        if (checkResult.rows.length > 0) {
            console.log('Время уже занято:', booking.master, booking.date, booking.time);
            return res.status(409).json({ 
                success: false, 
                error: 'Это время уже занято. Выберите другое время.' 
            });
        }
        
        booking.createdAt = new Date().toISOString();
        const result = await saveBooking(booking);
        
        res.json({ success: true, message: 'Заявка сохранена', id: result.id });
    } catch (err) {
        console.error('Ошибка сохранения:', err);
        res.status(500).json({ success: false, error: 'Ошибка базы данных' });
    }
});


app.get('/api/bookings/check', async (req, res) => {
    try {
        const { master, date } = req.query;
        console.log('🔍 Проверка слотов:', { master, date });
        
        const result = await pool.query(
            `SELECT time FROM bookings WHERE master = $1 AND date = $2`,
            [master, date]
        );
        const times = result.rows.map(row => row.time);
        res.json({ times });
    } catch (err) {
        console.error('❌ Ошибка проверки:', err);
        res.status(500).json({ error: 'Ошибка базы данных' });
    }
});


app.patch('/api/admin/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await pool.query(
            `UPDATE bookings SET status = $1, "updatedAt" = NOW() WHERE id = $2`,
            [status, id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(' Ошибка обновления:', err);
        res.status(500).json({ error: 'Ошибка базы данных' });
    }
});

app.delete('/api/admin/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`DELETE FROM bookings WHERE id = $1`, [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(' Ошибка удаления:', err);
        res.status(500).json({ error: 'Ошибка базы данных' });
    }
});


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
const express = require('express');
const cors = require('cors');
const path = require('path');
const { saveBooking, getAllBookings, pool } = require('./database');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://cheech1ko.github.io']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));


app.get('/api/admin/bookings', async (req, res) => {
    try {
        const bookings = await getAllBookings();
        res.json(bookings);
    } catch (err) {
        console.error(' Ошибка получения:', err);
        res.status(500).json({ error: 'Ошибка базы данных' });
    }
});


app.get('/api/bookings/check', async (req, res) => {
    try {
        const { master, date } = req.query;
        const result = await pool.query(
            `SELECT time FROM bookings WHERE master = $1 AND date = $2`,
            [master, date]
        );
        res.json({ times: result.rows.map(row => row.time) });
    } catch (err) {
        console.error('Ошибка проверки:', err);
        res.status(500).json({ error: 'Ошибка базы данных' });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const booking = req.body;
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

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
const express = require('express');
const cors = require('cors');
const { saveBooking, getAllBookings } = require('./database');

const app = express();
const port = process.env.PORT || 3001;
const existing = await pool.query(
    `SELECT * FROM bookings WHERE master = $1 AND date = $2 AND time = $3`,
    [booking.master, booking.date, booking.time]
);
if (existing.rows.length > 0) {
    return res.status(409).json({ success: false, error: 'Это время уже занято' });
}

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://cheech1ko.github.io']
}));
app.use(express.json());
app.use(express.static('.'));

const path = require('path');
app.use(express.static(path.join(__dirname, '..')));


app.get('/api/admin/bookings', async (req, res) => {
    try {
        const bookings = await getAllBookings();
        res.json(bookings);
    } catch (err) {
        console.error('❌ Ошибка получения:', err);
        res.status(500).json({ error: 'Ошибка базы данных' });
    }
});


app.post('/api/bookings', async (req, res) => {
    try {
        const booking = req.body;
        console.log(' Новая заявка:', booking);

        booking.createdAt = new Date().toISOString();
        const result = await saveBooking(booking);

        res.json({ success: true, message: 'Заявка сохранена', id: result.id });
    } catch (err) {
        console.error(' Ошибка сохранения:', err);
        res.status(500).json({ success: false, error: 'Ошибка базы данных' });
    }
});

app.listen(port, () => {
    console.log(` Сервер запущен на http://localhost:${port}`);
});
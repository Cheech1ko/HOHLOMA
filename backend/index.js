const express = require('express');
const cors = require('cors');
const { saveBooking, getAllBookings } = require('./database');

const app = express();
const port = 3001;

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, '..')));

app.get('/api/admin/bookings', (req, res) => {
    getAllBookings((err, bookings) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Ошибка базы данных' });
        } else {
            res.json(bookings);
        }
    });
});

app.post('/api/bookings', (req, res) => {
    const booking = req.body;
    console.log('📝 Новая заявка:', booking);

    db.get(
        `SELECT * FROM bookings WHERE master = ? AND date = ? AND time = ?`,
        [booking.master, booking.date, booking.time],
        (err, existingBooking) => {
            if (err) {
                console.error('❌ Ошибка проверки:', err);
                return res.status(500).json({ success: false, error: 'Ошибка сервера' });
            }
            
            if (existingBooking) {
                return res.status(409).json({ success: false, error: 'Это время уже занято' });
            }
            
            booking.createdAt = new Date().toISOString();
            saveBooking(booking, (err, result) => {
                if (err) {
                    console.error('❌ Ошибка сохранения:', err);
                    res.status(500).json({ success: false, error: 'Ошибка базы данных' });
                } else {
                    res.json({ success: true, message: 'Заявка сохранена', id: result.id });
                }
            });
        }
    );
});

app.listen(port, () => {
    console.log(` Сервер запущен на http://localhost:${port}`);
});
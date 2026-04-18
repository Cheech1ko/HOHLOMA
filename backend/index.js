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
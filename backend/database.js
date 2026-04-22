const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDB() {
    const query = `
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL,
            master TEXT NOT NULL,
            masterLevel TEXT,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            price INTEGER NOT NULL,
            comment TEXT,
            "createdAt" TIMESTAMP NOT NULL
        )
    `;
    await pool.query(query);
    
    try {
        await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS email TEXT`);
        console.log('✅ Колонка email добавлена');
    } catch (err) {
        console.error('Ошибка добавления email:', err.message);
    }
    try {
        await pool.query(`ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'new'`);
        console.log('✅ Колонка status добавлена');
    } catch (err) {
        if (!err.message.includes('duplicate column')) {
            console.error('Ошибка добавления status:', err.message);
        }
    }
    console.log('✅ База данных PostgreSQL готова');
}

async function saveBooking(booking) {
    const { name, phone, email, service, master, masterLevel, date, time, price, comment, createdAt } = booking;
    const query = `
        INSERT INTO bookings (name, phone, email, service, master, masterLevel, date, time, price, comment, "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
    `;
    const values = [name, phone, email, service, master, masterLevel, date, time, price, comment, createdAt];
    const result = await pool.query(query, values);
    return { id: result.rows[0].id };
}

async function getAllBookings() {
    const query = `SELECT * FROM bookings ORDER BY id DESC`;
    const result = await pool.query(query);
    return result.rows;
}

module.exports = { saveBooking, getAllBookings, pool };
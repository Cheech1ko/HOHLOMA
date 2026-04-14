const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'bookings.db');
const db = new sqlite3.Database(dbPath);


db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        service TEXT NOT NULL,
        master TEXT NOT NULL,
        masterLevel TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        price INTEGER NOT NULL,
        comment TEXT,
        createdAt TEXT NOT NULL
    )
`);


function saveBooking(booking, callback) {
    const { name, phone, service, master, masterLevel, date, time, price, comment, createdAt } = booking;
    
    db.run(
        `INSERT INTO bookings (name, phone, service, master, masterLevel, date, time, price, comment, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, phone, service, master, masterLevel, date, time, price, comment, createdAt],
        function(err) {
            if (err) {
                console.error('❌ Ошибка сохранения:', err.message);
                callback(err, null);
            } else {
                callback(null, { id: this.lastID });
            }
        }
    );
}


function getAllBookings(callback) {
    db.all(`SELECT * FROM bookings ORDER BY id DESC`, [], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}


module.exports = { saveBooking, getAllBookings };
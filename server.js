require('dotenv').config();

const app = require('./app');
const pool = require('./config/database');

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
    try {
        await pool.query('SELECT 1');

        console.log('Koneksi MySQL berhasil!');

        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Gagal menjalankan server:', error.message);
        process.exit(1);
    }
}

startServer();

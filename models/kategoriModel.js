const pool = require('../config/database');

exports.getAllKategori = async () => {
    const [rows] = await pool.execute(
        'SELECT id, nama, deskripsi FROM kategori ORDER BY id DESC'
    );

    return rows;
};

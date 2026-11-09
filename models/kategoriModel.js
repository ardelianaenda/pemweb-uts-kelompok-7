const pool = require('../config/database');

exports.getAllKategori = async () => {
    const [rows] = await pool.execute(
        'SELECT id, nama, deskripsi FROM kategori ORDER BY id DESC'
    );

    return rows;
};

exports.createKategori = async (nama, deskripsi) => {
    const sql = `
        INSERT INTO kategori (nama, deskripsi)
        VALUES (?, ?)
    `;

    const [result] = await pool.execute(sql, [
        nama,
        deskripsi
    ]);

    return result.insertId;
};


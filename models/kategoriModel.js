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

exports.getKategoriById = async (id) => {
    const sql = `
        SELECT id, nama, deskripsi
        FROM kategori
        WHERE id = ?
    `;

    const [rows] = await pool.execute(sql, [id]);

    return rows[0] || null;
};

exports.updateKategori = async (id, nama, deskripsi) => {
    const sql = `
        UPDATE kategori
        SET nama = ?, deskripsi = ?
        WHERE id = ?
    `;

    const [result] = await pool.execute(sql, [
        nama,
        deskripsi,
        id
    ]);

    return result.affectedRows;
};


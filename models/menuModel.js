const database = require('../config/database');
const pool = database.pool || database;

const db = typeof pool.promise === 'function'
  ? pool.promise()
  : pool;

// READ: menampilkan semua menu
async function getAll() {
  const [rows] = await db.execute(`
    SELECT
      m.id, m.nama, m.kategori_id,
      m.harga, m.stok, m.gambar,
      k.nama AS nama_kategori
    FROM menu m
    LEFT JOIN kategori k ON m.kategori_id = k.id
    ORDER BY m.id DESC
  `);

  return rows;
}

// READ: mengambil satu menu untuk edit
async function getById(id) {
  const [rows] = await db.execute(
    'SELECT * FROM menu WHERE id = ?',
    [id]
  );

  return rows[0];
}

// Mengambil kategori untuk dropdown
async function getKategori() {
  const [rows] = await db.execute(
    'SELECT id, nama FROM kategori ORDER BY id'
  );

  return rows;
}

// Mengecek kategori ada atau tidak
async function kategoriExists(id) {
  const [rows] = await db.execute(
    'SELECT id FROM kategori WHERE id = ?',
    [id]
  );

  return rows.length > 0;
}

// CREATE
async function create(data) {
  const [result] = await db.execute(
    `INSERT INTO menu
     (kategori_id, nama, harga, stok, gambar)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.kategori_id,
      data.nama,
      data.harga,
      data.stok,
      data.gambar
    ]
  );

  return result;
}

// UPDATE
async function update(id, data) {
  const [result] = await db.execute(
    `UPDATE menu
     SET kategori_id = ?, nama = ?,
         harga = ?, stok = ?, gambar = ?
     WHERE id = ?`,
    [
      data.kategori_id,
      data.nama,
      data.harga,
      data.stok,
      data.gambar,
      id
    ]
  );

  return result;
}

// DELETE
async function remove(id) {
  const [result] = await db.execute(
    'DELETE FROM menu WHERE id = ?',
    [id]
  );

  return result;
}

module.exports = {
  getAll,
  getById,
  getKategori,
  kategoriExists,
  create,
  update,
  remove
};

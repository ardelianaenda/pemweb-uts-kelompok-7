
const db = require('../config/database');

// READ semua pesanan
async function getAll() {
  const [rows] = await db.execute(`
    SELECT
      p.id,
      p.menu_id,
      p.pelanggan_id,
      p.meja_id,
      p.jumlah,
      p.status,
      p.tanggal_pesanan,
      m.nama AS nama_menu,
      m.harga,
      pl.nama AS nama_pelanggan,
      mj.nomor_meja,
      (m.harga * p.jumlah) AS subtotal
    FROM pesanan p
    JOIN menu m ON p.menu_id = m.id
    JOIN pelanggan pl ON p.pelanggan_id = pl.id
    JOIN meja mj ON p.meja_id = mj.id
    ORDER BY p.id DESC
  `);

  return rows;
}

// READ satu pesanan
async function getById(id) {
  const [rows] = await db.execute(
    'SELECT * FROM pesanan WHERE id = ?',
    [id]
  );

  return rows[0];
}

// Dropdown dari anggota 2, 3, dan 4
async function getOptions() {
  const [menu] = await db.execute(
    'SELECT id, nama, harga, stok FROM menu ORDER BY nama'
  );

  const [pelanggan] = await db.execute(
    'SELECT id, nama FROM pelanggan ORDER BY nama'
  );

  const [meja] = await db.execute(
    'SELECT id, nomor_meja FROM meja ORDER BY nomor_meja'
  );

  return { menu, pelanggan, meja };
}

// CREATE
async function create(data) {
  const [result] = await db.execute(
    `INSERT INTO pesanan
    (menu_id, pelanggan_id, meja_id, jumlah, status)
    VALUES (?, ?, ?, ?, ?)`,
    [
      data.menu_id,
      data.pelanggan_id,
      data.meja_id,
      data.jumlah,
      data.status
    ]
  );

  return result;
}

// UPDATE
async function update(id, data) {
  const [result] = await db.execute(
    `UPDATE pesanan
     SET menu_id = ?,
         pelanggan_id = ?,
         meja_id = ?,
         jumlah = ?,
         status = ?
     WHERE id = ?`,
    [
      data.menu_id,
      data.pelanggan_id,
      data.meja_id,
      data.jumlah,
      data.status,
      id
    ]
  );

  return result;
}

// DELETE
async function remove(id) {
  const [result] = await db.execute(
    'DELETE FROM pesanan WHERE id = ?',
    [id]
  );

  return result;
}

module.exports = {
  getAll,
  getById,
  getOptions,
  create,
  update,
  remove
};

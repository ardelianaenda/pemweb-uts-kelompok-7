
const db = require('../config/database');

// READ - Mengambil semua pelanggan
const getAllPelanggan = async () => {
  const [rows] = await db.execute(
    'SELECT id, nama, no_hp FROM pelanggan ORDER BY id ASC'
  );
  return rows;
};

// READ - Mengambil satu pelanggan berdasarkan ID
const getPelangganById = async (id) => {
  const [rows] = await db.execute(
    'SELECT id, nama, no_hp FROM pelanggan WHERE id = ?',
    [id]
  );
  return rows[0];
};

// CREATE - Menambah pelanggan baru
const tambahPelanggan = async (nama, no_hp) => {
  const [result] = await db.execute(
    'INSERT INTO pelanggan (nama, no_hp) VALUES (?, ?)',
    [nama, no_hp]
  );
  return result;
};

// UPDATE - Mengubah data pelanggan
const updatePelanggan = async (id, nama, no_hp) => {
  const [result] = await db.execute(
    'UPDATE pelanggan SET nama = ?, no_hp = ? WHERE id = ?',
    [nama, no_hp, id]
  );
  return result;
};

// DELETE - Menghapus pelanggan
const hapusPelanggan = async (id) => {
  const [result] = await db.execute(
    'DELETE FROM pelanggan WHERE id = ?',
    [id]
  );
  return result;
};

module.exports = {
  getAllPelanggan,
  getPelangganById,
  tambahPelanggan,
  updatePelanggan,
  hapusPelanggan
};


const pool = require('../config/database');

// READ: mengambil semua meja
async function getAllMeja() {
  const [rows] = await pool.execute(
    'SELECT id, nomor_meja, kapasitas, status FROM meja ORDER BY id ASC'
  );
  return rows;
}

// READ: mengambil satu meja berdasarkan ID
async function getMejaById(id) {
  const [rows] = await pool.execute(
    'SELECT id, nomor_meja, kapasitas, status FROM meja WHERE id = ?',
    [id]
  );
  return rows[0];
}

// CREATE: menambah meja
async function createMeja(data) {
  const [result] = await pool.execute(
    'INSERT INTO meja (nomor_meja, kapasitas, status) VALUES (?, ?, ?)',
    [data.nomor_meja, data.kapasitas, data.status]
  );
  return result;
}

// UPDATE: mengubah meja
async function updateMeja(id, data) {
  const [result] = await pool.execute(
    'UPDATE meja SET nomor_meja = ?, kapasitas = ?, status = ? WHERE id = ?',
    [data.nomor_meja, data.kapasitas, data.status, id]
  );
  return result;
}

// DELETE: menghapus meja
async function deleteMeja(id) {
  const [result] = await pool.execute(
    'DELETE FROM meja WHERE id = ?',
    [id]
  );
  return result;
}

module.exports = {
  getAllMeja,
  getMejaById,
  createMeja,
  updateMeja,
  deleteMeja
};


const mejaModel = require('../models/mejaModel');

const daftarStatus = ['tersedia', 'terisi', 'reservasi'];

// Memeriksa ID dari URL
function ambilId(req) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

// Validasi input dari formulir
function validasiMeja(body) {
  const nomor_meja = String(body.nomor_meja || '').trim();
  const kapasitas = Number(body.kapasitas);
  const status = String(body.status || '').trim().toLowerCase();

  if (!nomor_meja || nomor_meja.length > 20) {
    return { error: 'Nomor meja wajib diisi, maksimal 20 karakter.' };
  }

  if (!Number.isInteger(kapasitas) || kapasitas < 1) {
    return { error: 'Kapasitas harus berupa angka minimal 1.' };
  }

  if (!daftarStatus.includes(status)) {
    return { error: 'Status meja tidak valid.' };
  }

  return {
    data: { nomor_meja, kapasitas, status }
  };
}

// READ: menampilkan semua meja
async function index(req, res) {
  const daftarMeja = await mejaModel.getAllMeja();

  res.render('meja/index', {
    title: 'Manajemen Meja - Sunday Cafe',
    daftarMeja,
    pesan: req.query.pesan || ''
  });
}

// Menampilkan form tambah
function formTambah(req, res) {
  res.render('meja/create', {
    title: 'Tambah Meja - Sunday Cafe',
    pesan: req.query.pesan || ''
  });
}

// CREATE: menyimpan meja baru
async function tambah(req, res) {
  const hasil = validasiMeja(req.body);

  if (hasil.error) {
    return res.redirect(
      '/meja/tambah?pesan=' + encodeURIComponent(hasil.error)
    );
  }

  try {
    await mejaModel.createMeja(hasil.data);

    return res.redirect(
      '/meja?pesan=' + encodeURIComponent('Meja berhasil ditambahkan.')
    );
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.redirect(
        '/meja/tambah?pesan=' +
        encodeURIComponent('Nomor meja sudah digunakan.')
      );
    }

    throw error;
  }
}

// Menampilkan form edit
async function formEdit(req, res) {
  const id = ambilId(req);

  if (!id) {
    return res.redirect('/meja?pesan=ID tidak valid');
  }

  const meja = await mejaModel.getMejaById(id);

  if (!meja) {
    return res.redirect('/meja?pesan=Meja tidak ditemukan');
  }

  res.render('meja/edit', {
    meja,
    pesan: req.query.pesan || ''
  });
}

// UPDATE: menyimpan perubahan meja
async function edit(req, res) {
  const id = ambilId(req);

  if (!id) {
    return res.redirect('/meja?pesan=ID tidak valid');
  }

  const hasil = validasiMeja(req.body);

  if (hasil.error) {
    return res.redirect(
      '/meja/edit/' + id + '?pesan=' + encodeURIComponent(hasil.error)
    );
  }

  try {
    const result = await mejaModel.updateMeja(id, hasil.data);

    if (result.affectedRows === 0) {
      return res.redirect('/meja?pesan=Meja tidak ditemukan');
    }

    return res.redirect(
      '/meja?pesan=' + encodeURIComponent('Meja berhasil diperbarui.')
    );
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.redirect(
        '/meja/edit/' + id + '?pesan=' +
        encodeURIComponent('Nomor meja sudah digunakan.')
      );
    }

    throw error;
  }
}

// DELETE: menghapus meja
async function hapus(req, res) {
  const id = ambilId(req);

  if (!id) {
    return res.redirect('/meja?pesan=ID tidak valid');
  }

  try {
    const result = await mejaModel.deleteMeja(id);

    if (result.affectedRows === 0) {
      return res.redirect('/meja?pesan=Meja tidak ditemukan');
    }

    return res.redirect(
      '/meja?pesan=' + encodeURIComponent('Meja berhasil dihapus.')
    );
  } catch (error) {
    if (
      error.code === 'ER_ROW_IS_REFERENCED_2' ||
      error.code === 'ER_ROW_IS_REFERENCED'
    ) {
      return res.redirect(
        '/meja?pesan=' +
        encodeURIComponent('Meja masih digunakan dalam pesanan.')
      );
    }

    throw error;
  }
}

module.exports = {
  index,
  formTambah,
  tambah,
  formEdit,
  edit,
  hapus
};

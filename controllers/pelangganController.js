
const pelangganModel = require('../models/pelangganModel');

// Validasi input pelanggan
const validasiPelanggan = (nama, no_hp) => {
  if (!nama || nama.length > 100) {
    return 'Nama wajib diisi, maksimal 100 karakter.';
  }

  if (!/^08\d{8,13}$/.test(no_hp)) {
    return 'Nomor HP harus 10-15 digit dan diawali 08.';
  }

  return null;
};

// READ - Menampilkan daftar pelanggan
exports.index = async (req, res, next) => {
  try {
    const daftarPelanggan =
      await pelangganModel.getAllPelanggan();


    res.render('pelanggan/index', {
        title: 'Data Pelanggan',
        daftarPelanggan,
        pesan: req.query.pesan || '',
        error: req.query.error || ''
    });

  } catch (error) {
    next(error);
  }
};

// Menampilkan form tambah

exports.formTambah = (req, res) => {
  res.render('pelanggan/create', {
    title: 'Tambah Pelanggan',
    error: req.query.error || ''
  });
};


// CREATE - Menyimpan pelanggan
exports.tambah = async (req, res) => {
  const nama = String(req.body.nama || '').trim();
  const no_hp = String(req.body.no_hp || '').trim();

  const pesanError = validasiPelanggan(nama, no_hp);

  if (pesanError) {
    return res.redirect(
      '/pelanggan/tambah?error=' +
      encodeURIComponent(pesanError)
    );
  }

  try {
    await pelangganModel.tambahPelanggan(nama, no_hp);

    return res.redirect(
      '/pelanggan?pesan=' +
      encodeURIComponent('Pelanggan berhasil ditambahkan.')
    );
  } catch (error) {
    console.error(error);

    return res.redirect(
      '/pelanggan/tambah?error=' +
      encodeURIComponent('Gagal menambah pelanggan.')
    );
  }
};

// Menampilkan form edit
exports.formEdit = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).send('ID tidak valid.');
    }

    const pelanggan =
      await pelangganModel.getPelangganById(id);

    if (!pelanggan) {
      return res.status(404).send('Pelanggan tidak ditemukan.');
    }


    res.render('pelanggan/edit', {
        title: 'Edit Pelanggan',
        pelanggan,
        error: req.query.error || ''
    });

  } catch (error) {
    next(error);
  }
};

// UPDATE - Menyimpan perubahan
exports.edit = async (req, res) => {
  const id = Number(req.params.id);
  const nama = String(req.body.nama || '').trim();
  const no_hp = String(req.body.no_hp || '').trim();

  if (!Number.isInteger(id) || id <= 0) {
    return res.redirect('/pelanggan?error=ID tidak valid');
  }

  const pesanError = validasiPelanggan(nama, no_hp);

  if (pesanError) {
    return res.redirect(
      '/pelanggan/edit/' + id +
      '?error=' + encodeURIComponent(pesanError)
    );
  }

  try {
    const result =
      await pelangganModel.updatePelanggan(id, nama, no_hp);

    if (result.affectedRows === 0) {
      return res.redirect(
        '/pelanggan?error=' +
        encodeURIComponent('Pelanggan tidak ditemukan.')
      );
    }

    return res.redirect(
      '/pelanggan?pesan=' +
      encodeURIComponent('Pelanggan berhasil diubah.')
    );
  } catch (error) {
    console.error(error);

    return res.redirect(
      '/pelanggan/edit/' + id +
      '?error=' +
      encodeURIComponent('Gagal mengubah pelanggan.')
    );
  }
};

// DELETE - Menghapus pelanggan
exports.hapus = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.redirect(
      '/pelanggan?error=' +
      encodeURIComponent('ID tidak valid.')
    );
  }

  try {
    const result =
      await pelangganModel.hapusPelanggan(id);

    if (result.affectedRows === 0) {
      return res.redirect(
        '/pelanggan?error=' +
        encodeURIComponent('Pelanggan tidak ditemukan.')
      );
    }

    return res.redirect(
      '/pelanggan?pesan=' +
      encodeURIComponent('Pelanggan berhasil dihapus.')
    );
  } catch (error) {
    console.error(error);

    const pesan = error.code === 'ER_ROW_IS_REFERENCED_2'
      ? 'Pelanggan masih digunakan dalam pesanan.'
      : 'Gagal menghapus pelanggan.';

    return res.redirect(
      '/pelanggan?error=' + encodeURIComponent(pesan)
    );
  }
};

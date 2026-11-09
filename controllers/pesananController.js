
const Pesanan = require('../models/pesananModel');

const statusValid = [
  'baru',
  'diproses',
  'selesai',
  'dibatalkan'
];

const messages = {
  tambah: 'Pesanan berhasil ditambahkan!',
  ubah: 'Pesanan berhasil diperbarui!',
  hapus: 'Pesanan berhasil dihapus!',
  invalid: 'Data tidak valid. Periksa formulir.',
  relasi: 'Menu, pelanggan, atau meja tidak ditemukan.',
  tidakAda: 'Pesanan tidak ditemukan.',
  id: 'ID pesanan tidak valid.',
  gagal: 'Pesanan gagal disimpan. Periksa kembali data.'
};

function pesan(req) {
  return messages[req.query.msg] || null;
}

function validId(value) {
  const teks = String(value ?? '');
  const angka = Number(teks);

  if (
    !/^[1-9]\d*$/.test(teks) ||
    !Number.isSafeInteger(angka)
  ) {
    return null;
  }

  return angka;
}

function validasi(body) {
  const menu_id = validId(body.menu_id);
  const pelanggan_id = validId(body.pelanggan_id);
  const meja_id = validId(body.meja_id);
  const jumlah = validId(body.jumlah);
  const status = String(body.status || '').trim();

  if (!menu_id || !pelanggan_id || !meja_id || !jumlah) {
    return null;
  }

  if (jumlah > 2147483647) {
    return null;
  }

  if (!statusValid.includes(status)) {
    return null;
  }

  return {
    menu_id,
    pelanggan_id,
    meja_id,
    jumlah,
    status
  };
}

function pilihanAda(options, data) {
  return (
    options.menu.some(m => m.id === data.menu_id) &&
    options.pelanggan.some(p => p.id === data.pelanggan_id) &&
    options.meja.some(m => m.id === data.meja_id)
  );
}

// READ
exports.index = async (req, res) => {
  const pesanan = await Pesanan.getAll();

  res.render('pesanan/index', {
    title: 'Data Pesanan - Sunday Cafe',
    pesanan,
    pesan: pesan(req)
  });
};

// FORM CREATE
exports.formTambah = async (req, res) => {
  const options = await Pesanan.getOptions();

  res.render('pesanan/create', {
    title: 'Tambah Pesanan - Sunday Cafe',
    ...options,
    pesan: pesan(req)
  });
};

// CREATE
exports.tambah = async (req, res) => {
  const data = validasi(req.body);

  if (!data) {
    return res.redirect('/pesanan/tambah?msg=invalid');
  }

  const options = await Pesanan.getOptions();

  if (!pilihanAda(options, data)) {
    return res.redirect('/pesanan/tambah?msg=relasi');
  }

  try {
    await Pesanan.create(data);
    return res.redirect('/pesanan?msg=tambah');
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.redirect('/pesanan/tambah?msg=relasi');
    }

    throw error;
  }
};

// FORM EDIT
exports.formEdit = async (req, res) => {
  const id = validId(req.params.id);

  if (!id) {
    return res.redirect('/pesanan?msg=id');
  }

  const data = await Pesanan.getById(id);

  if (!data) {
    return res.redirect('/pesanan?msg=tidakAda');
  }

  const options = await Pesanan.getOptions();

  res.render('pesanan/edit', {
    title: 'Edit Pesanan - Sunday Cafe',
    data,
    ...options,
    pesan: pesan(req)
  });
};

// UPDATE
exports.edit = async (req, res) => {
  const id = validId(req.params.id);

  if (!id) {
    return res.redirect('/pesanan?msg=id');
  }

  const existing = await Pesanan.getById(id);

  if (!existing) {
    return res.redirect('/pesanan?msg=tidakAda');
  }

  const data = validasi(req.body);

  if (!data) {
    return res.redirect(`/pesanan/edit/${id}?msg=invalid`);
  }

  const options = await Pesanan.getOptions();

  if (!pilihanAda(options, data)) {
    return res.redirect(`/pesanan/edit/${id}?msg=relasi`);
  }

  try {
    const result = await Pesanan.update(id, data);

    if (result.affectedRows === 0) {
      return res.redirect('/pesanan?msg=tidakAda');
    }

    return res.redirect('/pesanan?msg=ubah');
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.redirect(`/pesanan/edit/${id}?msg=relasi`);
    }

    throw error;
  }
};

// DELETE
exports.hapus = async (req, res) => {
  const id = validId(req.params.id);

  if (!id) {
    return res.redirect('/pesanan?msg=id');
  }

  const result = await Pesanan.remove(id);

  if (result.affectedRows === 0) {
    return res.redirect('/pesanan?msg=tidakAda');
  }

  return res.redirect('/pesanan?msg=hapus');
};

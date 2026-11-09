const Menu = require('../models/menuModel');

function validId(value) {
  const teks = String(value ?? '');
  const angka = Number(teks);

  if (!/^[1-9]\d*$/.test(teks) ||
      !Number.isSafeInteger(angka)) {
    return null;
  }

  return angka;
}

function validasi(body) {
  const nama = String(body.nama ?? '').trim();
  const kategori_id = validId(body.kategori_id);
  const harga = String(body.harga ?? '').trim();
  const stokTeks = String(body.stok ?? '').trim();
  const stok = Number(stokTeks);
  const gambarTeks = String(body.gambar ?? '').trim();

  if (!nama || nama.length > 100) return null;
  if (!kategori_id) return null;

  if (!/^(0|[1-9]\d{0,7})(\.\d{1,2})?$/.test(harga)) {
    return null;
  }

  if (!/^(0|[1-9]\d*)$/.test(stokTeks) ||
      !Number.isSafeInteger(stok) ||
      stok > 2147483647) {
    return null;
  }

  if (gambarTeks &&
      !/^\/images\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i
        .test(gambarTeks)) {
    return null;
  }

  return {
    nama,
    kategori_id,
    harga,
    stok,
    gambar: gambarTeks || null
  };
}

const messages = {
  tambah: 'Menu berhasil ditambahkan!',
  ubah: 'Menu berhasil diperbarui!',
  hapus: 'Menu berhasil dihapus!',
  invalid: 'Data tidak valid. Periksa semua kolom.',
  kategori: 'Kategori tidak ditemukan.',
  tidakAda: 'Menu tidak ditemukan.',
  dipakai: 'Menu sedang digunakan pada pesanan.',
  id: 'ID menu tidak valid.'
};

function pesan(req) {
  return messages[req.query.msg] || null;
}

// READ
exports.index = async (req, res) => {
  const menus = await Menu.getAll();

  res.render('menu/index', {
    menus,
    pesan: pesan(req)
  });
};

// FORM CREATE
exports.formCreate = async (req, res) => {
  const kategori = await Menu.getKategori();

  res.render('menu/create', {
    kategori,
    pesan: pesan(req)
  });
};

// SIMPAN CREATE
exports.store = async (req, res) => {
  const data = validasi(req.body);

  if (!data) {
    return res.redirect('/menu/tambah?msg=invalid');
  }

  if (!(await Menu.kategoriExists(data.kategori_id))) {
    return res.redirect('/menu/tambah?msg=kategori');
  }

  await Menu.create(data);

  return res.redirect('/menu?msg=tambah');
};

// FORM EDIT
exports.formEdit = async (req, res) => {
  const id = validId(req.params.id);

  if (!id) {
    return res.redirect('/menu?msg=id');
  }

  const menu = await Menu.getById(id);

  if (!menu) {
    return res.redirect('/menu?msg=tidakAda');
  }

  const kategori = await Menu.getKategori();

  res.render('menu/edit', {
    menu,
    kategori,
    pesan: pesan(req)
  });
};

// SIMPAN UPDATE
exports.update = async (req, res) => {
  const id = validId(req.params.id);

  if (!id) {
    return res.redirect('/menu?msg=id');
  }

  const data = validasi(req.body);

  if (!data) {
    return res.redirect(
      `/menu/edit/${id}?msg=invalid`
    );
  }

  if (!(await Menu.kategoriExists(data.kategori_id))) {
    return res.redirect(
      `/menu/edit/${id}?msg=kategori`
    );
  }

  const result = await Menu.update(id, data);

  if (result.affectedRows === 0) {
    return res.redirect('/menu?msg=tidakAda');
  }

  return res.redirect('/menu?msg=ubah');
};

// DELETE
exports.destroy = async (req, res) => {
  const id = validId(req.params.id);

  if (!id) {
    return res.redirect('/menu?msg=id');
  }

  try {
    const result = await Menu.remove(id);

    if (result.affectedRows === 0) {
      return res.redirect('/menu?msg=tidakAda');
    }

    return res.redirect('/menu?msg=hapus');
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' ||
        error.errno === 1451) {
      return res.redirect('/menu?msg=dipakai');
    }

    throw error;
  }
};

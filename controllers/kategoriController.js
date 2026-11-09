const kategoriModel = require('../models/kategoriModel');

exports.index = async (req, res, next) => {
    try {
        const kategori = await kategoriModel.getAllKategori();
        
        res.render('kategori/index', {
            title: 'Kategori Menu - Sunday Cafe',
            kategori: kategori,
            successMessage: req.query.success === 'ditambah'
            ? 'Kategori baru berhasil ditambahkan!'
            : null
        });


    } catch (error) {
        next(error);
    }
};

exports.createForm = (req, res) => {
    let errorMessage = null;

    if (req.query.error === 'validasi') {
        errorMessage = 'Nama kategori wajib diisi (maksimal 100 karakter), dan deskripsi maksimal 500 karakter.';
    }

    if (req.query.error === 'duplikat') {
        errorMessage = 'Nama kategori sudah tersedia. Gunakan nama lain.';
    }

    res.render('kategori/create', {
        title: 'Tambah Kategori - Sunday Cafe',
        errorMessage
    });
};

exports.store = async (req, res, next) => {
    try {
        const nama = typeof req.body.nama === 'string'
            ? req.body.nama.trim()
            : '';

        const deskripsi = typeof req.body.deskripsi === 'string'
            ? req.body.deskripsi.trim()
            : '';

        if (
            !nama ||
            nama.length > 100 ||
            deskripsi.length > 500
        ) {
            return res.redirect('/kategori/tambah?error=validasi');
        }

        await kategoriModel.createKategori(
            nama,
            deskripsi || null
        );

        return res.redirect('/kategori?success=ditambah');

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.redirect('/kategori/tambah?error=duplikat');
        }

        next(error);
    }
};


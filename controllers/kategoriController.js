const kategoriModel = require('../models/kategoriModel');

exports.index = async (req, res, next) => {
    try {
        const kategori = await kategoriModel.getAllKategori();
        res.render('kategori/index', {
            title: 'Kategori Menu - Sunday Cafe',
            kategori: kategori,
            successMessage:
            req.query.success === 'ditambah'
            ? 'Kategori baru berhasil ditambahkan!'
            : req.query.success === 'diubah'
            ? 'Kategori berhasil diperbarui!'
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

function ambilIdKategori(req) {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

function kategoriTidakDitemukan() {
    const error = new Error('Kategori tidak ditemukan.');
    error.status = 404;
    return error;
}

exports.editForm = async (req, res, next) => {
    try {
        const id = ambilIdKategori(req);

        if (!id) {
            return next(kategoriTidakDitemukan());
        }

        const kategori = await kategoriModel.getKategoriById(id);

        if (!kategori) {
            return next(kategoriTidakDitemukan());
        }

        let errorMessage = null;

        if (req.query.error === 'validasi') {
            errorMessage =
                'Nama kategori wajib diisi, maksimal 100 karakter. Deskripsi maksimal 500 karakter.';
        }

        if (req.query.error === 'duplikat') {
            errorMessage =
                'Nama kategori sudah digunakan. Gunakan nama lain.';
        }

        res.render('kategori/edit', {
            title: 'Edit Kategori - Sunday Cafe',
            kategori,
            errorMessage
        });

    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    const id = ambilIdKategori(req);

    if (!id) {
        return next(kategoriTidakDitemukan());
    }

    try {
        const kategori = await kategoriModel.getKategoriById(id);

        if (!kategori) {
            return next(kategoriTidakDitemukan());
        }

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
            return res.redirect(
                303,
                `/kategori/edit/${id}?error=validasi`
            );
        }
        
        const affectedRows = await kategoriModel.updateKategori(
            id,
            nama,
            deskripsi || null
        );

        if (affectedRows === 0) {
            return next(kategoriTidakDitemukan());
        }

        return res.redirect(
            303,
            '/kategori?success=diubah'
        );

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.redirect(
                303,
                `/kategori/edit/${id}?error=duplikat`
            );
        }

        next(error);
    }
};


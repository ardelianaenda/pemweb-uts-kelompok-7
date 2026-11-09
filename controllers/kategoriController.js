const kategoriModel = require('../models/kategoriModel');

exports.index = async (req, res, next) => {
    try {
        const kategori = await kategoriModel.getAllKategori();

        res.render('kategori/index', {
            title: 'Kategori Menu - Sunday Cafe',
            kategori: kategori
        });

    } catch (error) {
        next(error);
    }
};

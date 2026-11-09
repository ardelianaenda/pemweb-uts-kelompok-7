
const express = require('express');
const router = express.Router();

const kategoriController =
    require('../controllers/kategoriController');

router.get('/', kategoriController.index);

router.get('/tambah', kategoriController.createForm);
router.post('/tambah', kategoriController.store);

router.get('/edit/:id', kategoriController.editForm);
router.post('/edit/:id', kategoriController.update);

router.post('/hapus/:id', kategoriController.destroy);

module.exports = router;

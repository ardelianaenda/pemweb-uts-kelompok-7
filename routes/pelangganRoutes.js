
const express = require('express');
const router = express.Router();

const pelangganController =
  require('../controllers/pelangganController');

// READ
router.get('/', pelangganController.index);

// CREATE
router.get('/tambah', pelangganController.formTambah);
router.post('/tambah', pelangganController.tambah);

// UPDATE
router.get('/edit/:id', pelangganController.formEdit);
router.post('/edit/:id', pelangganController.edit);

// DELETE
router.post('/hapus/:id', pelangganController.hapus);

module.exports = router;

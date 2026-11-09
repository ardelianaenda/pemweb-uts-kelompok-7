
const express = require('express');
const router = express.Router();
const mejaController = require('../controllers/mejaController');

// Meneruskan error async ke middleware Express
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// READ
router.get('/', asyncHandler(mejaController.index));

// CREATE
router.get('/tambah', mejaController.formTambah);
router.post('/tambah', asyncHandler(mejaController.tambah));

// UPDATE
router.get('/edit/:id', asyncHandler(mejaController.formEdit));
router.post('/edit/:id', asyncHandler(mejaController.edit));

// DELETE
router.post('/hapus/:id', asyncHandler(mejaController.hapus));

module.exports = router;

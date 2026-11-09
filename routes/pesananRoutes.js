
const express = require('express');
const router = express.Router();

const controller = require('../controllers/pesananController');

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// READ
router.get('/', asyncHandler(controller.index));

// CREATE
router.get('/tambah', asyncHandler(controller.formTambah));
router.post('/tambah', asyncHandler(controller.tambah));

// UPDATE
router.get('/edit/:id', asyncHandler(controller.formEdit));
router.post('/edit/:id', asyncHandler(controller.edit));

// DELETE
router.post('/hapus/:id', asyncHandler(controller.hapus));

module.exports = router;

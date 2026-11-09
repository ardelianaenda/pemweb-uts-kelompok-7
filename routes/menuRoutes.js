const express = require('express');
const router = express.Router();

const controller = require('../controllers/menuController');

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// READ
router.get('/', asyncHandler(controller.index));

// CREATE
router.get('/tambah', asyncHandler(controller.formCreate));
router.post('/tambah', asyncHandler(controller.store));

// UPDATE
router.get('/edit/:id', asyncHandler(controller.formEdit));
router.post('/edit/:id', asyncHandler(controller.update));

// DELETE
router.post('/hapus/:id', asyncHandler(controller.destroy));

module.exports = router;

const express = require('express');
const router = express.Router();

const kategoriController = require('../controllers/kategoriController');

router.get('/', kategoriController.index);

router.get('/tambah', kategoriController.createForm);

router.post('/tambah', kategoriController.store);

module.exports = router;

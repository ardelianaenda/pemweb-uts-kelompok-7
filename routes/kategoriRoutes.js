const express = require('express');
const router = express.Router();

const kategoriController = require('../controllers/kategoriController');

router.get('/', kategoriController.index);

module.exports = router;

const express = require('express');
const path = require('path');

const dashboardRoutes = require('./routes/dashboardRoutes');
const errorHandler = require('./middlewares/errorHandler');

const kategoriRoutes = require('./routes/kategoriRoutes');
const menuRoutes = require('./routes/menuRoutes');
const pelangganRoutes = require('./routes/pelangganRoutes');
const mejaRoutes = require('./routes/mejaRoutes');
const pesananRoutes = require('./routes/pesananRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// CRUD Kategori - Anggota 1
app.use('/kategori', kategoriRoutes);

// CRUD Menu - Anggota 2
app.use('/menu', menuRoutes);

// CRUD Pelanggan - Anggota 3
app.use('/pelanggan', pelangganRoutes);

// CRUD Meja - Anggota 4
app.use('/meja', mejaRoutes);

// CRUD Pesanan - Anggota 5
app.use('/pesanan', pesananRoutes);

// Dashboard Sunday Cafe
app.use('/', dashboardRoutes);

// Halaman tidak ditemukan
app.use((req, res, next) => {
    const error = new Error('Halaman tidak ditemukan');
    error.status = 404;
    next(error);
});

app.use(errorHandler);

module.exports = app;

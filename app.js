const express = require('express');
const path = require('path');

const dashboardRoutes = require('./routes/dashboardRoutes');
const errorHandler = require('./middlewares/errorHandler');
const kategoriRoutes = require('./routes/kategoriRoutes');
const mejaRoutes = require('./routes/mejaRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', dashboardRoutes);
app.use('/kategori', kategoriRoutes);
app.use('/meja', mejaRoutes);

app.use((req, res, next) => {
    const error = new Error('Halaman tidak ditemukan');
    error.status = 404;
    next(error);
});

app.use(errorHandler);

module.exports = app;

module.exports = (err, req, res, next) => {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    const status = err.status || 500;

    res.status(status).render('error', {
        title: `Error ${status}`,
        status: status,
        message: status === 500
            ? 'Terjadi kesalahan pada server.'
            : err.message
    });
};

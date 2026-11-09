exports.index = (req, res) => {
    res.render('home', {
        title: 'Sunday Cafe',
        activePage: 'home'
    });
};
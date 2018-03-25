let router = require('express').Router();
router
    .use('/users', require('./users/index'))
    .use('/admin', require('./admin/index'))
    .get('/logout', (req, res, next) => {
        delete req.session.user;
        res.redirect('/users/login');
    })
module.exports = router;
let router = require('express').Router();
router
    .use('/', require('./users/index'))
    .use('/admin', require('./admin/index'))
    .get('/logout', (req, res, next) => {
        delete req.session.user;
        res.redirect('/');
    })
module.exports = router;
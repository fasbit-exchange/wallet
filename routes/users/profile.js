let router = require('express').Router();
router.get('/', async (req, res, next) => {
    res.render('users/profile', {layout: 'template'})
});
module.exports = router;
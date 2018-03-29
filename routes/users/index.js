
let router = require('express').Router();
let auth = require('../../middlewares/auth');
let indexController = require('../../controllers/users/index');
router
    .use('/profile', auth.authUser, require('./profile'))
    .get('/dashboard', auth.authUser, indexController.dashboard)
    .get('/transaction', auth.authUser, indexController.transaction)
    .post('/transact', auth.authUser, indexController.transact)
    .get('/refresh', auth.authUser, indexController.refreshWallet)
    .get('/receive', auth.authUser, indexController.receive)
    .get('/send', auth.authUser, indexController.send)
    .get('/', async (req, res, next) => {
        let login_error = req.session.login_error;
        let register_sucesss = req.session.register_sucesss;
        delete req.session.login_error;
        delete req.session.register_sucesss;
        res.render('users/login', { layout: 'noauth', login_error, register_sucesss })
    })
    .post('/', indexController.login)
    .get('/register', async (req, res, next) => {
        let register_error = req.session.register_error;
        delete req.session.register_error;
        res.render('users/register', { layout: 'noauth', register_error })
    })
    .post('/register', indexController.register)
module.exports = router;
const uModel = require('../../schemas/users');
const wModel = require('../../schemas/wallet');
const tModel = require('../../schemas/transaction');
let walletService = require('../../lib/wallet');
exports.login = async (req, res, next) => {
    try {
        let user = await uModel.loginUser(req.body, 'admin');
        req.session.user = user;
        res.redirect('/admin/dashboard');
    }
    catch (ex) {
        req.session.login_error = 'Invalid Mail or Passowrd.';
        res.redirect('/admin/login');
    }
};
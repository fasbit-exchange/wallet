const uModel = require('../../schemas/users');
const wModel = require('../../schemas/wallet');
const tModel = require('../../schemas/transaction');
let walletService = require('../../lib/wallet');
exports.login = async (req, res, next) => {

    try {
        let user = await uModel.loginUser(req.body);
        req.session.user = user;
        req.session.save(console.log)
        res.redirect('/users/dashboard');
    }
    catch (ex) {
        req.session.login_error = 'Invalid Mail or Passowrd.';
        res.redirect('/users/login');
    }

};
const createMulitSigAddresses = async (user) => {
    let btc = await walletService.btc.createMultiSigWallet('btc', user);
    let bch = await walletService.btc.createMultiSigWallet('bch', user);
    let ltc = await walletService.btc.createMultiSigWallet('ltc', user);
    return { btc, bch, ltc };
}
exports.register = async (req, res, next) => {
    try {
        let user = await new uModel(req.body).save();
        let walObj = await createMulitSigAddresses(user._id);
        let wallets = [];
        wallets.push({ type: 'multisig', name: user._id + '_wallet', user: user._id, coin_type: 'btc', redeemScript: walObj.btc.redeemScript, main_address: walObj.btc.address, addresses: [walObj.btc.address] });
        wallets.push({ type: 'multisig', name: user._id + '_wallet', user: user._id, coin_type: 'ltc', main_address: walObj.ltc, addresses: [walObj.ltc.address] });
        wallets.push({ type: 'multisig', name: user._id + '_wallet', user: user._id, coin_type: 'bch', main_address: walObj.bch, addresses: [walObj.bch.address] });
        await wModel.insertMany(wallets);
        req.session.register_sucesss = 'User has been registerd successfully.';
        res.redirect('/users/login')
    }
    catch (ex) {
        console.log(ex)
        req.session.register_error = 'Registration failed';
        res.redirect('/users/register');
    }
};
exports.dashboard = async (req, res, next) => {
    try {
        let wallets = await wModel.find({ user: req.session.user._id }).limit(3);
        res.render('users/dashboard', { pageTitle: 'Dashboard', layout: 'template', wallets, session: req.session.user });
    }
    catch (ex) {
        return next(ex);
    }
    // res.json(wallets);
};
exports.receive = async (req, res, next) => {
    try {
        let wallets = await wModel.find({ user: req.session.user._id });
        res.render('users/receive', { pageTitle: 'Receive Crypto', layout: 'template', wallets, session: req.session.user });
    }
    catch (ex) {
        return next(ex);
    }
    // res.json(wallets);
};
exports.transaction = async (req, res, next) => {
    try {
        // let wallets = await wModel.find({ user: req.session.user._id });
        let wallets = await wModel.find({ user: req.session.user._id });
        let current_transaction_status = req.session.transaction_status;
        delete req.session.transaction_status;
        let transactions = await tModel.find({ user: req.session.user._id })
        // delete req.session.transaction_status;
        res.render('users/transaction', { pageTitle: 'Transaction', layout: 'template', wallets, session: req.session.user, current_transaction_status, transactions });
    }
    catch (ex) {
        return next(ex);
    }
};
exports.send = async (req, res, next) => {
    try {
        let wallets = await wModel.find({ user: req.session.user._id });
        res.render('users/send', { pageTitle: 'Send Crypto', layout: 'template', wallets, session: req.session.user });
    }
    catch (ex) {
        return next(ex);
    }
};
exports.refreshWallet = async (req, res, next) => {
    try {
        await updateWalletsAndGetBalance(req.session.user._id);
        res.redirect('/users/receive');
    }
    catch (ex) {
        return next(ex);
    }
};
const updateWalletsAndGetBalance = async (user) => {
    let btc_balance = await walletService.btc.getBalance('btc', user);
    let ltc_balance = await walletService.btc.getBalance('ltc', user);
    let bch_balance = await walletService.btc.getBalance('bch', user);
    await wModel.update({ user: user, coin_type: 'btc' }, { confirmed_amount: btc_balance });
    await wModel.update({ user: user, coin_type: 'ltc' }, { confirmed_amount: ltc_balance });
    await wModel.update({ user: user, coin_type: 'bch' }, { confirmed_amount: bch_balance });
    return;
};
exports.transact = async (req, res, next) => {
    try {
        // return res.json(req.body);
        let tx = await walletService.btc.sendFrom(req.body.coin_type, req.session.user._id, req.body);
        let transaction = new tModel();
        transaction.tx = tx;
        transaction.to_address = req.body.address;
        transaction.user = req.session.user._id;
        transaction.amount = req.body.amount;
        transaction.coin_type = req.body.coin_type;
        await transaction.save();
        req.session.transaction_status = 'success';
        res.redirect('/users/transaction');
    }
    catch (ex) {
        req.session.transaction_status = 'fail';
        res.redirect('/users/transaction');
    }
}
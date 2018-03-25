const wModel = require('../../schemas/wallet');
exports.dashboard = async (req, res, next) => {
    try {
        let wallets = await wModel.find({ user: req.session.user._id });
        res.json(wallets);
    }
    catch (e) {
        next(err);
    }
};
const uModel = require('../../schemas/users');
const bcrypt = require('bcrypt');
const config = require('config');
exports.getProfile = async (req, res, next) => {
    try {
        let user = req.session.user;
        res.render('admin/profile', { user, layout: 'aTemplate' });
    }
    catch (e) {
        next(err);
    }
};
exports.updateProfile = async (req, res, next) => {
    try {
        let data = {};
        data.first_name = req.body.first_name;
        data.last_name = req.body.last_name;
        data.phone = req.body.phone;
        if (req.body.password && req.body.password.trim() != '' && req.body.password === req.body.cpassword) {
            console.log("TRUE = ", req.body.password.trim())
            data.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(config.get('bcryptSaltRounds')));

        }
        req.session.user = await uModel.findOneAndUpdate({ _id: req.session.user._id }, data);
        res.redirect('/admin/profile');
    }
    catch (err) {
        next(err);
    }
};
const uModel = require('../../schemas/users');
exports.createUser = async (req, res, next) => {

};
exports.getUsers = async (req, res, next) => {
    try {
        let users = await uModel.getUserAndWallets();
        res.render('admin/users', { users, layout: 'aTemplate', pageTitle: 'Users' });
    }
    catch (ex) {
        next(ex);
    }
};
exports.getSingleUser = async (req, res, next) => {

};
exports.updateUser = async (req, res, next) => {

};
exports.deleteUser = async (req, res, next) => {

};
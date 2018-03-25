const authUser = async (req, res, next) => {
    if (!req.session.user || !req.session.user._id) return res.redirect('/users/login');
    else if (req.session.user.roles.indexOf('user') !== -1) return res.redirect('/users/login');
    return next();
};
const authAdmin = async (req, res, next) => {
    if (!req.session.user || !req.session.user._id) return res.redirect('/admin/login');
    else if (req.session.user.roles.indexOf('admin') !== -1) return res.redirect('/admin/login');
    return next();
};
module.exports = { authUser, authAdmin };
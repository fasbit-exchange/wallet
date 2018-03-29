const authUser = async (req, res, next) => {
    if (!req.session.user || !req.session.user._id) return res.redirect('/');
    else if (req.session.user.roles!== 'user') return res.redirect('/');
    return next();
};
const authAdmin = async (req, res, next) => {
    if (!req.session.user || !req.session.user._id) return res.redirect('/admin/login');
    else if (req.session.user.roles!== 'admin') return res.redirect('/admin/login');
    return next();
};
module.exports = { authUser, authAdmin };
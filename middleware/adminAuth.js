module.exports = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        req.session.redirectTo = req.originalUrl;
        return res.redirect('/login');
    }

    if (req.session.user && !req.session.user.isAdmin) {
        return res.render('error/authError');
    }
    next();

}
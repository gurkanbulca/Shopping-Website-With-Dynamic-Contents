const User = require("../models/user");
const bcrypt = require("bcrypt");
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

var apiKey = require("../private/sendgrid");
sgMail.setApiKey(apiKey);

exports.getLogin = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render('account/login', {
        path: '/login',
        title: 'Login',
        errorMessage: errorMessage
    });
}

exports.postLogin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.session.errorMessage = "Böyle bir kullanıcı mevcut değil."
                return req.session.save(err => {
                    console.log(err);
                    return res.redirect('/login');
                });
            }
            bcrypt.compare(password, user.password)
                .then(isSuccess => {
                    if (isSuccess) {
                        req.session.user = user;
                        req.session.isAuthenticated = true;
                        return req.session.save(function (err) {
                            var url = req.session.redirectTo || '/';
                            delete req.session.redirectTo;
                            return res.redirect(url);
                        })
                    }
                    req.session.errorMessage = "Hatalı şifre."
                    req.session.save(err => {
                        console.log(err);
                        return res.redirect('/login');
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));



}

exports.getRegister = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render('account/register', {
        path: '/register',
        title: 'Register',
        errorMessage: errorMessage

    });
}

exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.session.errorMessage = "Bu mail adresi ile daha önce kayıt olunmuş.";
                return req.session.save(err => {
                    err ? console.log(err) : "";
                    return res.redirect('/register');

                });
            }
            return bcrypt.hash(password, 10)
                .then(hashedPassword => {
                    return new User({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    }).save();

                })
                .then(() => {
                    res.redirect('/login');

                    const msg = {
                        to: email,
                        from: 'info@gurkanbulca.com',
                        subject: 'Hesap oluşturuldu.',
                        html: '<h1>Hesabınız oluşturuldu.</h1>',
                    };

                    sgMail.send(msg);

                })
                .catch(err => console.log(err));

        })

        .catch(err => console.log(err));
}

exports.getReset = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;


    res.render('account/reset', {
        path: '/reset-password',
        title: 'Reset Password',
        errorMessage: errorMessage
    });
}

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset-password')
        }
        const token = buffer.toString('hex');

        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.session.errorMessage = "Böyle bir kullanıcı mevcut değildir.";
                    req.session.save(err => {
                        err ? console.log(err) : "";
                        return res.redirect('/reset-password');
                    })
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 1000 * 60 * 15 // 15dk

                return user.save()
            })
            .then(() => {
                res.redirect('/');

                const msg = {
                    to: email,
                    from: 'info@gurkanbulca.com',
                    subject: 'Parola Sıfırlama',
                    html: `
                    
                    <p>Parolanızı güncellemek için aşağıdaki linke tıklayınız.</p>
                    <p>
                        <a href="http://localhost:3000/reset-password/${token}">Reset password</a>
                    </p>
                    
                    `,
                };

                sgMail.send(msg);
            })
            .catch(err => console.log(err));
    })
    // res.redirect('/login');
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

exports.getNewPassword = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    const token = req.params.token;
    User.findOne({
        resetToken: token, resetTokenExpiration: {
            $gt: Date.now()
        }
    })
        .then(user => {
            if (user) {
                res.render('account/new-password', {
                    path: '/new-password',
                    title: 'New Password',
                    errorMessage: errorMessage,
                    userId: user._id.toString(),
                    passwordToken: token
                });
            }
            else {
                res.render('error/anyError', {
                    path: '/anyError',
                    title: 'Error'
                })
            }
        })
        .catch(err => console.log(err));

}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const token = req.body.passwordToken;
    const userId = req.body.userId;
    let _user;

    User.findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: Date.now()
        },
        _id: userId
    })
        .then(user => {
            _user = user;
            return bcrypt.hash(newPassword, 10);
        })
        .then(hashedPassword => {
            _user.password = hashedPassword;
            _user.resetToken = undefined;
            _user.resetTokenExpiration = undefined;
            return _user.save();
        })
        .then(() => {
            res.redirect('/login');
        })
        .catch(err => console.log(err));

}
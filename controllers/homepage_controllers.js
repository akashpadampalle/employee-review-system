

module.exports.renderHomePage = function (req, res) {
    res.render('home', { title: 'ERS | home' });
}

module.exports.renderSignInPage = function (req, res) {
    res.render('signin', { title: 'ERS | signin' });
}

module.exports.renderSignUpPage = function (req, res) {
    res.render('signup', { title: 'ERS | signup' });
}

module.exports.renderCreateCompanyPage = function (req, res) {
    res.render('create_company', { title: 'ERS | create company' })
}
const Company = require('../models/company');

module.exports.renderHomePage = function (req, res) {
    res.render('home', { title: 'ERS | home' });
}

module.exports.renderSignInPage = async function (req, res) {
    const company = await Company.find({}).select('-employees');
    if (company) {
        res.locals.company = company;
    }
    res.render('signin', { title: 'ERS | signin' });
}

module.exports.renderSignUpPage = function (req, res) {
    res.render('signup', { title: 'ERS | signup' });
}

module.exports.renderCreateCompanyPage = function (req, res) {
    res.render('create_company', { title: 'ERS | create company' })
}
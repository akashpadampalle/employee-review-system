const Company = require('../models/company');

module.exports.renderHomePage = function (req, res) {
    res.render('home', { title: 'ERS | home' });
}

module.exports.renderSignInPage = function (req, res) {
    res.render('signin', { title: 'ERS | signin' });
}

module.exports.renderSignUpPage = async function (req, res) {
    const company = await Company.find({}).select('-employees');

    console.log(company);

    if (company.length > 0) {
        res.locals.company = company;
    }

    res.render('signup', { title: 'ERS | signup' });
}

module.exports.renderCreateCompanyPage = function (req, res) {
    res.render('create_company', { title: 'ERS | create company' })
}

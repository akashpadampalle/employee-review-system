const Company = require('../models/company');

module.exports.renderIndexPage = function (req, res){
    res.render('index', {title: 'GradeUp'});
}


module.exports.renderEmployeeSignUpForm = async function(req, res){
    const company = await Company.find({});

    res.render('signup_form_employee', {company});
}

module.exports.renderCreateCompanyForm = function(req, res){
    res.render('signup_form_admin');
}

module.exports.renderLoginForm = function(req, res){
    res.render('login_form');
}
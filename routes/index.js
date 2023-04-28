const express = require('express');
const passport = require('passport');
const router = express.Router();

const basicControlls = require('../controllers/controlls');


const userRoutes = require('./user');

router.get('/', basicControlls.renderIndexPage);
router.get('/employee-sign-up', basicControlls.renderEmployeeSignUpForm);
router.get('/create-company', basicControlls.renderCreateCompanyForm);
router.get('/login', basicControlls.renderLoginForm);

// TODO
router.post('/login', passport.authenticate('local', {successRedirect: 'user/employee-view'}));


router.use('/user', userRoutes);

module.exports = router;
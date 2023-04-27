const express = require('express');
const router = express.Router();

const basicControlls = require('../controllers/controlls');


const userRoutes = require('./user');

router.get('/', basicControlls.renderIndexPage);
router.get('/employee-sign-up', basicControlls.renderEmployeeSignUpForm);
router.get('/create-company', basicControlls.renderCreateCompanyForm);
router.get('/login', basicControlls.renderLoginForm);


router.use('/user', userRoutes);

module.exports = router;
const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../controllers/user_controllers');

router.post('/create-company', userController.createCompany);
router.post('/create-employee', userController.createEmployee);
router.get('/employee-view', passport.checkAuthentication, userController.employeeView);

router.get('/user-info' ,userController.getUser);
router.get('/logout', passport.checkAuthentication, userController.logout);

module.exports = router;
const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../controllers/user_controllers');

router.post('/create-company', userController.createCompany);
router.post('/create-employee', userController.createEmployee);
router.get('/employee-view' ,userController.employeeView);

router.get('/user-info' ,userController.getUser);


module.exports = router;
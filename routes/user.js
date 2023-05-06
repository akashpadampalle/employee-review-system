const express = require('express');
const router = express.Router();

const passport = require('passport');

const employeeController = require('../controllers/employee_controllers');

router.get('/admin', passport.checkAuthentication, employeeController.adminPanel);
router.post('/make-admin', passport.checkAuthentication, employeeController.makeAdmin);
router.post('/make-employee', passport.checkAuthentication, employeeController.makeEmployee);
router.get('/employee-review/:id', passport.checkAuthentication, employeeController.employeeReview);


module.exports = router;
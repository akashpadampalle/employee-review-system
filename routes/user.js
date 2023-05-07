const express = require('express');
const router = express.Router();

const passport = require('passport');

const employeeController = require('../controllers/employee_controllers');

router.get('/admin', passport.checkAuthentication, employeeController.adminPanel);
router.post('/make-admin', passport.checkAuthentication, employeeController.makeAdmin);
router.post('/make-employee', passport.checkAuthentication, employeeController.makeEmployee);
router.get('/employee-review/:id', passport.checkAuthentication, employeeController.employeeReview);

// ask and cancel feedbacks
router.post('/ask-feedback', passport.checkAuthentication, employeeController.askFeedback);
router.post('/cancel-feedback', passport.checkAuthentication, employeeController.cancelFeedback);

module.exports = router;
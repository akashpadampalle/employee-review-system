const express = require('express');
const router = express.Router();

const userController = require('../controllers/user_controllers');

router.post('/create-company', userController.createCompany);
router.post('/create-employee', userController.createEmployee);

module.exports = router;
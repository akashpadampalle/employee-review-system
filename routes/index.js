const express = require('express');
const router = express.Router();

//controllers
const homepageController = require('../controllers/homepage_controllers');

// signin | signup | home routes
router.get('/', homepageController.renderHomePage);
router.get('/signin', homepageController.renderSignInPage);
router.get('/signup', homepageController.renderSignUpPage);
router.get('/create-company', homepageController.renderCreateCompanyPage);

module.exports = router;
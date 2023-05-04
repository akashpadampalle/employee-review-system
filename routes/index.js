const express = require('express');
const router = express.Router();

//controllers
const homepageController = require('../controllers/homepage_controllers');

// signin | signup | home routes
router.get('/', homepageController.renderHomePage);




module.exports = router;
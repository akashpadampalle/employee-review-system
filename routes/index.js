const express = require('express');
const router = express.Router();

const basicControlls = require('../controllers/controlls');

router.get('/', basicControlls.renderIndexPage);

module.exports = router;
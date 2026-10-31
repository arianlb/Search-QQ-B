const { Router } = require('express');
const { insert } = require('../controllers/crmController');

const router = Router();

router.post('/contact', insert);

module.exports = router;
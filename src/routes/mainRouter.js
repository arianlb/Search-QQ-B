const { Router } = require('express');
const { search, policies } = require('../controllers/mainController');

const router = Router();

router.post('/search', search);

router.post('/policies', policies);

module.exports = router;
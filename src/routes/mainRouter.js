const { Router } = require('express');
const { search, policies, info, notes } = require('../controllers/mainController');

const router = Router();

router.post('/search', search);

router.post('/policies', policies);

router.post('/info', info);

router.post('/notes', notes);

module.exports = router;
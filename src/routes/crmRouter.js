const { Router } = require('express');
const { insert, getNotesController, insertNotesController } = require('../controllers/crmController');

const router = Router();

router.post('/contact', insert);

router.post('/get/notes', getNotesController);

router.post('/insert/notes', insertNotesController);

module.exports = router;
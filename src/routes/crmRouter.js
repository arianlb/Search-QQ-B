const { Router } = require('express');
const { insert, getNotesController, insertNotesController, getPhoneListController } = require('../controllers/crmController');

const router = Router();

router.post('/contact', insert);

router.post('/get/notes', getNotesController);

router.post('/insert/notes', insertNotesController);

router.get('/get/phone-list', getPhoneListController);

module.exports = router;
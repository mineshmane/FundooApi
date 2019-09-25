const userController = require('../controllers/UserController');
const noteControl = require('../controllers/noteController')
const labelControl = require('../controllers/labelController')
const express = require('express');
const auth = require('../middleware/Authentication');
const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser)
router.post('/forgetPassword', userController.forgetPassword)
router.post('/reset', auth, userController.resetPassword)

router.post('/addNote', auth, noteControl.createNote);
router.get('/getAllNotes', auth, noteControl.getAllNotes);
router.post('/updateNote', auth, noteControl.updateNotesController);
router.delete('/deleteNoteForever',auth,noteControl.deleteForeverNote);
router.post('/addLabelToNote',auth,noteControl.addLabeltoNote)

router.post('/createLabel', auth, labelControl.createLabel);
router.post('/updateLabel', auth, labelControl.updateLabel)
router.get('/getAllLabels', auth, labelControl.getAllLabels);
router.post('/deleteLabel', auth, labelControl.deleteLabel);


console.log(" in the router ");
module.exports = router;
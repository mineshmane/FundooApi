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
router.get('/getAllUsers', auth, userController.getAllUsers)
router.post('/profile/upload', auth, userController.uploadFile)

router.post('/addNotes', auth, noteControl.createNote);
router.get('/getAllNotes', auth, noteControl.getAllNotes);
router.post('/SearchNoteList',auth,noteControl.searchNote)

router.post('/updateNote', auth, noteControl.updateNotesController);
router.delete('/deleteNoteForever', auth, noteControl.deleteForeverNote);
router.post('/addLabelToNote', auth, noteControl.addLabeltoNote)

router.post('/addXcelFile', auth, noteControl.xlController)
router.post('/removeNoteLabel', auth, noteControl.removeNoteLabel);

router.post('/addCollaboratorToNote', auth, noteControl.addCollaborator)
router.delete('/removeCollaborator', auth, noteControl.removeCollaborator);
router.post('/removeReminder', auth, noteControl.removeReminder)

router.get('/getArchiveNotes', auth, noteControl.getArchivedNotes);
router.get('/getReminderNotes', auth, noteControl.getReminderdNotes);
router.get('/getTrashNotes', auth, noteControl.getTrashNotes);


router.get('/getAllCollaborator', auth, noteControl.getAllCollaborator);

router.post('/createLabel', auth, labelControl.createLabel);
router.post('/updateLabel', auth, labelControl.updateLabel)
router.get('/getAllLabels', auth, labelControl.getAllLabels);
router.post('/deleteLabel', auth, labelControl.deleteLabel);


console.log(" in the router ");
module.exports = router;
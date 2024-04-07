const express = require('express');
const router = express.Router();  

const auth = require('../middlewares/auth');  
const multer = require('../middlewares/multer-config');

const referenceController = require('../controllers/reference');

router.post('/', multer, referenceController.createReference);

router.get('/:id', referenceController.getOneReference);

router.get('/', referenceController.getAllReferences);

router.put('/:id', multer, referenceController.modifyReference);

router.delete('/:id', referenceController.deleteReference);

module.exports= router;

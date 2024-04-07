const express = require('express');
const router = express.Router();  

const auth = require('../middlewares/auth');  
const multer = require('../middlewares/multer-config');

const subServiceController = require('../controllers/subService');

router.post('/', multer, subServiceController.createSubService);

router.get('/:id', subServiceController.getOneSubService);

router.get('/', subServiceController.getAllSubServices);

router.put('/:id', multer, subServiceController.modifySubService);

router.delete('/:id', subServiceController.deleteSubService);

module.exports= router;

const express = require('express');
const router = express.Router();  //cette methode permet de créer des routeurs séparés pour chaque route principale de votre application 

const auth = require('../middlewares/auth');  //nous importons notre middleware auth et le passons comme argument aux routes à protéger 
const multer = require('../middlewares/multer-config');

const serviceController = require('../controllers/service');

router.post('/', multer, serviceController.createService);//L'ordre des middlewares est important

router.get('/:id', serviceController.getOneService);

router.get('/', serviceController.getAllServices);

router.put('/:id', multer, serviceController.modifyService);

router.delete('/:id', serviceController.deleteService);

module.exports= router;

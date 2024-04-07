const express = require('express');
const router = express.Router();  

const demandeDevisController = require('../controllers/demandeDevis');

router.post('/', demandeDevisController.createDemandeDevis);

router.get('/', demandeDevisController.getAllDemandeDevis);

router.delete('/:id', demandeDevisController.deleteDemandeDevis);

module.exports= router;

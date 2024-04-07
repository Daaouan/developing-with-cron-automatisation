const express = require('express');
const router = express.Router();  

const auth = require('../middlewares/auth');  
const multer = require('../middlewares/multer-config');

const statisticController = require('../controllers/statistic');

router.post('/', multer, statisticController.createStatistic);

router.get('/:id', statisticController.getOneStatistic);

router.get('/', statisticController.getAllStatistic);

router.put('/:id', multer, statisticController.modifyStatistic);

router.delete('/:id', statisticController.deleteStatistic);

module.exports= router;

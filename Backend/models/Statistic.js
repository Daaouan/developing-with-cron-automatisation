const mongoose = require('mongoose'); 

const statisticSchema = mongoose.Schema({
    title:{type: String, require:true},
    statistic:{type: String, require: true},
});

module.exports = mongoose.model('Statistic', statisticSchema);
const mongoose = require('mongoose'); 

const subServiceSchema = mongoose.Schema({
    title:{type: String, require:true},
    description:{type: String, require: false},
    imageUrl:{type: String, require: false},
    serviceId:{type: mongoose.Types.ObjectId, require: true},
});

module.exports = mongoose.model('SubService', subServiceSchema);
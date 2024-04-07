const mongoose = require('mongoose'); 

const serviceSchema = mongoose.Schema({
    title:{type: String, require:true},
    description:{type: String, require: true},
    imageUrl:{type: String, require: true},
    subService1:{type: String, require: false},
    subService2:{type: String, require: false},
    subService3:{type: String, require: false},
    subService4:{type: String, require: false},
    subService5:{type: String, require: false},
    subService6:{type: String, require: false},
});

module.exports = mongoose.model('Service', serviceSchema);
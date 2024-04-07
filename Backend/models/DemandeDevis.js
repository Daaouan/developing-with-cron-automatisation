const mongoose = require('mongoose'); 

const demandeDevisSchema = mongoose.Schema({
    subject:{type: String, require:true},
    email:{type: String, require: true},
    name:{type: String, require: false},
    message:{type: String, require: false},
});

module.exports = mongoose.model('DemandeDevis', demandeDevisSchema);
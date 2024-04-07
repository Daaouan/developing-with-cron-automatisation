const DemandeDevis = require('../models/DemandeDevis');

exports.createDemandeDevis = (req, res, next) => {
    const demandeDevisObject = req.body;
    delete demandeDevisObject._id;
    delete demandeDevisObject._userId;
    const demandeDevis = new DemandeDevis({
        ...demandeDevisObject,
        userId: req.body.userId,
    });
    demandeDevis.save()
        .then(() => { res.status(201).json({ message: 'demandeDevis/contact enregistré' }) })
        .catch(error => { res.status(400).json({ error }) })
    console.log(demandeDevisObject);
};

exports.getAllDemandeDevis = (req, res, next) => { //La première différence que vous remarquerez est l'argument supplémentaire passé à la méthode use : nous lui passons un string, correspondant à la route d'API (aussi appelée endpoint)  pour laquelle nous souhaitons enregistrer cet élément de middleware. Dans ce cas, cette route sera http://localhost:3000/api/stuff (voir app.js), car il s'agit de l'URL demandée par l'application front-end.
    DemandeDevis.find()
        .then(demandeDevis => res.status(200).json(demandeDevis))
        .catch(error => res.status(400).json(error));
};

exports.deleteDemandeDevis = (req, res, next) => {
    DemandeDevis.findOne({ _id: req.params.id })
        .then(demandeDevis => {
            if (demandeDevis.userId != req.body.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                DemandeDevis.deleteOne({ _id: req.params.id })
                    .then(() => { res.status(200).json({ message: 'DemandeDevis/contact supprimé !' }) })
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};
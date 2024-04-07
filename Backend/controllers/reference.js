const Reference = require('../models/Reference');

const fs = require('fs');  

exports.createReference = (req, res, next) => {
   const referenceObject = req.body;
    delete referenceObject._id;
    delete referenceObject._userId;
    const reference = new Reference({
        ...referenceObject,
        userId: req.body.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    });
console.log(req.file.filename);
    reference.save()
        .then(()=> {res.status(201).json({message: 'Reference enregistré'})})
        .catch(error=> {res.status(400).json({error})})
        console.log(referenceObject);
};


exports.getOneReference = (req, res, next) => {
    Reference.findOne({ _id: req.params.id })
        .then(reference => res.status(200).json(reference))
        .catch(error => res.status(404).json(error));
};

exports.getAllReferences = (req, res, next) => { //La première différence que vous remarquerez est l'argument supplémentaire passé à la méthode use : nous lui passons un string, correspondant à la route d'API (aussi appelée endpoint)  pour laquelle nous souhaitons enregistrer cet élément de middleware. Dans ce cas, cette route sera http://localhost:3000/api/stuff (voir app.js), car il s'agit de l'URL demandée par l'application front-end.
    Reference.find()
        .then(reference => res.status(200).json(reference))
        .catch(error => res.status(400).json(error));
};

exports.modifyReference = (req, res, next) => {
    const referenceObject = req.file ? {   //on fait un test si l'objet contient image ou non
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
    } : {...req.body};

    delete referenceObject._userId;  //never trust the user
    Reference.findOne({_id: req.params.id})
        .then((reference)=>{
            if(reference.userId != req.body.userId){   //tester si userId de la requete est le meme de l'objet
                res.status(401).json({ message : 'Not authorized'});
            }
            else{  
                Reference.updateOne({_id: req.params.id}, {...referenceObject, _id: req.params.id}) 
                    .then(() => res.status(200).json({ message: 'reference modifié' }))
                    .catch(error=> {res.stat(400).json({error})});
            }
        })
        .catch(error=> {res.status(400).json({error})});
};
 
exports.deleteReference = (req, res, next)=>{
        Reference.findOne({ _id: req.params.id})
        .then(reference => {
            if (reference.userId != req.body.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = reference.imageUrl.split('/image/')[1];
                fs.unlink(`image/${filename}`, () => { //supprimer l'image de l'objet exist dans le dossier images lors supprision de l'objet
                    Reference.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Reference supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };
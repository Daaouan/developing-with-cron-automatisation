const Galerie = require('../models/Galerie');

const fs = require('fs');  

exports.createGalerie = (req, res, next) => {
   const galerieObject = req.body;
    delete galerieObject._id;
    delete galerieObject._userId;
    const galerie = new Galerie({
        ...galerieObject,
        userId: req.body.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    });
console.log(req.file.filename);
    galerie.save()
        .then(()=> {res.status(201).json({message: 'Galerie enregistré'})})
        .catch(error=> {res.status(400).json({error})})
        console.log(galerieObject);
};


exports.getOneGalerie = (req, res, next) => {
    Galerie.findOne({ _id: req.params.id })
        .then(galerie => res.status(200).json(galerie))
        .catch(error => res.status(404).json(error));
};

exports.getAllGalerie = (req, res, next) => { //La première différence que vous remarquerez est l'argument supplémentaire passé à la méthode use : nous lui passons un string, correspondant à la route d'API (aussi appelée endpoint)  pour laquelle nous souhaitons enregistrer cet élément de middleware. Dans ce cas, cette route sera http://localhost:3000/api/stuff (voir app.js), car il s'agit de l'URL demandée par l'application front-end.
    Galerie.find()
        .then(galerie => res.status(200).json(galerie))
        .catch(error => res.status(400).json(error));
};

exports.modifyGalerie = (req, res, next) => {
    const galerieObject = req.file ? {   //on fait un test si l'objet contient image ou non
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
    } : {...req.body};

    delete galerieObject._userId;  //never trust the user
    Galerie.findOne({_id: req.params.id})
        .then((galerie)=>{
            if(galerie.userId != req.body.userId){   //tester si userId de la requete est le meme de l'objet
                res.status(401).json({ message : 'Not authorized'});
            }
            else{  
                Galerie.updateOne({_id: req.params.id}, {...galerieObject, _id: req.params.id}) 
                    .then(() => res.status(200).json({ message: 'galerie modifié' }))
                    .catch(error=> {res.stat(400).json({error})});
            }
        })
        .catch(error=> {res.status(400).json({error})});
};

exports.deleteGalerie = (req, res, next)=>{
        Galerie.findOne({ _id: req.params.id})
        .then(galerie => {
            if (galerie.userId != req.body.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = galerie.imageUrl.split('/image/')[1];
                fs.unlink(`image/${filename}`, () => { //supprimer l'image de l'objet exist dans le dossier image lors supprision de l'objet
                    Galerie.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Galerie supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };
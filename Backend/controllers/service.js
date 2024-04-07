const Service = require('../models/Service');

const fs = require('fs');  

exports.createService = (req, res, next) => {
    const serviceObject = req.body; 
    delete serviceObject._id;
    delete serviceObject._userId;
    const service = new Service({
        ...serviceObject,
        userId: req.body.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    });
console.log(req.file.filename);
    service.save()
        .then(()=> {res.status(201).json({message: 'Service enregistré'})})
        .catch(error=> {res.status(400).json({error})})
        console.log(serviceObject);
};


exports.getOneService = (req, res, next) => {
    Service.findOne({ _id: req.params.id })
        .then(service => res.status(200).json(service))
        .catch(error => res.status(404).json(error));
};

exports.getAllServices = (req, res, next) => { //La première différence que vous remarquerez est l'argument supplémentaire passé à la méthode use : nous lui passons un string, correspondant à la route d'API (aussi appelée endpoint)  pour laquelle nous souhaitons enregistrer cet élément de middleware. Dans ce cas, cette route sera http://localhost:3000/api/stuff (voir app.js), car il s'agit de l'URL demandée par l'application front-end.
    Service.find()
        .then(services => res.status(200).json(services))
        .catch(error => res.status(400).json(error));
};

exports.modifyService = (req, res, next) => {
    const serviceObject = req.file ? {   //on fait un test si l'objet contient image ou non
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
    } : {...req.body};

    delete serviceObject._userId;  //never trust the user
    Service.findOne({_id: req.params.id})
        .then((service)=>{
            if(service.userId != req.body.userId){   //tester si userId de la requete est le meme de l'objet
                res.status(401).json({ message : 'Not authorized'});
            }
            else{  
                Service.updateOne({_id: req.params.id}, {...serviceObject, _id: req.params.id}) 
                    .then(() => res.status(200).json({ message: 'service modifié' }))
                    .catch(error=> {res.stat(400).json({error})});
            }
        })
        .catch(error=> {res.stat(400).json({error})});
};

exports.deleteService = (req, res, next)=>{
        Service.findOne({ _id: req.params.id})
        .then(service => {
            if (service.userId != req.body.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = service.imageUrl.split('/image/')[1];
                fs.unlink(`image/${filename}`, () => { //supprimer l'image de l'objet exist dans le dossier image lors supprision de l'objet
                    Service.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Service supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };
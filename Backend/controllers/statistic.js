const Statistic = require('../models/Statistic');

const fs = require('fs');  

exports.createStatistic = (req, res, next) => {
   const statisticObject = req.body;
    delete statisticObject._id;
    delete statisticObject._userId;
    const statistic = new Statistic({
        ...statisticObject,
        userId: req.body.userId,
    });
    statistic.save()
        .then(()=> {res.status(201).json({message: 'Statistic enregistré'})})
        .catch(error=> {res.status(400).json({error})})
        console.log(statisticObject);
};


exports.getOneStatistic = (req, res, next) => {
    Statistic.findOne({ _id: req.params.id })
        .then(statistic => res.status(200).json(statistic))
        .catch(error => res.status(404).json(error));
};

exports.getAllStatistic = (req, res, next) => { //La première différence que vous remarquerez est l'argument supplémentaire passé à la méthode use : nous lui passons un string, correspondant à la route d'API (aussi appelée endpoint)  pour laquelle nous souhaitons enregistrer cet élément de middleware. Dans ce cas, cette route sera http://localhost:3000/api/stuff (voir app.js), car il s'agit de l'URL demandée par l'application front-end.
    Statistic.find()
        .then(statistic => res.status(200).json(statistic))
        .catch(error => res.status(400).json(error));
};

exports.modifyStatistic = (req, res, next) => {
    const statisticObject = req.file ? {   //on fait un test si l'objet contient image ou non
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
    } : {...req.body};

    delete statisticObject._userId;  //never trust the user
    Statistic.findOne({_id: req.params.id})
        .then((statistic)=>{
            if(statistic.userId != req.body.userId){   //tester si userId de la requete est le meme de l'objet
                res.status(401).json({ message : 'Not authorized'});
            }
            else{  
                Statistic.updateOne({_id: req.params.id}, {...statisticObject, _id: req.params.id}) 
                    .then(() => res.status(200).json({ message: 'statistic modifié' }))
                    .catch(error=> {res.stat(400).json({error})});
            }
        })
        .catch(error=> {res.status(400).json({error})});
};

exports.deleteStatistic = (req, res, next)=>{
        Statistic.findOne({ _id: req.params.id})
        .then(statistic => {
            if (statistic.userId != req.body.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else { 
                    Statistic.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Statistic supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {     //on va cré une fonction comme tous nos middleware 
    try {
        const token = req.headers.authorization.split(' ')[1];    //on va diveser le token par la mthode split sous la forme d'un tableau de 2 elements [0]=bearer et [1]=token crpted
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY');  //decodage et verification de token crypted (on sais que token contien userId + RANDOM_SECRET_KEY + durée d'expiration)
        const userId = decodedToken.userId;  //comme ca en enleve le userId
        req.auth = {   //envoyer userId avec chaque requette
            userId: userId
        };
        next();  //si on pas d'error et notre utilisateur est authentifié. Nous passons à l'exécution à l'aide de la fonction next() pour passer au d'autres middleware existent dans le routes/stuff
    } catch (error) {
        res.status(401).json({ error });
    }
};
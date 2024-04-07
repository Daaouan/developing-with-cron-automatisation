const express = require('express');

const app = express();

const mongoose = require('mongoose');

const path = require('path');

const serviceRoutes = require('./routes/service');
const subServiceRoutes = require('./routes/subService');
const referenceRoutes = require('./routes/reference');
const galerieRoutes = require('./routes/galerie');
const statisticRoutes = require('./routes/statistic');
const demandeDevisRoutes = require('./routes/demandeDevis');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://mohammed:AbCd2016@cluster0.rpygsuh.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json());

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('d3-skills'));
  
    // Handle Angular routing, return all requests to Angular app
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'd3-skills', 'index.html'));
    });
  }

//pour resoudre l'ereur de CROS:
app.use((req, res, next) => {  //plus que c'est le 1er middleware executé donc sera un middleware globale sans route afin de s'appliquer à toutes les routes. Cela permettra à toutes les demandes de toutes les origines d'accéder à notre API.
    res.setHeader('Access-Control-Allow-Origin', '*');  //ce header permet d'accéder à notre API depuis n'importe quelle origine ( '*' ) 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, token');//permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) =  donant l'autorisation d'utiliser certaine headers comme origine ...
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
    res.setHeader('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token, token'); 
    
    next();
});

app.use('/api/auth', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/services/:serviceId/subServices', subServiceRoutes);
app.use('/api/references', referenceRoutes);
app.use('/api/galerie', galerieRoutes);
app.use('/api/statistics', statisticRoutes);
app.use('/api/demandeDevis', demandeDevisRoutes);
app.use('/image', express.static(path.join(__dirname, 'image')));//__dirname = directory name

module.exports = app;
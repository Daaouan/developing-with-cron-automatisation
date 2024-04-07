const multer = require('multer');

const MIME_TYPES = {   //un dictionnaire pour les extension des fichiers telechargés
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({          //la methode diskStorage indique que nous enregistrons les fichiers dans le disk. Et prend 2 methode:destination et filename
  destination: (req, file, callback) => {
    callback(null, 'image');     //image est le nom de dossier où on save les fichiers
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');   //prend nom d'origine de fichier et remplacer ' ' par '_'
    const extension = MIME_TYPES[file.mimetype];       //ajouter l'extention 
    callback(null, name + Date.now() + '.' + extension);   //Date.now() pour ajouter un temp specifique pour chaque file
  }
});

module.exports = multer({storage}).single('image');
const config = require('config');
const bp = require('body-parser')

module.exports = function(app){
  if (!config.get('jwtPrivateKey')) {
    throw new Error('ERROR: jwtPrivateKey is not defined.')
  }

  app.set('view engine', 'pug'); // motor de template
  app.set('views', './views'); // ruta de los templates

  app.use(bp.json());
  app.use(bp.urlencoded({ extended: true }));
}
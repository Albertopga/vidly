const authentication = require('./middleware/authentication');
const bp = require('body-parser')
const config = require('config');
const debug = require('debug')('app:startup');
const express = require('express');
const genders = require('./routes/genders');
const home = require('./routes/home');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

// formas de obtener el entorno
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`) // default undefined
// o bien
app.get('env'); // default development

if(app.get('env') === 'development') {
    app.use(morgan('tiny')); // expample GET /api/genders/ 200 81 - 6.669 ms
    debug('Morgan enabled...');
}

console.log(`app: ${app.get('env')}`);


app.set('view engine', 'pug'); // motor de template
app.set('views', './views'); // ruta de los templates


app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(helmet());
app.use(logger);
app.use(authentication);

app.use('/api/genders', genders);
app.use('/', home);


// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
// console.log('Mail Password: ' + config.get('mail.password'));


app.listen(port, () => console.log(`App listening on port ${port}`));






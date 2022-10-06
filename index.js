require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const bp = require('body-parser')
const config = require('config'); //check the file in /config/custom-environment-variables.json
const debug = require('debug')('app:startup');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const genres = require('./routes/genres');
const customer = require('./routes/customers');
const movies = require('./routes/movies');
const home = require('./routes/home');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

const error = require('./middleware/err');

const app = express();
const port = process.env.PORT || 3000;

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// Captura los errores no encapsulados en express
winston.handleExceptions(
    new winston.transports.File({ filename: 'uncaughtException.log' })
)

// caprtura errores de promesas no controladas
process.on('unhandledRejection', (ex) => {
    throw ex
})

winston.add(new winston.transports.File({ filename: 'logfile.log' }))
winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly', level: 'error' }))

if (!config.get('jwtPrivateKey')) {
    console.error('ERROR: jwtPrivateKey is not defined.')
    process.exit(1)
}

// connection
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(' Could not connected to MongoDB: ', err))


// formas de obtener el entorno
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`) // default undefined
// o bien
app.get('env'); // default development

if (app.get('env') === 'development') {
    app.use(morgan('tiny')); // expample GET /api/genders/ 200 81 - 6.669 ms
    debug('Morgan enabled...');
}

console.log(`app: ${app.get('env')}`);


app.set('view engine', 'pug'); // motor de template
app.set('views', './views'); // ruta de los templates

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(helmet());

app.use('/api/genres', genres);
app.use('/api/customers', customer);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', home);

app.use(error);

app.listen(port, () => console.log(`App listening on port ${port}`));


const databaseUrl = 'mongodb://localhost/vidly'
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function(){
  // Captura los errores no encapsulados en express
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtException.log' })
  )

  // captura errores de promesas no controladas
  process.on('unhandledRejection', (ex) => {
    throw ex
  })

  winston.add(new winston.transports.File({ filename: 'logfile.log' }))
  winston.add(new winston.transports.MongoDB({ db: databaseUrl, level: 'error' }))
}
const mongoose = require('mongoose');
const winston = require('winston')

const databaseUrl = 'mongodb://localhost/vidly';

module.exports = function () {
  mongoose.connect(databaseUrl, { useUnifiedTopology: true })
    .then(() => winston.info('Connected to MongoDB'));
}
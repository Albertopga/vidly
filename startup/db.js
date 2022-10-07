const mongoose = require('mongoose');
const winston = require('winston')
const config = require('config')

const databaseUrl = config.get('db');

module.exports = function () {
  mongoose.connect(databaseUrl, { useUnifiedTopology: true })
    .then(() => {
      console.log(`=== Connected to ${databaseUrl} MongoDB...`)
      winston.info('Connected to ${databaseUrl} MongoDB...')
    });
}
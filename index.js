const winston = require('winston')
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('./startup/routes')(app)
require('./startup/db')()
require('./startup/logger')()
require('./startup/config')(app)
require('./startup/validation')()

// formas de obtener el entorno --> NODE_ENV: ${process.env.NODE_ENV}
// o bien --> app.get('env') 
winston.info(`app env: ${app.get('env')}`);

app.listen(port, () => winston.info(`App listening on port ${port}`));


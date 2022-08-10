const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.pug', {title: 'My express app', message: 'Hello'});
})

module.exports = router;
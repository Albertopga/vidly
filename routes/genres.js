const express = require('express');
const router = express.Router();
const { Genre, validateBody } = require('../models/genres');

router.get('/', async (req, res) => {
    const result = await Genre.find().sort('name');
    return res.status(200).send(result);
});

router.get('/:id', async(req, res) => {
    const genre = await Genre.findById( req.params.id);

    if(!genre) return res.status(404).send('genre not found');
    res.status(200).send(genre);
});

router.post('/', async (req, res) => {
    const reqValidation = validateBody(req.body);
    if(reqValidation.error) return res.status(404).send(reqValidation.error.details[0].message) ;

    let genre = new Genre( {name: req.body.name });
    genre = await genre.save();

    res.status(200).send(genre);
});

router.put('/:id', async (req, res) => {
    const reqValidation = validateBody(req.body);

    if(reqValidation.error) return res.status(404).send(reqValidation.error.details[0].message);
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.name }, { new: true });

    if(!genreToEdit) return res.status(404).send('genre to edit not found');
    res.status(200).send(genre);
});

router.delete(`/:id`, async(req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if(!genre) return res.status(404).send('genre to delete not found')

    res.status(200).send(genre);
});


module.exports = router;
const express = require('express');
const { Genre } = require('../models/genres');
const router = express.Router();
const { Movie, validate } = require('../models/movies');

router.get('/', async (req, res) => {
    const result = await Movie.find().sort('name');
    return res.status(200).send(result);
});

router.get('/:id', async(req, res) => {
    const movie = await Movie.findById( req.params.id);
    if(!movie) return res.status(404).send('movie not found');

    res.status(200).send(movie);
});

router.post('/', async (req, res) => {
    const reqValidation = validate(req.body);
    if(reqValidation.error) return res.status(404).send(reqValidation.error.details[0].message) ;

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre');

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    movie = await movie.save();

    res.status(200).send(movie);
});

router.put('/:id', async (req, res) => {
    const reqValidation = validate(req.body);
    if(reqValidation.error) return res.status(404).send(reqValidation.error.details[0].message);

    const movie = await Movie.findByIdAndUpdate(req.params.id, { name: req.name }, { new: true });

    if(!movieToEdit) return res.status(404).send('movie to edit not found');
    res.status(200).send(movie);
});

router.delete(`/:id`, async(req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie) return res.status(404).send('movie to delete not found')

    res.status(200).send(movie);
});


module.exports = router;
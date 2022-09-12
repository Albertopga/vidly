const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genres')

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 2, maxlength: 255, trim: true },
    genre: { type: genreSchema, required: true,  },
    numberInStock: { type: Number, required: true, minlength: 0, maxlength: 255 },
    dailyRentalRate: { type: Number, required: true, minlength: 0, maxlength: 255 }
});

const Movie = mongoose.model('Movies', movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        genreId: Joi.string().min(5).max(50).required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });

    return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
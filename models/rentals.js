const mongoose = require('mongoose');
const Joi = require('joi');
const { movieSchema } = require('./movies')
const { customerSchema } = require('./customer')

const rentalSchema = new mongoose.Schema({
    customer: { type: customerSchema, required: true },
    movie: { type: movieSchema, required: true },
    daysToRent: { type: Number, minlength: 1, required: true }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required(),
        daysToRent: Joi.number().min(1).required()
    });
    return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;

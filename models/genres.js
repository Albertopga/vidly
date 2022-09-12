const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

// model
const Genre = mongoose.model('Genre', genreSchema);


const validateBody = (body) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    })
    return schema.validate(body);
};

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validateBody = validateBody;
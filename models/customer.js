const mongoose = require('mongoose');
const Joi = require('joi');

const validateBody = (body) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    })
    return schema.validate(body);
};

const customerSchema = new mongoose.Schema({
    isGold: { type: Boolean, dafault: false },
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
    phone: { type: String, required: true, ninlength: 5, maxlength: 50 }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports.Customer = Customer;
module.exports.validateBody = validateBody;
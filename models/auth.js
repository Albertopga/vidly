const mongoose = require('mongoose');
const Joi = require('joi');

const loginSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, reqiored: true }
});

const Login = mongoose.model('login', loginSchema);

function validateLogin(login) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
  });
  return schema.validate(login);
}

exports.login = Login;
exports.validate = validateUser;
const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  email: { type: String, required: true, unique: true, minlength: 5, maxlength: 255  },
  password: { type: String, reqiored: true, minlength: 5, maxlength: 1024 }
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(1024).required()
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
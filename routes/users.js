const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/users');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.get('/', async(req, res) => {
  const result = await User.find().sort('name');
  res.status(200).send(result)
});

router.post('/', async (req, res) => {
  const reqValidation = validate(req.body);
  if(reqValidation.error) return res.status(400).send(reqValidation.error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if(user) return res.status(400).send('User already exist.');

  user = new User(_.pick(req.body, ["name", "email", "password"]))
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)

  await user.save();
  res.status(200).send(_.pick(user, ["_id", "name", "email"]));
})

// router.delete(`/:id`, async(req, res) => {
//   const user = await User.findByIdAndRemove(req.params.id);

//   if(!user) return res.status(404).send('user to delete not found')

//   res.status(200).send(user);
// });

module.exports = router
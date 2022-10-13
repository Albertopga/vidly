const auth = require('../middleware/auth')
const { Movie } = require('../models/movies')
const { Rental } = require('../models/rentals')
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  if(!req.body.customerId) return res.status(400).send('customerId not provider')
  if(!req.body.movieId) return res.status(400).send('movieId not provider')

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId)

  if(!rental) return res.status(404).send('No rental found for this customer/movie')
  if(rental.dateReturned) return res.status(400).send('Return already processed')

  rental.return();
  await rental.save()

  await Movie.update( { _id: rental.movie._id}, {$inc: {numberInStock: 1}} )

  return res.send(rental)
})


module.exports = router
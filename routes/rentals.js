const express = require('express')
const router = express.Router()
const Fawn = require('fawn')
const config = require('config')

const { Rental, validate } = require('../models/rentals')
const { Customer } = require('../models/customer')
const { Movie } = require('../models/movies')

Fawn.init(config.get('db')) // emulata transacctions on mongoDB


router.get('/', async (req, res) => {
	const result = await Rental.find().sort('-dateOut')
	return res.status(200).send(result)
});

router.post('/', async (req, res) => {
	const reqValidation = validate(req.body)
	if (reqValidation.error) return res.status(400).send(reqValidation.error.details[0].message)
	const customer = await Customer.findById(req.body.customerId)
	if (!customer) return res.status(400).send('Invaild Customer')
	const movie = await Movie.findById(req.body.movieId)
	if (!movie) return res.status(400).send('Invalid movie')
	if (movie.numberInStock === 0) return res.status(400).send('Movie out of stock')

	const rental = new Rental({
		customer: {
			_id: customer._id,
			name: customer.name,
			phone: customer.phone
		},
		movie: {
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate
		}
	})
	const itemToUpdate = { _id: movie._id }
	const paramsToUpdate = { $inc: { numberInStock: -1 } }

	// esto simula una transaccion
	try {
		new Fawn.Task()
			.save('rentals', rental)
			.update('movies', itemToUpdate, paramsToUpdate)
			.run()

			res.send(rental)
	} catch (error) {
		res.status(500).send('Something went wrong')
	}
})

module.exports = router;
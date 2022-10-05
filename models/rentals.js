const mongoose = require('mongoose');


const rentalSchema = new mongoose.Schema({
	customer: {
		type: new mongoose.Schema({
			name: { type: String, required: true, minlength: 5, maxlength: 50 },
			isGold: { type: Boolean, dafault: false },
			phone: { type: String, required: true, ninlength: 5, maxlength: 50 }
		}),
		required: true
	},
	movie: {
		type: {
			title: { type: String, required: true, minlength: 2, maxlength: 255, trim: true },
			dailyRentalRate: { type: Number, required: true, minlength: 0, maxlength: 255 }
		},
		required: true
	},
	dateOut: {
		type: Date,
		required: true,
		default: Date.now
	},
	dateReturned: {
		type: Date,
	},
	rentalFee: {
		type: Number,
		minlength: 0
	}
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
	const schema = Joi.object({
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required()
	});
	return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;

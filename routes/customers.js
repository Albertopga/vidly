const express = require('express');
const router = express.Router();
const { Customer, validateBody } = require('../models/customer');

router.get('/', async (req, res) => {
    const reqValidation = validateBody(req.body);
    if(reqValidation.error) return res.status(404).send(reqValidation.error.details[0].message);

    const result = await Customer.find().sort('name');
    return res.status(200).send(result);
});

router.get('/:id', async(req, res) => {
    const reqValidation = validateBody(req.body);
    if(reqValidation.error) return res.status(404).send(reqValidation.error.details[0].message);

    const customer = await Customer.findById( req.params.id);

    if(!customer) return res.status(404).send('customer not found');
    res.status(200).send(customer);
});

router.post('/', async (req, res) => {
    const reqValidation = validateBody(req.body);
    if(reqValidation.error) return res.status(404).send(reqValidation.error.details[0].message);

    let customer = new Customer( {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    });
    customer = await customer.save();

    res.status(200).send(customer);
});

router.put('/:id', async (req, res) => {
    const reqValidation = validateBody(req.body);
    if(reqValidation.error) return res.status(404).send(reqValidation.error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.name }, { new: true });

    if(!customer) return res.status(404).send('customer to edit not found');
    res.status(200).send(customer);
});

router.delete(`/:id`, async(req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if(!customer) return res.status(404).send('customer to delete not found')

    res.status(200).send(customer);
});

module.exports = router;
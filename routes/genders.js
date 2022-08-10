const CONTEXT = '/'
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const mockGenders = [
    { id: 1, gender: 'Action'},
    { id: 2, gender: 'Comedy'},
    { id: 3, gender: 'Drama'}
];

const validateBody = (body) => {
    const schema = Joi.object({
        gender: Joi.string().min(4).required()
    })
    return schema.validate(body);
};

router.get(`${CONTEXT}`, (req, res) => {
    res.status(200).send(mockGenders);
});

router.get(`${CONTEXT}/:id`, (req, res) => {
    const gender = mockGenders.find( gender => gender.id === parseInt(req.params.id));

    if(!gender) return res.status(404).send('Gender not found');
    res.status(200).send(mockGenders[req.params.id]);
});

router.post(`${CONTEXT}`, (req, res) => {
    const reqValidation = validateBody(req.body);

    if(reqValidation.error) return res.status(404).send(reqValidation.error.details[0].message) ;

    const newGender = {
        id: mockGenders.length + 1,
        name: req.body.name
    }
    mockGenders.push(newGender);
    res.status(200).send(mockGenders);

});

router.patch(`${CONTEXT}/:id`, (req, res) => {
    const reqValidation = validateBody(req.body);
    const genderToEdit = mockGenders.find( gender => gender.id === parseInt(req.params.id));

    if(reqValidation.error) return res.status(404).send(reqValidation.error.details[0].message);
    if(!genderToEdit) return res.status(404).send('Gender to edit not found');

    genderToEdit.gender = req.gender;

    res.status(200).send(mockGenders);
});

router.delete(`${CONTEXT}/:id`, (req, res) => {
    if(req.params.id > mockGenders.length) return res.status(404).send('Gender to delete not found')

    res.status(200).send(mockGenders.splice(req.params.id -1, 1));
});


module.exports = router;
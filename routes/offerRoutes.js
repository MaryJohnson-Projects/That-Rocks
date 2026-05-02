const express = require('express');
const controller = require('../controllers/offerController');
const {isLoggedIn, isOwner, isNotOwner} = require('../middleware/auth');
const {validateId, validateOfferId, validateOffer, validateResult} = require('../middleware/validator');

const router = express.Router({mergeParams: true});

//GET /items/:id/offers: send all offers to the user
router.get('/', validateId, isLoggedIn, isOwner, controller.index);

//POST /items/:id/offers: create a new offer
router.post('/', validateId, isLoggedIn, isNotOwner, validateOffer, validateResult, controller.create);

//POST /items/:id/offers/:offerid: accept an offer
router.post('/:offerid', validateId, validateOfferId, isLoggedIn, isOwner, controller.accept);

module.exports = router;
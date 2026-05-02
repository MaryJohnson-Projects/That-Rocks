const express = require('express');
const offerRoutes = require('./offerRoutes');
const controller = require('../controllers/itemController');
const { upload } = require('../middleware/fileUpload');
const {isLoggedIn, isOwner} = require('../middleware/auth');
const {validateId, validateItem, validateEditedItem, validateResult} = require('../middleware/validator');

const router = express.Router();

//GET /items: send all items to the user
router.get('/', controller.index);

//GET /items/new: send html form for making a new item
router.get('/new', isLoggedIn, controller.new);

//POST /items: create a new item
router.post('/', isLoggedIn, upload, validateItem, validateResult, controller.create);

//GET /items/:id: send details of item identified by id
router.get('/:id', validateId, controller.show);

//GET /items/:id/edit: send html form for editing existing item
router.get('/:id/edit', isLoggedIn, isOwner, controller.edit);

//POST /items/:id: update item identified by id
router.put('/:id', isLoggedIn, validateId, isOwner, upload, validateEditedItem, validateResult, controller.update);

//DELETE /items/:id: delete item identified by id
router.delete('/:id', isLoggedIn, validateId, isOwner, controller.delete);

router.use('/:id/offers', offerRoutes);

module.exports = router;
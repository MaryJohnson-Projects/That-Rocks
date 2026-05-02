const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateOfferId = (req, res, next) => {
    let id = req.params.offerid;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [
    body('firstname', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastname', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min:8, max:64})
];

exports.validateLogIn = [
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min:8, max:64})
];

exports.validateItem = [
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('condition', 'Condition must match one of the folowing: Good, Okay, Poor, Damaged, Other.').notEmpty().trim().escape().isIn(['Good', 'Okay', 'Poor', 'Damaged', 'Other']),
    body('price', 'Price must be a valid USD amount greater than 0.').notEmpty().trim().escape().isCurrency({allow_negatives: false}),
    body('details', 'Details cannot be empty.').notEmpty().trim().escape(),
];

exports.validateEditedItem = [
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('condition', 'Condition must match one of the folowing: Good, Okay, Poor, Damaged, Other.').notEmpty().trim().escape().isIn(['Good', 'Okay', 'Poor', 'Damaged', 'Other']),
    body('price', 'Price must be a valid USD amount greater than 0.').notEmpty().trim().escape().isCurrency({allow_negatives: false}),
    body('details', 'Details cannot be empty.').notEmpty().trim().escape()
];

exports.validateOffer = [
    body('amount', 'Amount must be a valid USD amount greater than 0.').notEmpty().trim().escape().isCurrency({allow_negatives: false})
];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}
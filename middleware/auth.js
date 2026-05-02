const Item = require('../models/item');

exports.isGuest = (req, res, next) => {
    if(!req.session.user){
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

exports.isLoggedIn = (req, res, next) => {
    if(req.session.user){
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

exports.isOwner = (req, res, next) => {
    let id = req.params.id;
    Item.findById(id)
    .then(item => {
        if(item){
            if(item.seller == req.session.user) {
                return next();
            } else {
                console.log(item.seller);
                console.log(req.session.user);
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a listing with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.isNotOwner = (req, res, next) => {
    let id = req.params.id;
    Item.findById(id)
    .then(item => {
        if(item){
            if(item.seller != req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a listing with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};
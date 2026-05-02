const model = require('../models/item');
const Offer = require('../models/offer');

exports.index = (req, res, next) =>{
    //res.send('send all items');
    if (req.query.search) {
        terms = req.query.search.toLowerCase().split(" ");
        
        let regexStr = "(";
        let count = 0;
        terms.forEach( term => {
            if (count!=0){regexStr = regexStr + "|";}
            count++;
            regexStr = regexStr + term;
        });
        regexStr = regexStr + ")";

        model.find({$or: [
            { title: { $regex: regexStr, $options: "i" } },
            { details: { $regex: regexStr, $options: "i" } },
            ],
        }).sort({price: 'asc'})
        .then(items=>res.render('./item/search', {items}))
        .catch(err=>next(err));

    } else {
        model.find().sort({price: 'asc'})
        .then(items=>res.render('./item/index', {items}))
        .catch(err=>next(err));
    } 
};

exports.new = (req, res) =>{
    //res.send('send the new form');
    res.render('./item/new');
};

exports.create = (req, res, next) =>{
    let item = new model(req.body);
    item.seller = req.session.user;
    if(req.file){item.image = req.file.filename;}
    item.save()
    .then(item=>{
        req.flash('success', 'listing posted successfully'); 
        res.redirect('/items');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);  
            return res.redirect('back');
        }
        next(err);
    });
};

exports.show = (req, res, next) =>{
    let id = req.params.id;
    model.findById(id).populate('seller', 'firstname lastname')
    .then(item => {
        console.log(item);
        if(item) {
            return res.render('./item/show', {item});
        } else {
            let err = new Error('Cannot find a listing with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
    
};

exports.edit = (req, res, next) =>{
    //res.send('send the edit form');
    let id = req.params.id;
    model.findById(id)
    .then(item => {
        if(item) {
            return res.render('./item/edit', {item});
        } else {
            let err = new Error('Cannot find a listing with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next) =>{
    //res.send('update item with id ' + req.params.id);
    let item = req.body;
    let id = req.params.id;
    if(req.file){item.image = req.file.filename;}

    model.findByIdAndUpdate(id, item, {useFindAndModify: false, runValidators: true})
    .then(item=>{
        if(item){
            req.flash('success', 'listing updated successfully'); 
            res.redirect('/items/'+id);
        } else {
            let err = new Error('Cannot find a listing with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);  
            return res.redirect('back');
        }
        next(err)
    });
};

exports.delete = (req, res, next) =>{
    //res.send('delete item with id ' + req.params.id);
    let id = req.params.id;

    Promise.all([
        model.findByIdAndDelete(id, {useFindAndModify: false}),
        Offer.deleteMany({item: id}, {useFindAndModify: false})
    ]).then(item =>{
        if(item){
            req.flash('success', 'listing deleted successfully');
            res.redirect('/items');
        } else {
            let err = new Error('Cannot find a listing with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

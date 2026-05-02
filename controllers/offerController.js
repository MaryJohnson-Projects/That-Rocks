const model = require('../models/offer');
const User = require('../models/user');
const Item = require('../models/item');

exports.index = (req, res, next)=>{
    let id = req.params.id;
    Promise.all([Item.findById(id), 
        model.find({item: id}).populate('item', 'title')])
    .then(results=>{
        const [item, offers] = results;
        res.render('./offer/show', {item, offers});
    })
    .catch(err=>next(err));
};

exports.create = (req, res, next)=>{
    let offer = new model(req.body);
    let id = req.params.id;
    offer.user = req.session.user;
    offer.item = id;
    offer.save()
    .then(offer=> {
        Item.findByIdAndUpdate(id, 
            { $max: { highestOffer: offer.amount},   
            $inc: { totalOffers: 1 } }, 
            {useFindAndModify: false, runValidators: true})
        .then(item=>{
            if(item){
                req.flash('success', 'offer sent successfully'); 
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
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);  
            return res.redirect('back');
        }
        next(err);
    }); 
};

//POST /items/:id/offers/:offerid: accept an offer
exports.accept = (req, res, next)=>{
    let id = req.params.id;
    let offerid = req.params.offerid;
        
    Promise.all([model.findByIdAndUpdate(offerid, {status: 'accepted'}, {useFindAndModify: false, runValidators: true}), 
        Item.findByIdAndUpdate(id, {active: false}, {useFindAndModify: false, runValidators: true})])
    .then(results=>{
        model.updateMany({$and: [{item: id}, {status: 'pending'}]}, {status: 'rejected'}, {useFindAndModify: false, runValidators: true})
        .then(items=>{
            res.redirect('/items/'+id+'/offers');
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));
};
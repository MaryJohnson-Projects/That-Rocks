const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    details: {type: String, required: [true, 'details are required']},
    seller: {type: Schema.Types.ObjectId, ref:'User', required: [true, 'seller is required']},
    condition: {type: String, enum: ['Good', 'Okay', 'Poor', 'Damaged', 'Other'], required: [true, 'condition is required']},
    price: {type: Number, min: [0.01, 'you must list a price'], required: [true, 'title is required']},
    totalOffers: {type: Number, default: 0},
    highestOffer: {type: Number, default: 0},
    image: {type: String, required: [true, 'image is required']},
    active: {type: Boolean, default: true}
},
{timestamps: true}
);


// Collection name is items in the database
module.exports = mongoose.model('Item', itemSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    amount: {type: Number, min: [0.01, 'offer amount must be greater than $0.00'], required: [true, 'amount is required']},
    status: {type: String, enum: ['pending', 'rejected', 'accepted'], default: 'pending'},
    item: {type: Schema.Types.ObjectId, ref:'Item', required: [true, 'item is required']},
    user: {type: Schema.Types.ObjectId, ref:'User', required: [true, 'user is required']}
},
{timestamps: true}
);


// Collection name is offers in the database
module.exports = mongoose.model('Offer', offerSchema);
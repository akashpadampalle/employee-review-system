const mongoose = require('mongoose');

const userSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    ratedBy: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ['employee', 'admin'],
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    position: {
        type: String,
        default: 'Not defined'
    },
    AdminRank: {
        type: Number,
        default: Number.MAX_VALUE
    },
    pedingFeedbacks: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'feedback',
            required: true
        }
    ]
}, {timestamps: true});


const User = mongoose.model('user', userSchema);

module.exports = User;
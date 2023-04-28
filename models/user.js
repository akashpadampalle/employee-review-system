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
        ref: 'Company',
        required: true
    },
    position: {
        type: String,
        default: 'Not defined'
    },
    adminRank: {
        type: Number,
        default: Number.MAX_VALUE
    },
    pendingFeedbacks: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        }
    ]
}, {timestamps: true});


const User = mongoose.model('User', userSchema);

module.exports = User;
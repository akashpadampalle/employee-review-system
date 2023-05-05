const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    type: {
        type: String,
        required: true,
        enum: ['employee', 'admin']
    },
    adminRank: {
        type: Number,
        default: Number.MAX_VALUE
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    feedbackRecieved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    }],
    feedbackPending: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    rating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;
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
        type: String
    },
    AdminRank: {
        type: Number,
        default: Number.MAX_VALUE
    },
    pedingFeedbacks: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            required: true
        }
    ]
}, {timestamps: true});


const User = mongoose.model('user', userSchema);

module.exports = User;
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    ratedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    ratedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
}, {timestamps: true});


const Feedback = mongoose.model('feedback', feedbackSchema);
module.exports = Feedback;
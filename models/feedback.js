const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    log: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    }
}, { timestamps: true });


const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
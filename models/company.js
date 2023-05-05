const mongoose = require('mongoose');

companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });


const Company = mongoose.model('Company', companySchema);

module.exports = Company;
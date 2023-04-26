const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        }
    ]

},{
    timestamps:true
});


const Company = mongoose.model('company', companySchema);


module.exports = Company;
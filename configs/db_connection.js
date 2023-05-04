const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/employee_review_system';
mongoose.connect(url);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error: connecting to db :: MongoDB'));
db.once('open', (err) => {
    if (err) {
        console.log('Error: while opening db connection', err);
    } else {
        console.log('DB connection successfull :: MongoDB');
    }
})


module.exports = db;
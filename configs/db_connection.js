const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/employee_review_system'; // mongoodb url
mongoose.connect(url); // connecting to db

const db = mongoose.connection; // getting connection of db

db.on('error', console.error.bind(console, 'Error: connecting to db :: MongoDB')); // if error while conecting to db


// once connection is open (started)
db.once('open', (err) => {
    if (err) {
        console.log('Error: while opening db connection', err);
    } else {
        console.log('DB connection successfull :: MongoDB');
    }
})


module.exports = db;
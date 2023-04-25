const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/gradeUpDB');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'ERROR: connecting to db :: MongoDB'));

db.once('open', ()=>{
    console.log('db conection successful :: MongoDB');
});


module.exports = db;
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const db = require('./configs/db_connection');
const PORT  = process.env.PORT || 8000;

const app = express();

app.use(express.json()) // parsing json object
app.use(express.urlencoded()); // handling encoded request body


// setting up ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.use('/', require('./routes/index'));


app.listen(PORT, function(err) {
    if(err){
        console.log(`ERROR: ${err}`);
        return;
    }

    console.log(`Server is up and running at port ${PORT}`);
})
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const PORT = process.env.PORT || 8000;


const app = express();

// ejs setup
app.use(expressLayouts());
app.set('view engine', 'ejs');
app.set('views', 'views');

// extract scripts and styles from webpage body
app.set('extractStyles', true);
app.set('extractScripts', true);


app.listen(PORT, (err) => {
    if (err) {
        console.log('Error while starting server: ', err);
    } else {
        console.log(`server is up and running at port ${PORT}`);
    }
})
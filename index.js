const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const db = require('./configs/db_connection');


//passport and session requirements
const passport = require('passport');
const localStrategy = require('./configs/passport_local_strategy');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');



const PORT = process.env.PORT || 8000;


const app = express();

app.use(express.json()); // convert json into javascript object
app.use(express.urlencoded({ extended: true })); // decode encoded url request from client
app.use(cookieParser());

// static file
app.use(express.static(path.join(__dirname, 'public')));

// session setup
app.use(session({
    name: 'ERS',
    secret: 'somescrete',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/employee_review_system',
        collectionName: 'session',
        autoRemove: 'native'
    })
}))


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// ejs setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', 'views');

// extract scripts and styles from webpage body
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.use('/', require('./routes/index')); // setting up routing file


app.listen(PORT, (err) => {
    if (err) {
        console.log('Error while starting server: ', err);
    } else {
        console.log(`server is up and running at port ${PORT}`);
    }
})
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const db = require('./configs/db_connection');

// session and passport
// const passport = require('passport');
// const localStrategy = require('./configs/passport_local_strategy');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const cookieParser = require('cookie-parser');

const PORT  = process.env.PORT || 8000;

const app = express();

app.use(express.json()) // parsing json object
app.use(express.urlencoded({extended: true})); // handling encoded request body
// app.use(cookieParser()); 

app.use(express.static(path.join(__dirname, 'public'))); // static | public file 

// app.use(session({
//     name: 'GradeUp - ERS',
//     saveUninitialized: false,
//     resave: false,
//     secret: 'veryverysecretekey',
//     cookie: {
//         maxAge: 1000*60*60*24 // one day
//     },
//     store: MongoStore.create({
//         mongoUrl: 'mongodb://127.0.0.1:27017/gradeUpDB',
//         collectionName: 'session',
//         autoRemove: 'native'
//     })
// }))

// app.use(passport.initialize());
// app.use(passport.session());
// app.use(passport.setAuthenticatedUser);

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
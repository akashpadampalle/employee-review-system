const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    
    try {
        // find user by its email ID
        const user = await User.findOne({email: email});
        //if we don't find email return from here saying authentication false
        if(!user || user.password != password){ return done(null, false); }
        return done(null, user);
    
    } catch (error) {
        console.error('Error: ', error);
        return done(null, false);
    } 

}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if(!user) { return done(new Error('unable to find user '), false); }
        user.password = undefined;
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});


passport.checkAuthentication = function (req, res, next){
    if(req.isAuthenticated()){    return next();  }
    return res.redirect('/login');
}


passport.setAuthenticatedUser = function (req, res, next){
    if(req.isAuthenticated()){
        req.user.password = undefined;    
        res.locals.user = req.user;   
    }
    next();
}


module.exports = passport;

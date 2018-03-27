/**
 * Created by annae on 27.03.2018.
 */
const express = require('express');
const passport = require('passport');
const Strategy  = require('passport-vkontakte').Strategy;

const app = express();

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new Strategy(
    {
        clientID: 6424574,
        clientSecret: "I39onZFBbrhFtU8ncHy9",
        callbackURL: "http://localhost:3000/login/vkontakte/return"
    },
    function verify(accessToken, refreshToken, params, profile, done) {
        return done(null, profile);
    }
));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(require('cookie-parser')());
app.use(require('body-parser')());
app.use(require('express-session')({secret: 'keyboard cat', resave: true, saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', function (req, res) {
    res.render('home', {user: req.user});
});

app.get('/profile', ensureAuthenticated, function (req, res) {
    res.render('profile', {user: req.user});
});

app.get('/login', function (req, res) {
    res.render('login', {user: req.user});
});

app.get("/login/vkontakte", passport.authenticate("vkontakte"));

app.get(
    "/login/vkontakte/return",
    passport.authenticate("vkontakte", { failureRedirect: "/login" }),
    function(req, res) {
        res.redirect("/api/random");
    }
);

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get(
    "/api/random",
    require("connect-ensure-login").ensureLoggedIn(),
    function(req, res) {
        let mas = [];
        for (let i = 0; i < 5; i++) {
            mas.push(Math.ceil(Math.random() * 10));
        }
        res.json(mas);
    }
);

app.listen(3000,()=>{
    console.log("Server started");
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

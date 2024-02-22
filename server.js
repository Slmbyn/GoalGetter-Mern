// Load express
const express = require('express');

const path = require('path');
const logger = require('morgan');
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const router = require('express').Router();

require('dotenv').config()

// Models
const TodoModel = require('./Models/Todo')


// Connect to the database
require('./config/database');

require('./config/passport');

// Create our express app
const app = express();

// This line tells Express to use morgan middleware in "dev" mode, which logs HTTP requests to the console with colorful status codes.
app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build'))); // DOUBLE CHECK THE BUILD DIRECTORY AFTER SETTING UP REACT
app.use(passport.initialize());
app.use(passport.session());


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

// API Routes:
app.post('/add', (req, res) => {
    const task = req.body.task;
    TodoModel.create({
        task: task
    }).then(result => res.json(result))
    .catch(err => res.json(err))
})

// User Login Routes:

    // Google OAuth login route
router.get('/auth/google', passport.authenticate(
    // Which passport strategy is being used?
    'google',
    {
      // Requesting the user's profile and email
      scope: ['profile', 'email'],
      // Optionally force pick account every time
      // prompt: "select_account"
    }
));

    // Google OAuth callback route
    // Google will call after the user confirms
router.get('/oauth2callback', passport.authenticate(
    'google',
    {
      successRedirect: '/home',
      failureRedirect: '/home'
    }
));

// OAuth logout route
router.get('/logout', function(req, res){
    req.logout(function() {
      res.redirect('/home');
    });
  });

// Tell the app to listen on port 3000
// for HTTP requests from clients
const port = process.env.PORT || 3001;

app.listen(port, function() {
    console.log(`Express Backend running on port ${port}`)
});
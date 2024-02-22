// Load express
const express = require('express');

const path = require('path');
const logger = require('morgan');
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const TodoModel = require('./Models/Todo')

require('dotenv').config()

// Connect to the database
require('./config/database');

// Create our express app
const app = express();

// This line tells Express to use morgan middleware in "dev" mode, which logs HTTP requests to the console with colorful status codes.
app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build'))); // DOUBLE CHECK THE BUILD DIRECTORY AFTER SETTING UP REACT

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

// API Routes:
app.post('/add', (req, res) => {
    const task = req.body.task;
    TodoModel.create({
        task: task
    }).then(result => res.json(result))
    .catch(err => res.json(err))
})

// Tell the app to listen on port 3000
// for HTTP requests from clients
const port = process.env.PORT || 3001;

app.listen(port, function() {
    console.log(`Express Backend running on port ${port}`)
});
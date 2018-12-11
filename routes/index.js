const express = require('express');
const router = express.Router();

const crypto = require('crypto');
function hashPW(pwd){
    return crypto.createHash('sha256').update(pwd).
    digest('base64').toString();
}

/* Set up mongoose in order to connect to mongo database */
const mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://0.0.0.0:27017/simpleUsersDB'); //Connects to a mongo database

const usersSchema = mongoose.Schema({ //Defines the Schema for this database
    username: String,
    password: String
});

const User = mongoose.model('User', usersSchema); //Makes an object from that schema as a model

const db = mongoose.connection; // Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});

router.get('/get-user', function (req, res, next) {
    console.log('Getting Users');

    let pwd = hashPW(req.query.pkey);

    User.find({ username: req.query.username, password: pwd }, function (err, user) {
        if (err) return console.error(err); //If there's an error, print it out
        else {
            console.log(user);
            res.json(user);
        }
    });
});

router.get('/get-users', function (req, res, next) {
    console.log('Getting Users');

    User.find(function (err, users) {
        if (err) return console.error(err); //If there's an error, print it out
        else {
            console.log(users);
            res.json(users);
        }
    });
});

router.post('/register', function (req, res, next) {
    console.log('Registering user');

    let newUser = new User(req.body);
    console.log(newUser);
    newUser.password = hashPW(newUser.password);

    newUser.save(function (err, post) {
        if (err) return console.error(err);
        console.log(post);
        res.sendStatus(200);
    });
});

module.exports = router;

/**
 * Module for router.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

// Modules
const router = require('express').Router();
let Lifelist = require('../models/Lifelist');
let theSocket = require('./theSocket');
let register = require('./registerUser');
let login = require('./loginUser');
let fetchList = require('./fetchLists');
let createList = require('./createList');
let addGoal = require('./addGoal');
let setDeadline = require('./setDeadline');
let uploadImage = require('./uploadImage');
//let emptyDatabase = require('./emptyDatabase');

// Protection against CSRF attacks
let csrf = require('csurf');
let csrfProtection = csrf();

// Session variable
let sess;

// List variables
let bucket, life;

// My event emitter
let events = require('events');
class MyEmitter extends events {}
const myEmitter = new MyEmitter();
myEmitter.setMaxListeners(0);

// Socket connection variable to avoid multiple connections for one user
let connected = false;

// Middleware for authentication
let isAuthenticated = function(req, res, next) {
    let sess = req.session;

    // If not authenticated trigger a 403 error.
    if (!sess.username) {
        return res.status(403).redirect('/403');
    }
    next();
};

/* If authenticated show user page, else show login page and include csrfToken */
router.route('/').get(csrfProtection, function(req, res, next) {
    /*emptyDatabase.removeUser();
    emptyDatabase.removeBucketlist();
    emptyDatabase.removeLifelist();*/

    // If not connected to socket -> connect.
    if (!connected) {
        theSocket.theSocket(req, myEmitter, next);
        connected = true;
    }

    sess = req.session;
    // If logged in redirect to user page, else show login page.
    if (sess.username) {
        res.redirect('/user');
    } else {
        res.render('home/index', ({username: undefined, password: undefined}, {csrfToken: req.csrfToken()}));
    }
});

/* Show register page and include csrfToken. */
router.route('/register').get(csrfProtection, function(req, res) {
    sess = req.session;
    // If logged in redirect to user page, else show login page.
    if (sess.username) {
        res.redirect('/user');
    } else {
        res.render('home/register', ({username: undefined, password: undefined}, {csrfToken: req.csrfToken()}));
    }
});

/* If csrfToken is valid save new user to database. */
router.route('/register').post(csrfProtection, function(req, res, next) {
    register.registerUser(req, res, next);
});

/* If csrfToken is valid, user exist and password is correct: log in user. */
router.route('/login').post(csrfProtection, function(req, res, next) {
    login.loginUser(req, res, sess, next);
});

/* If authenticated, show user page and fetch users lists. */
router.route('/user').get(isAuthenticated, function(req, res) {
    sess = req.session;

    // Fetch lists and render user page
    Promise.all([fetchList.bucketlist(req, res, sess)]).then(function(theBucketlists) {
        return Promise.resolve(theBucketlists);
    }).then(function(theBLists) {
        // Set bucket to return value
        bucket = theBLists;
        let theLList = fetchList.lifelist(req, res, sess);
        return theLList;
    }).then(function(theLifelist) {
        // Set life to return value
        life = theLifelist;
    }).then(function() {
        // Render userpage with bucketlists and lifelist
        res.render('home/userPage', ({bucketlists: bucket[0], lifelist: life, username: sess.username}));
    }).catch(function(error) {
        console.log('ERROR:', error);
    });
});

/* If authenticated, destroy session and redirect to login page. */
router.route('/logout').get(isAuthenticated, function(req, res) {
    sess = req.session;
    if (sess.username) {
        // LOG OUT!
        req.session.destroy();
        res.redirect('/');
    }
});

/* If authenticated, show create page for bucketlist. Use csrfToken. */
router.route('/createBucketlist/:username').get(isAuthenticated, csrfProtection, function(req, res) {
    res.render('home/createBucketlist', ({title: undefined, username: req.params.username, csrfToken: req.csrfToken()}));
});

/* If authenticated and the csrfToken is valid, post bucketlist to userpage. */
router.route('/createBucketlist/:username').post(isAuthenticated, csrfProtection, function(req, res, next) {
    createList.bucketlist(req, res, next);
});

/* If authenticated and user does not have a lifelist -> show create page for lifelist. Use csrfToken. */
router.route('/createLifelist/:username').get(isAuthenticated, csrfProtection, function(req, res) {
    Lifelist.findOne({user: req.params.username}).exec()
        .then(function(data) {
            if (data) {
                // Render userpage and show a message.
                res.render('home/userPage', {
                    validationErrors: ['You may only have one lifelist.'],
                    username: req.params.username,
                    bucketlists: bucket[0],
                    lifelist: life
                });
            } else {
                res.render('home/createLifelist', ({title: undefined, username: req.params.username, csrfToken: req.csrfToken()}));
            }
        });
});

/* If authenticated and the csrfToken is valid, post lifelist to userpage. */
router.route('/createLifelist/:username').post(isAuthenticated, csrfProtection, function(req, res, next) {
    createList.lifelist(req, res, next);
});

/* If authenticated, show create page for goal. Use csrfToken. */
router.route('/addGoal/:id/:username').get(isAuthenticated, csrfProtection, function(req, res) {
    res.render('home/addGoal', ({goal: undefined, id: req.params.id, username: req.params.username, list: req.query.list, csrfToken: req.csrfToken()}));
});

/* If authenticated and the csrfToken is valid, post goal to specified list. */
router.route('/addGoal/:id/:username/:list').post(isAuthenticated, csrfProtection, function(req, res, next) {
    addGoal.addGoal(req, res, next);
});

/* If authenticated and deadline not already set -> show create page for deadline. Use csrfToken. */
router.route('/setDeadline/:id/:username').get(isAuthenticated, csrfProtection, function(req, res) {
    setDeadline.checkSet(req, res, bucket, life);
});

/* If authenticated and the csrfToken is valid, post deadline to specified list. */
router.route('/setDeadline/:id/:username/:list').post(isAuthenticated, csrfProtection, function(req, res, next) {
    setDeadline.setDeadline(req, res, next);
});

/* If authenticated, connect to chat. */
router.route('/chat/:username').get(isAuthenticated, function(req, res) {
    res.render('home/chat', ({username: req.params.username}));
    myEmitter.emit('new user', {message: req.params.username});
});

/* If authenticated, render uploading page. */
router.route('/uploads/:id/:username').get(isAuthenticated, csrfProtection, function(req, res) {
    res.render('home/uploads', ({id: req.params.id, username: req.params.username, list: req.query.list, csrfToken: req.csrfToken()}));
});

/* If authenticated, post image and text to specified list. */
router.route('/uploads/:id/:username/:list').post(isAuthenticated, csrfProtection, function(req, res, next) {
    uploadImage.uploadImage(req, res, next);
});

/* If authenticated, render inspiration page. */
router.route('/inspiration/:username').get(isAuthenticated, function(req, res) {
    res.render('home/inspiration', ({bucketlists: bucket[0], lifelist: life, username: req.params.username}));
});

/* If authenticated, render memories page. */
router.route('/memories/:username').get(isAuthenticated, function(req, res) {
    res.render('home/memories', ({bucketlists: bucket[0], lifelist: life, username: req.params.username}));
});

/* ERROR HANDLING */
router.route('/403').get(csrfProtection, function(req, res) {
    res.render('home/index', ({
        validationErrors: ['403 Forbidden. You have to be logged in to do that.'],
        csrfToken: req.csrfToken()}
    ));
});

router.route('/404').get(csrfProtection, function(req, res) {
    if (sess.username) {
        res.render('home/userPage', ({
            bucketlists: bucket[0],
            lifelist: life,
            username: sess.username,
            validationErrors: ['404 Not Found. We could not find what you were looking for.']
        }));
    } else {
        res.render('home/index', ({
            validationErrors: ['404 Not Found. We could not find what you were looking for.'],
            csrfToken: req.csrfToken()}
        ));
    }
});

router.route('/500').get(csrfProtection, function(req, res) {
    if (sess.username) {
        res.render('home/userPage', ({
            bucketlists: bucket[0],
            lifelist: life,
            username: sess.username,
            validationErrors: ['500 Internal Error. Something went wrong on our end.']
        }));
    } else {
        res.render('home/index', ({
            validationErrors: ['500 Internal Error. Something went wrong on our end.'],
            csrfToken: req.csrfToken()}
        ));
    }
});


// Export the module
module.exports = router;

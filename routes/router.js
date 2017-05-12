/**
 * Module for router.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

const router = require('express').Router();
let Lifelist = require('../models/Lifelist');
let Bucketlist = require('../models/Bucketlist');
let register = require('./registerUser');
let login = require('./loginUser');
let fetchList = require('./fetchLists');
let createList = require('./createList');
let addGoal = require('./addGoal');
let setDeadline = require('./setDeadline');
let uploadImage = require('./uploadImage');
//let emptyDatabase = require('./emptyDatabase');
let csrf = require('csurf');

// Protection against CSRF attacks
let csrfProtection = csrf();

// Session variable
let sess;

let bucket, life;

let events = require('events');
class MyEmitter extends events {}
const myEmitter = new MyEmitter();
myEmitter.setMaxListeners(0);

// Global variable
let connected = false;

// Middleware for authentication
let isAuthenticated = function(req, res, next) {
    let sess = req.session;

    // If not authenticated trigger a 403 error.
    if (!sess.username) {
        return res.status(403).render('error/403');
    }
    next();
};


router.route('/').get(/*csrfProtection,*/ function(req, res) {
    /*emptyDatabase.removeUser();
    emptyDatabase.removeBucketlist();
    emptyDatabase.removeLifelist();*/
    if (!connected) {
        let io = require('socket.io')(req.socket.server);

        // When client connects to socket.io.
        io.on('connection', function(socket) {
            connected = true;
            console.log('Connected to socket.');

            // Receive data from the client
            socket.on('checked', function(box) {
                if (box.list === 'bucketlist') {
                    Bucketlist.findById(box.id).exec()
                       .then(function(data) {
                           for (let i = 0; i < data.goals.length; i += 1) {
                               if (data.goals[i].title === box.message) {
                                   if (data.goals[i].checked === false) {
                                       data.goals[i].checked = true;
                                   }
                               }
                               data.save();
                           }
                       });
                } else if (box.list === 'lifelist') {
                    Lifelist.findById(box.id).exec()
                       .then(function(data) {
                           for (let i = 0; i < data.goals.length; i += 1) {
                               if (data.goals[i].title === box.message) {
                                   if (data.goals[i].checked === false) {
                                       data.goals[i].checked = true;
                                   }
                               }
                               data.save();
                           }
                       });
                }
            });

            socket.on('unchecked', function(box) {
                if (box.list === 'bucketlist') {
                    Bucketlist.findById(box.id).exec()
                        .then(function(data) {
                            for (let i = 0; i < data.goals.length; i += 1) {
                                if (data.goals[i].title === box.message) {
                                    if (data.goals[i].checked === true) {
                                        data.goals[i].checked = false;
                                    }
                                }
                                data.save();
                            }
                        });
                } else if (box.list === 'lifelist') {
                    Lifelist.findById(box.id).exec()
                        .then(function(data) {
                            for (let i = 0; i < data.goals.length; i += 1) {
                                if (data.goals[i].title === box.message) {
                                    if (data.goals[i].checked === true) {
                                        data.goals[i].checked = false;
                                    }
                                }
                                data.save();
                            }
                        });
                }

            });

            /*socket.on('renderUploads', function(data) {
                socket.emit('goToUploads', {id: data.id, list: data.list});
                //res.redirect('/uploads/' + data.id + '/' + data.list);
            });*/

            socket.on('chat message', function(msg) {
                io.emit('print message', {msg: msg.message, user: msg.user});
            });

            myEmitter.on('new user', function(data) {
                // Send data to client
                socket.emit('new user', data.message);
            });

            socket.on('system message', function(data) {
                socket.emit('print message', {msg: data.message, user: data.user});
            });

            // The connection was closed
            socket.on('disconnect', function() {
                console.log('Closed Connection ');
            });
        });
    }

    sess = req.session;
    // If logged in redirect to user page, else show login page.
    if (sess.username) {
        res.redirect('/user');
    } else {
        res.render('home/index', ({username: undefined, password: undefined}/*, {csrfToken: req.csrfToken()}*/));
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
router.route('/login').post(/*csrfProtection,*/ function(req, res, next) {
    login.loginUser(req, res, sess, next);
});

/* If authenticated, show admin page and fetch users lists. */
router.route('/user').get(isAuthenticated, function(req, res/*, next*/) {
    sess = req.session;

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
router.route('/addGoal/:id').get(isAuthenticated, csrfProtection, function(req, res) {
    res.render('home/addGoal', ({goal: undefined, id: req.params.id, list: req.query.list, csrfToken: req.csrfToken()}));
});

/* If authenticated and the csrfToken is valid, post goal to specified list. */
router.route('/addGoal/:id/:list').post(isAuthenticated, csrfProtection, function(req, res, next) {
    addGoal.addGoal(req, res, next);
});

/* If authenticated, show create page for deadline. Use csrfToken. */
router.route('/setDeadline/:id').get(isAuthenticated, csrfProtection, function(req, res) {
    if (req.query.list === 'Bucketlist') {
        Bucketlist.findOne({_id: req.params.id}).exec()
            .then(function(data) {
                if (data.deadline) {
                    // Render userpage and show a message.
                    res.render('home/userPage', {
                        validationErrors: ['You have already set a deadline.'],
                        username: data.user,
                        bucketlists: bucket[0],
                        lifelist: life
                    });
                } else {
                    res.render('home/setDeadline', ({deadline: undefined, id: req.params.id, list: req.query.list, csrfToken: req.csrfToken()}));
                }
            });
    } else if (req.query.list === 'Lifelist') {
        Lifelist.findOne({_id: req.params.id}).exec()
            .then(function(data) {
                if (data.deadline) {
                    // Render userpage and show a message.
                    res.render('home/userPage', {
                        validationErrors: ['You have already set a deadline.'],
                        username: data.user,
                        bucketlists: bucket[0],
                        lifelist: life
                    });
                } else {
                    res.render('home/setDeadline', ({deadline: undefined, id: req.params.id, list: req.query.list, csrfToken: req.csrfToken()}));
                }
            });
    }
});

/* If authenticated and the csrfToken is valid, post deadline to specified list. */
router.route('/setDeadline/:id/:list').post(isAuthenticated, csrfProtection, function(req, res, next) {
    setDeadline.setDeadline(req, res, next);
});

/* If authenticated, connect to chat. */
router.route('/chat/:username').get(isAuthenticated, function(req, res) {
    myEmitter.emit('new user', {message: req.params.username});
    res.render('home/chat');
});

router.route('/uploads/:id/').get(isAuthenticated/*, csrfProtection*/, function(req, res) {
    res.render('home/uploads', ({id: req.params.id, list: req.query.list}));
});

/* If authenticated, post image and text to specified list. */
router.route('/uploads/:id/:list').post(isAuthenticated/*, csrfProtection*/, function(req, res, next) {
    uploadImage.uploadImage(req, res, next);
});


// Export the module
module.exports = router;

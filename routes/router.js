/**
 * Module for router.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

const router = require('express').Router();
let RegisterUser = require('../models/RegisterUser');
let Bucketlist = require('../models/Bucketlist');
let Lifelist = require('../models/Lifelist');
let Errors = require('./errorhandling');
let csrf = require('csurf');

// Protection against CSRF attacks
let csrfProtection = csrf();

// Session variable
let sess;

// Middleware for authentication
let isAuthenticated = function(req, res, next) {
    let sess = req.session;

    // If not authenticated trigger a 403 error.
    if (!sess.username) {
        return res.status(403).render('error/403');
    }
    next();
};



router.route('/').get(csrfProtection, function(req, res) {
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
    // Create a new user.
    let registerUser = new RegisterUser({
        username: req.body.username,
        password: req.body.password
    });

    // Save the user to the database.
    registerUser.save()
        .then(function() {
            // Redirect to login and show a message.
            req.session.flash = {type: 'success', text: 'The user was saved successfully. Please login.'};
            res.redirect('/');
        })
        .catch(function(err) {
            Errors.errorHandling(err, next, req, res, 'register');
        });
});

/* If csrfToken is valid, user exist and password is correct: log in user. */
router.route('/login').post(csrfProtection, function(req, res, next) {
    sess = req.session;
    // Look for user in database.
    RegisterUser.findOne({username: req.body.username}).exec()
        .then(function(data) {
            let result = function(err, match) {
                if (err) {
                    next(err);
                }

                if (match) {
                    sess.username = req.body.username;
                    res.redirect('/user');
                } else {
                    return res.render('home/index', {
                        validationErrors: ['Wrong password. Try again.'],
                        username: req.body.username
                    });
                }
            };

            // Compare password to password in database.
            data.comparePassword(req.body.password, result);
        })
        .catch(function(err) {
            if (TypeError) {
                return res.render('home/index', {
                    validationErrors: ['That user does not exist. Please register.']
                });
            }
            next(err);
        });

});

/* If authenticated, show admin page. */
router.route('/user').get(isAuthenticated, function(req, res, next) {
    sess = req.session;
    let bucket, life;

    Bucketlist.find({user: sess.username}).exec()
            .then (function(data) {
                // Map the data
                let context = {
                    bucketlists: data.map(function(bucketlist) {
                        return {
                            title: bucketlist.title,
                            createdAt: bucketlist.createdAt,
                            id: bucketlist.id
                        };
                    })
                };
                bucket = context.bucketlists;
            })
            .then (function() {
                Lifelist.find({user: sess.username}).exec()
                        .then (function(data) {
                            // Map the data
                            let context = {
                                lifelists: data.map(function(lifelist) {
                                    return {
                                        title: lifelist.title,
                                        createdAt: lifelist.createdAt,
                                        id: lifelist.id
                                    };
                                })
                            };
                            life = context.lifelists;
                        })
                        .then (function() {
                            res.render('home/userPage', ({bucketlists: bucket, lifelist: life, username: sess.username}));
                        })
                        .catch (function(err) {
                            res.render('home/userPage', {
                                // Use the flash partial to view the error message.
                                flash: {type: 'danger', text: err.message},
                                bucketlists: []
                            });
                            next(err);
                        });
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
router.route('/createBucketlist').get(isAuthenticated, csrfProtection, function(req, res) {
    res.render('home/createBucketlist', ({title: undefined}, {csrfToken: req.csrfToken()}));
});

/* If authenticated and the csrfToken is valid, post bucketlist to userpage. */
router.route('/createBucketlist').post(isAuthenticated, csrfProtection, function(req, res, next) {
    // Create a new bucketlist.
    let bucketlist = new Bucketlist({
        title: req.body.title,
        user: sess.username
    });

    // Save the bucketlist to the database.
    bucketlist.save()
        .then(function() {
            // Redirect to userpage and show a message.
            req.session.flash = {type: 'success', text: 'The bucketlist was saved successfully.'};
            res.redirect('/user');
        })
        .catch(function(err) {
            // If a validation error occurred, view the form and an error message.
            if (err.errors.value.name === 'ValidatorError') {
                // We handle the validation error!
                return res.render('home/createBucketlist', {
                    validationErrors: [err.errors.value.message],
                    title: req.body.title
                });
            }

            // Let the middleware handle any errors but ValidatorErrors.
            next(err);
        });
});

/* If authenticated, show create page for bucketlist. Use csrfToken. */
router.route('/createLifelist').get(isAuthenticated, csrfProtection, function(req, res) {
    res.render('home/createLifelist', ({title: undefined}, {csrfToken: req.csrfToken()}));
});

/* If authenticated and the csrfToken is valid, post bucketlist to userpage. */
router.route('/createLifelist').post(isAuthenticated, csrfProtection, function(req, res, next) {
    // Create a new bucketlist.
    let lifelist = new Lifelist({
        title: req.body.title,
        user: sess.username
    });

    // Save the lifelist to the database.
    lifelist.save()
        .then(function() {
            // Redirect to userpage and show a message.
            req.session.flash = {type: 'success', text: 'The lifelist was saved successfully.'};
            res.redirect('/user');
        })
        .catch(function(err) {
            // If a validation error occurred, view the form and an error message.
            if (err.errors.value.name === 'ValidatorError') {
                // We handle the validation error!
                return res.render('home/createLifelist', {
                    validationErrors: [err.errors.value.message],
                    title: req.body.title
                });
            }

            // Let the middleware handle any errors but ValidatorErrors.
            next(err);
        });
});

/* If authenticated, show create page for goal. Use csrfToken. */
router.route('/addGoal').get(isAuthenticated, csrfProtection, function(req, res) {
    res.render('home/addGoal', ({goal: undefined}, {csrfToken: req.csrfToken()}));
});

// Export the module
module.exports = router;

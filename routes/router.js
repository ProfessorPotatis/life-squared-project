/**
 * Module for router.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

const router = require('express').Router();
let RegisterUser = require('../models/RegisterUser');
let csrf = require('csurf');

// Protection against CSRF attacks
let csrfProtection = csrf();



router.route('/').get(function(req, res) {
    res.render('home/index');
});

/* Show register page and include csrfToken. */
router.route('/register').get(csrfProtection, function(req, res) {
    res.render('home/register', ({username: undefined, password: undefined}, {csrfToken: req.csrfToken()}));
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
            // If a validation error occurred, view the form and an error message.
            if (err.errors.username !== undefined && err.errors.username.name === 'ValidatorError') {
                // We handle the validation error!
                    return res.render('home/register', {
                        validationErrors: [err.errors.username.message],
                        password: req.body.password,
                        username: req.body.username
                    });
            } else if (err.errors.password !== undefined && err.errors.password.name === 'ValidatorError') {
                return res.render('home/register', {
                    validationErrors: [err.errors.password.message],
                    password: req.body.password,
                    username: req.body.username
                });
            } else if (err.errors.password.name === 'ValidatorError' && err.errors.username.name === 'ValidatorError') {
                return res.render('home/register', {
                    validationErrors: [err.errors.username.message, err.errors.password.message],
                    password: req.body.password,
                    username: req.body.username
                });
            }

            // Let the middleware handle any errors but ValidatorErrors.
            next(err);
        });
});

/* Show login page and include csrfToken. */
router.route('/login').get(csrfProtection, function(req, res) {
    res.render('home/login', ({username: undefined, password: undefined}, {csrfToken: req.csrfToken()}));
});

// Export the module
module.exports = router;

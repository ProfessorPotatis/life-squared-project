/**
 * Module for registering user.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let RegisterUser = require('../models/RegisterUser');

 /* If csrfToken is valid save new user to database. */
 function registerUser(req, res, next) {
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
                         username: req.body.username,
                         csrfToken: req.csrfToken()
                     });
             } else if (err.errors.password !== undefined && err.errors.password.name === 'ValidatorError') {
                 return res.render('home/register', {
                     validationErrors: [err.errors.password.message],
                     password: req.body.password,
                     username: req.body.username,
                     csrfToken: req.csrfToken()
                 });
             } else if (err.errors.password.name === 'ValidatorError' && err.errors.username.name === 'ValidatorError') {
                 return res.render('home/register', {
                     validationErrors: [err.errors.username.message, err.errors.password.message],
                     password: req.body.password,
                     username: req.body.username,
                     csrfToken: req.csrfToken()
                 });
             }

             // Let the middleware handle any errors but ValidatorErrors.
             next(err);
         });
 }

module.exports = {
    registerUser: registerUser
};

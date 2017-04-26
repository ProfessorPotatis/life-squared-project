/**
 * Module for signing in user.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let RegisterUser = require('../models/RegisterUser');

 /* If csrfToken is valid, user exist and password is correct: log in user. */
 function loginUser(req, res, sess, next) {
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

             // Compare input password to password in database.
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
 }

module.exports = {
    loginUser: loginUser
};

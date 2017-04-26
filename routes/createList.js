/**
 * Module for creating lists.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let Bucketlist = require('../models/Bucketlist');
 let Lifelist = require('../models/Lifelist');

 /* Create bucketlist and save to database */
 function bucketlist(req, res, next) {
     // Create a new bucketlist.
     let bucketlist = new Bucketlist({
         title: req.body.title,
         user: req.params.username
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
 }

/* Create lifelist and save to database */
 function lifelist(req, res, next) {
     // Create a new lifelist.
     let lifelist = new Lifelist({
         title: req.body.title,
         user: req.params.username
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
 }

module.exports = {
    bucketlist: bucketlist,
    lifelist: lifelist
};

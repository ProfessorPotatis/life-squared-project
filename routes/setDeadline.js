/**
 * Module for setting deadline on specific list.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let Bucketlist = require('../models/Bucketlist');
 let Lifelist = require('../models/Lifelist');

 /* Create goal and add to specified list */
 function setDeadline(req, res, next) {
     let list = req.params.list;

     if (list === 'Bucketlist') {
         Bucketlist.findOneAndUpdate(
             {_id: req.params.id},
             {deadline: req.body.deadline},
             function(err, model) {
                 if (err) {
                     console.log(err);
                     next(err);
                 }

                 // Redirect to userpage and show a message.
                 req.session.flash = {type: 'success', text: 'The deadline was saved successfully.'};
                 res.redirect('/user');
             }
         );
     } else if (list === 'Lifelist') {
         Lifelist.findOneAndUpdate(
             {_id: req.params.id},
             {deadline: req.body.deadline},
             function(err, model) {
                 if (err) {
                     console.log(err);
                     next(err);
                 }

                 // Redirect to userpage and show a message.
                 req.session.flash = {type: 'success', text: 'The deadline was saved successfully.'};
                 res.redirect('/user');
             }
         );
     }
 }

 function checkSet(req, res, bucket, life) {
     if (req.query.list === 'Bucketlist') {
         Bucketlist.findOne({_id: req.params.id}).exec()
             .then(function(data) {
                 if (data.deadline) {
                     // Render userpage and show a message.
                     res.render('home/userPage', ({
                         validationErrors: ['You have already set a deadline.'],
                         username: data.user,
                         bucketlists: bucket[0],
                         lifelist: life
                     }));
                 } else {
                     res.render('home/setDeadline', ({deadline: undefined, id: req.params.id, username: req.params.username, list: req.query.list, csrfToken: req.csrfToken()}));
                 }
             });
     } else if (req.query.list === 'Lifelist') {
         Lifelist.findOne({_id: req.params.id}).exec()
             .then(function(data) {
                 if (data.deadline) {
                     // Render userpage and show a message.
                     res.render('home/userPage', ({
                         validationErrors: ['You have already set a deadline.'],
                         username: data.user,
                         bucketlists: bucket[0],
                         lifelist: life
                     }));
                 } else {
                     res.render('home/setDeadline', ({deadline: undefined, id: req.params.id, username: req.params.username, list: req.query.list, csrfToken: req.csrfToken()}));
                 }
             });
     }
 }

module.exports = {
    setDeadline: setDeadline,
    checkSet: checkSet
};

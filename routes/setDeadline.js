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

module.exports = {
    setDeadline: setDeadline
};

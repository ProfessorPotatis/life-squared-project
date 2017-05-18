/**
 * Module for images to lists.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let Bucketlist = require('../models/Bucketlist');
 let Lifelist = require('../models/Lifelist');

 /* Upload image and add to specified list */
 function uploadImage(req, res, next) {
     let list = req.params.list;

     console.log(req.body.typeOfFile.includes('image/'));

     if (req.body.typeOfFile.includes('image/')) {
         if (list === 'Bucketlist') {
             Bucketlist.findOneAndUpdate(
                 {_id: req.params.id},
                 {$push: {'memories': {image: req.body.imgSrc, text: req.body.value}}},
                 {safe: true, upsert: true, new: true},
                 function(err, model) {
                     if (err) {
                         console.log(err);
                         next(err);
                     }

                     // Redirect to userpage and show a message.
                     req.session.flash = {type: 'success', text: 'The image and text was saved successfully.'};
                     res.redirect('/user');
                 }
             );
         } else if (list === 'Lifelist') {
             Lifelist.findOneAndUpdate(
                 {_id: req.params.id},
                 {$push: {'memories': {image: req.body.imgSrc, text: req.body.value}}},
                 {safe: true, upsert: true, new: true},
                 function(err, model) {
                     if (err) {
                         console.log(err);
                         next(err);
                     }

                     // Redirect to userpage and show a message.
                     req.session.flash = {type: 'success', text: 'The image and text was saved successfully.'};
                     res.redirect('/user');
                 }
             );
         }
     } else {
         res.render('home/uploads.hbs', ({validationErrors: ['You may only upload images.'], id: req.params.id, list: req.params.list}));
     }
 }

module.exports = {
    uploadImage: uploadImage
};

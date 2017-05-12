/**
 * Module for images to lists.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let Bucketlist = require('../models/Bucketlist');
 let Lifelist = require('../models/Lifelist');
 let fs = require('fs');

 /* Upload image and add to specified list */
 function uploadImage(req, res, next) {
     let list = req.params.list;

     fs.readFile(req.body.pic, function(err, data) {
         if (err) {
             throw err;
         }

         console.log(data);

         if (list === 'Bucketlist') {
             Bucketlist.findOneAndUpdate(
                 {_id: req.params.id},
                 {$push: {'images': {data: data, contentType: 'image/jpeg'}}},
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
                 {$push: {'images': {data: data, contentType: 'image/jpeg'}}},
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
     });

     /*if (list === 'Bucketlist') {
         console.log(req.body.pic);
         Bucketlist.findOneAndUpdate(
             {_id: req.params.id},
             {$push: {'images': {data: fs.readFile(req.body.pic), contentType: 'image/jpeg'}}},
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
             {$push: {'images': {data: fs.readFileSync(req.body.image), contentType: 'image/jpeg'}}},
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
     }*/
 }

module.exports = {
    uploadImage: uploadImage
};

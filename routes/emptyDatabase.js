/**
 * Module for removing content in database.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let RegisterUser = require('../models/RegisterUser');
 let Bucketlist = require('../models/Bucketlist');
 let Lifelist = require('../models/Lifelist');

 function removeUser() {
     RegisterUser.remove({}, function(err) {
         console.log('All registered users removed.');
     });
 }

 function removeBucketlist() {
     Bucketlist.remove({}, function(err) {
         console.log('All bucketlists removed.');
     });
 }

 function removeLifelist() {
     Lifelist.remove({}, function(err) {
         console.log('All lifelists removed.');
     });
 }

module.exports = {
    removeUser: removeUser,
    removeBucketlist: removeBucketlist,
    removeLifelist: removeLifelist
};

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

 /* Remove all users from database */
 function removeUser() {
     RegisterUser.remove({}, function(err) {
         if (err) {
             console.log(err);
         }
         console.log('All registered users removed.');
     });
 }

 /* Remove all bucketlists from database */
 function removeBucketlist() {
     Bucketlist.remove({}, function(err) {
         if (err) {
             console.log(err);
         }
         console.log('All bucketlists removed.');
     });
 }

 /* Remove all lifelists from database */
 function removeLifelist() {
     Lifelist.remove({}, function(err) {
         if (err) {
             console.log(err);
         }
         console.log('All lifelists removed.');
     });
 }

module.exports = {
    removeUser: removeUser,
    removeBucketlist: removeBucketlist,
    removeLifelist: removeLifelist
};

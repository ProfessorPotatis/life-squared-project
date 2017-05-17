/**
 * Module for fetching lists from database.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let Bucketlist = require('../models/Bucketlist');
 let Lifelist = require('../models/Lifelist');

 /* Fetch users bucketlists */
 function bucketlist(req, res, sess) {
     return new Promise(function(resolve, reject) {
         Bucketlist.find({user: sess.username}).exec()
                 .then (function(data) {
                     if (!data) {
                         reject();
                     }

                     // Map the data
                     let context = {
                         bucketlists: data.map(function(bucketlist) {
                             return {
                                 title: bucketlist.title,
                                 createdAt: bucketlist.createdAt,
                                 id: bucketlist.id,
                                 goals: bucketlist.goals,
                                 deadline: bucketlist.deadline,
                                 checked: bucketlist.checked,
                                 memories: bucketlist.memories,
                                 locked: bucketlist.locked
                             };
                         })
                     };
                     resolve(context.bucketlists);
                 });
             });
 }

/* Fetch users lifelist */
 function lifelist(req, res, sess) {
     return new Promise(function(resolve, reject) {
         Lifelist.find({user: sess.username}).exec()
                 .then (function(data) {
                     if (!data) {
                         reject();
                     }

                     // Map the data
                     let context = {
                         lifelists: data.map(function(lifelist) {
                             return {
                                 title: lifelist.title,
                                 createdAt: lifelist.createdAt,
                                 id: lifelist.id,
                                 goals: lifelist.goals,
                                 deadline: lifelist.deadline,
                                 checked: lifelist.checked,
                                 memories: lifelist.memories,
                                 locked: lifelist.locked
                             };
                         })
                     };
                     resolve(context.lifelists);
                 });
             });
 }

module.exports = {
    bucketlist: bucketlist,
    lifelist: lifelist
};

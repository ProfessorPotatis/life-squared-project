/**
 * Module for socket.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let Bucketlist = require('../models/Bucketlist');
 let Lifelist = require('../models/Lifelist');

 // Array of connected chat users
 let userArray = [];

 /* Socket.io */
 function theSocket(req, myEmitter, next) {
     let io = require('socket.io')(req.socket.server);

     // When client connects to socket.io.
     io.on('connection', function(socket) {
         console.log('Connected to socket.');

         /* Receive data from the client */
         // When checkbox is checked -> set lists checked value to true
         socket.on('checked', function(box) {
             if (box.list === 'bucketlist') {
                 Bucketlist.findById(box.id).exec()
                    .then(function(data) {
                        for (let i = 0; i < data.goals.length; i += 1) {
                            if (data.goals[i].title === box.message) {
                                if (data.goals[i].checked === false) {
                                    data.goals[i].checked = true;
                                }
                            }
                            data.save();
                        }
                    });
             } else if (box.list === 'lifelist') {
                 Lifelist.findById(box.id).exec()
                    .then(function(data) {
                        for (let i = 0; i < data.goals.length; i += 1) {
                            if (data.goals[i].title === box.message) {
                                if (data.goals[i].checked === false) {
                                    data.goals[i].checked = true;
                                }
                            }
                            data.save();
                        }
                    });
             }
         });

         // When checkbox is unchecked -> set lists checked value to false
         socket.on('unchecked', function(box) {
             if (box.list === 'bucketlist') {
                 Bucketlist.findById(box.id).exec()
                     .then(function(data) {
                         for (let i = 0; i < data.goals.length; i += 1) {
                             if (data.goals[i].title === box.message) {
                                 if (data.goals[i].checked === true) {
                                     data.goals[i].checked = false;
                                 }
                             }
                             data.save();
                         }
                     });
             } else if (box.list === 'lifelist') {
                 Lifelist.findById(box.id).exec()
                     .then(function(data) {
                         for (let i = 0; i < data.goals.length; i += 1) {
                             if (data.goals[i].title === box.message) {
                                 if (data.goals[i].checked === true) {
                                     data.goals[i].checked = false;
                                 }
                             }
                             data.save();
                         }
                     });
             }
         });

         // When padlock is clicked -> set lists locked value to true or false
         socket.on('lockList', function(box) {
             if (box.list === 'bucketlist') {
                 Bucketlist.findById(box.id).exec()
                    .then(function(data) {
                        if (data.locked === false) {
                            data.locked = true;
                        } else if (data.locked === true) {
                            data.locked = false;
                        }
                        data.save();
                    });
             } else if (box.list === 'lifelist') {
                 Lifelist.findById(box.id).exec()
                    .then(function(data) {
                        if (data.locked === false) {
                            data.locked = true;
                        } else if (data.locked === true) {
                            data.locked = false;
                        }
                        data.save();
                    });
             }
         });

         // When new goal is added to list -> save goal to list
         socket.on('addGoal', function(box) {
             if (box.list === 'bucketlist') {
                 Bucketlist.findOneAndUpdate(
                     {_id: box.id},
                     {$push: {'goals': {title: box.goal}}},
                     {safe: true, upsert: true, new: true},
                     function(err, model) {
                         if (err) {
                             console.log(err);
                             socket.emit('unsuccessful');
                             next(err);
                         }
                         socket.emit('success');
                     }
                 );
             } else if (box.list === 'lifelist') {
                 Lifelist.findOneAndUpdate(
                     {_id: box.id},
                     {$push: {'goals': {title: box.goal}}},
                     {safe: true, upsert: true, new: true},
                     function(err, model) {
                         if (err) {
                             console.log(err);
                             socket.emit('unsuccessful');
                             next(err);
                         }
                         socket.emit('success');
                     }
                 );
             }
         });

         // When chat message is sent by client -> print out message in chat
         socket.on('chat message', function(msg) {
             io.emit('print message', {msg: msg.message, user: msg.user, users: userArray});
         });

         // When new user connects to chat -> print out system message
         // in chat and add to list of connected users
         myEmitter.on('new user', function(data) {
             if (!userArray.includes(data.message)) {
                 userArray.push(data.message);
             }
             // Send data to client
             socket.emit('new user', data.message);
         });

         // When system message is received -> print out message in chat
         socket.on('system message', function(data) {
             socket.emit('print message', {msg: data.message, user: data.user, users: userArray});
         });

         // The connection was closed
         socket.on('disconnect', function(data) {
             console.log('Closed Connection ');
         });
     });
 }

 module.exports = {
     theSocket: theSocket
 };

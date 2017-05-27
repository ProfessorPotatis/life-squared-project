/**
 * Module for socket.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let Bucketlist = require('../models/Bucketlist');
 let Lifelist = require('../models/Lifelist');

 let userArray = [];

 function theSocket(req, myEmitter, next) {
     let io = require('socket.io')(req.socket.server);

     // When client connects to socket.io.
     io.on('connection', function(socket) {
         //connected = true;
         console.log('Connected to socket.');

         // Receive data from the client
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

         socket.on('chat message', function(msg) {
             io.emit('print message', {msg: msg.message, user: msg.user, users: userArray});
         });

         myEmitter.on('new user', function(data) {
             if (!userArray.includes(data.message)) {
                 userArray.push(data.message);
             }
             // Send data to client
             socket.emit('new user', data.message);
         });

         socket.on('system message', function(data) {
             socket.emit('print message', {msg: data.message, user: data.user, users: userArray});
         });

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

         // The connection was closed
         socket.on('disconnect', function(data) {
             console.log('Closed Connection ');
         });
     });
 }

 module.exports = {
     theSocket: theSocket
 };

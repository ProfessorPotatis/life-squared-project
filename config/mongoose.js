/**
* Mongoose configuration.
*
* @author ProfessorPotatis
* @version 1.0.0
*/

'use strict';

let mongoose = require('mongoose');

const CONNECT_TO = 'mongodb://localhost/lifeSquared';

module.exports = function() {
    mongoose.connect(CONNECT_TO);

    let db = mongoose.connection;

    db.on('error', function(err) {
        console.error('Mongoose connection error: ', err);
    });

    db.on('connected', function() {
        console.log('Connected to Mongoose.');
    });

    db.on('disconnected', function() {
        console.log('Disconnected from Mongoose.');
    });

    // If the Node process ends, close the Mongoose connection.
    process.on('SIGINT', function() {
        db.close(function() {
            console.log('Mongoose connection disconnected through app termination.');
            process.exit(0);
        });
    });

    return db;
};

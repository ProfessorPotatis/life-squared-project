/**
 * Mongoose model Bucketlist
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Create a schema for bucketlist
let bucketlistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'A {PATH} is required!'
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    user: {
        type: String,
        required: true
    },
    goals: [{
        title: {type: String}
    }]
});

// Create a model using the schema.
let Bucketlist = mongoose.model('Bucketlist', bucketlistSchema);

// Export the model.
module.exports = Bucketlist;

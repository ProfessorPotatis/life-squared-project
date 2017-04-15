/**
 * Mongoose model Lifelist
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Create a schema for lifelist
let lifelistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'A {PATH} is required!'
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// Create a model using the schema.
let Lifelist = mongoose.model('Lifelist', lifelistSchema);

// Export the model.
module.exports = Lifelist;

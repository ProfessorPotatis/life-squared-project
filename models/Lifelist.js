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
    },
    user: {
        type: String,
        required: true
    },
    goals: [{
        title: {type: String},
        checked: {type: Boolean, default: false}
    }],
    deadline: {
        type: Date
    },
    memories: [{
        image: Buffer,
        text: String
    }]
});

// Create a model using the schema.
let Lifelist = mongoose.model('Lifelist', lifelistSchema);

// Export the model.
module.exports = Lifelist;

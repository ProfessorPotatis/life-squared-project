/**
 * Mongoose model RegisterUser.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

// Create a schema for registerUser
let registerUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true,
        validate: {
            // Check if user already exist in database
          validator: function(value, callback) {
            RegisterUser.find({username: value}, function(err,docs){
               callback(docs.length === 0);
            });
          },
          message: 'User already exists. Please choose another username.'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        validate: {
            // Validate password to check for valid characters and minimum length
          validator: function(value) {
            return /^[a-z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/i.test(value);
          },
          message: 'Password must be at least 6 characters long.'
        }
    }
});

// Using a pre-hook (runs before saving the user)
// Generating salt and salting the inputed password
registerUserSchema.pre('save', function(next) {
    let user = this;
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }

        // Using https://www.npmjs.com/package/bcrypt-nodejs
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }

            // set the password to the hash
            user.password = hash;
            next();
        });
    });
});

// Method for comparing login password with password in database
registerUserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, res) {
        if (err) {
            return cb(err);
        }
        cb(null, res);
    });
};

// Create a model using the schema.
let RegisterUser = mongoose.model('RegisterUser', registerUserSchema);

// Export the model.
module.exports = RegisterUser;

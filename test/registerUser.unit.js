let chai = require('chai');
let expect = require('chai').expect;
let RegisterUser = require('../models/RegisterUser');
let mongoose = require('../config/mongoose.js');


describe('F1 – RegisterUser', function() {
    // Useful when you want something to happen before each it-block.
    // Ex. connect to database.
    before(function(done) {
        console.log('before!');
        // Connect to database
        mongoose();
        RegisterUser.remove({}, function(err) {
            if (err) {
                console.log(err);
            }
            console.log('All registered users removed.');
        });
        done();
    });

    // Useful when you want something to happen after each it-block.
    // Ex. disconnect from database.
    after(function(done) {
        console.log('after!');
        process.emit('SIGINT');
        done();
    });

    it('Test case 1: Register a new user with correct information', function(done) {
        let newUser = new RegisterUser({
            username: 'newUser123',
            password: 'Hej123'
        });

        newUser.save();

        RegisterUser.find({username: newUser.username}).exec()
            .then(function(data) {
                // Map the data
                let context = {
                    users: data.map(function(user) {
                        return {
                            username: user.username
                        };
                    })
                };
                return context.users;
            })
            .then(function(user) {
                console.log(user[0].username);
                expect(user[0].username).to.equal('newUser123');
                done();
            })
            .catch(function(err) {
                // If a validation error occurred with the username.
                if (err.errors.username.name === 'ValidatorError') {
                    // Compare ValidatorError to what we expect.
                    console.log(err.errors.username.message);
                    //expect(err.errors.username.message).to.equal('User already exists. Please choose another username.');
                    done();
                }
            });
    });

    it('Test case 2: Try to register an already existing user', function(done) {
        let newUser2 = new RegisterUser({
            username: 'newUser123',
            password: 'Hej123'
        });

        newUser2.save()
            .catch(function(err) {
                // If a validation error occurred with the username.
                if (err.errors.username.name === 'ValidatorError') {
                    // Compare ValidatorError to what we expect.
                    console.log(err.errors.username.message);
                    expect(err.errors.username.message).to.equal('User already exists. Please choose another username.');
                    done();
                }
            });
    });

    it('Test case 3: Try to register a new user with too short password', function(done) {
        let newUser3 = new RegisterUser({
            username: 'newUserShort',
            password: 'Hej12'
        });

        newUser3.save()
            .catch(function(err) {
                // If a validation error occurred with the password.
                if (err.errors.password.name === 'ValidatorError') {
                    // Compare ValidatorError to what we expect.
                    console.log(err.errors.password.message);
                    expect(err.errors.password.message).to.equal('Password must be at least 6 characters long.');
                    done();
                }
            });
    });
});

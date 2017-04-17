/*jshint expr: true*/

let chai = require('chai');
let expect = chai.expect;
let RegisterUser = require('../models/RegisterUser');
let mongoose = require('../config/mongoose');


describe('F1 – Register user', function() {
    // Executes before all tests
    before(function(done) {
        console.log('Before all tests:');
        // Connect to database
        mongoose.connect();
        done();
    });

    // Executes after all tests
    after(function(done) {
        console.log('After all tests:');
        // Remove all registered users
        RegisterUser.remove({username: 'newUser123'}, function(err) {
            if (err) {
                console.log(err);
            }
            console.log('Registered user "newUser123" was removed.');
        })
        .then(function() {
            // Disconnect from database
            //process.emit('SIGINT');
            //mongoose.disconnect();
            done();
        });
    });

    it('Test case 1: Register a new user with correct information', function(done) {
        let newUser = new RegisterUser({
            username: 'newUser123',
            password: 'Hej123'
        });

        newUser.save()
            .then(function() {
                RegisterUser.find({username: newUser.username}).exec()
                    .then(function(data) {
                        // Map the data
                        let context = {
                            users: data.map(function(user) {
                                return {
                                    username: user.username,
                                    password: user.password
                                };
                            })
                        };
                        return context.users;
                    })
                    .then(function(user) {
                        expect(newUser).to.be.an.instanceof(RegisterUser);
                        expect(newUser).to.have.property('username').that.is.a('string');
                        expect(newUser).to.have.property('password').that.is.a('string');
                        expect(user[0].username).to.equal('newUser123');
                        expect(user[0].password).to.not.equal('Hej123');
                        done();
                    });
            });
    });

    it('Test case 2: Try to register an already existing user', function(done) {
        let newUser2 = new RegisterUser({
            username: 'newUser123',
            password: 'Hej123'
        });

        newUser2.save()
            .catch(function(err) {
                expect(err.errors.username.name).to.equal('ValidatorError');
                expect(err.errors.username.message).to.equal('User already exists. Please choose another username.');
                done();
            });
    });

    it('Test case 3: Try to register a new user with too short password', function(done) {
        let newUser3 = new RegisterUser({
            username: 'newUserShort',
            password: 'Hej12'
        });

        newUser3.save()
            .catch(function(err) {
                expect(err.errors.password.name).to.equal('ValidatorError');
                expect(err.errors.password.message).to.equal('Password must be at least 6 characters long.');
                done();
            });
    });
});

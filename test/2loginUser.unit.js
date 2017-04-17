/*jshint expr: true*/

let chai = require('chai');
let expect = chai.expect;
let RegisterUser = require('../models/RegisterUser');
let mongoose = require('../config/mongoose');


describe('F2 – Log in user', function() {
    // Executes before all tests
    before(function(done) {
        console.log('Before all tests:');
        // Connect to database
        //mongoose.connect();

        let newUser = new RegisterUser({
            username: 'Testar',
            password: 'Hej123'
        });

        newUser.save()
            .then(function() {
                done();
            });
    });

    // Executes after all tests
    after(function(done) {
        console.log('After all tests:');
        // Remove all registered users
        RegisterUser.remove({username: 'Testar'}, function(err) {
            if (err) {
                console.log(err);
            }
            console.log('Registered user "Testar" was removed.');
        })
        .then(function() {
            // Disconnect from database
            mongoose.disconnect();
            //process.emit('SIGINT');
            done();
        });
    });

    it('Test case 1: Log in a user with correct information', function(done) {
                RegisterUser.findOne({username: 'Testar'}).exec()
                    .then(function(data) {
                        expect(data).to.exist;
                        expect(data).to.be.instanceof(RegisterUser);
                        expect(data).to.have.property('username');
                        expect(data).to.have.property('password');

                        // Callback function
                        let result = function(err, match) {
                            if (err) {
                                console.log(err);
                            }

                            expect(match).to.be.true;
                            expect(match).to.not.be.false;
                            done();
                        };

                        // Compare password to password in database.
                        data.comparePassword('Hej123', result);
                    });
    });

    it('Test case 2: Try to log in with unregistered/incorrect username', function(done) {
        RegisterUser.findOne({username: 'TestarFel'}).exec()
            .then(function(data) {
                expect(data).to.not.exist;
                expect(data).to.be.null;
                done();
            });
    });


    it('Test case 3: Try to log in with incorrect password', function(done) {
        RegisterUser.findOne({username: 'Testar'}).exec()
            .then(function(data) {
                expect(data).to.exist;
                expect(data).to.be.instanceof(RegisterUser);
                expect(data).to.have.property('username');
                expect(data).to.have.property('password');

                // Callback function
                let result = function(err, match) {
                    if (err) {
                        console.log(err);
                    }

                    expect(match).to.be.false;
                    expect(match).to.not.be.true;
                    done();
                };

                // Compare password to password in database.
                data.comparePassword('Hej1234', result);
            });
    });
});

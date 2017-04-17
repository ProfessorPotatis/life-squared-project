let chai = require('chai');
let expect = require('chai').expect;
let RegisterUser = require('../models/RegisterUser');
let mongoose = require('../config/mongoose.js');


describe('F2 – Login user', function() {
    // Executes before all tests
    before(function(done) {
        console.log('Before all tests:');
        // Connect to database
        mongoose.connect();

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
            // End process because of this being the last test
            process.emit('SIGINT');
            done();
        });
    });

    it('Test case 1: Login a user with correct information', function(done) {
                RegisterUser.findOne({username: 'Testar'}).exec()
                    .then(function(data) {
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

    it('Test case 2: Try to login with unregistered/incorrect username', function(done) {
        RegisterUser.findOne({username: 'TestarFel'}).exec()
            .then(function(data) {
                expect(data).to.be.null;
                done();
            });
    });

    /*it('Test case 2: Try to register an already existing user', function(done) {
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
    });*/
});

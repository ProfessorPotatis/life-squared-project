/*jshint expr: true*/

let chai = require('chai');
let expect = chai.expect;
let Lifelist = require('../models/Lifelist');
let mongoose = require('../config/mongoose');


describe('F5 – Create lifelist', function() {
    // Executes before all tests
    before(function(done) {
        console.log('Before all tests:');
        // Connect to database
        //mongoose.connect();
        done();
    });

    // Executes after all tests
    after(function(done) {
        console.log('After all tests:');
        // Remove all created bucketlists
        Lifelist.remove({user: 'lifelistUser'}, function(err) {
            if (err) {
                console.log(err);
            }
            console.log('"lifelistUser" lifelist was removed.');
        })
        .then(function() {
            // Disconnect from database
            mongoose.disconnect();
            // End process
            process.emit('SIGINT');
            done();
        });
    });

    it('Test case 1: Create lifelist with correct information', function(done) {
        let newLifelist = new Lifelist({
            title: 'My lifelist',
            user: 'lifelistUser'
        });

        newLifelist.save()
            .then(function() {
                Lifelist.find({user: 'lifelistUser'}).exec()
                    .then(function(data) {
                        // Map the data
                        let context = {
                            lifelists: data.map(function(lifelist) {
                                return {
                                    title: lifelist.title,
                                    user: lifelist.user
                                };
                            })
                        };
                        return context.lifelists;
                    })
                    .then(function(lifelist) {
                        expect(newLifelist).to.be.an.instanceof(Lifelist);
                        expect(newLifelist).to.have.property('title').that.is.a('string');
                        expect(newLifelist).to.have.property('createdAt').that.is.a('date');
                        expect(newLifelist).to.have.property('user').that.is.a('string');
                        expect(newLifelist).to.have.property('goals');
                        expect(lifelist[0].title).to.equal('My lifelist');
                        expect(lifelist[0].user).to.equal('lifelistUser');
                        done();
                    });
            });
    });

    it('Test case 2: Try to create bucketlist with missing information', function(done) {
        let newLifelist2 = new Lifelist({

        });

        newLifelist2.save()
            .catch(function(err) {
                expect(err.message).to.equal('Lifelist validation failed');
                expect(err.name).to.equal('ValidationError');
                expect(err.errors.user.message).to.equal('Path `user` is required.');
                expect(err.errors.title.message).to.equal('A title is required!');
                done();
            });
    });
});

/*jshint expr: true*/

let chai = require('chai');
let expect = chai.expect;
let Bucketlist = require('../models/Bucketlist');
let mongoose = require('../config/mongoose');


describe('F5 – Create bucketlist', function() {
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
        Bucketlist.remove({user: 'bucketlistUser'}, function(err) {
            if (err) {
                console.log(err);
            }
            console.log('All "bucketlistUser" bucketlists were removed.');
        })
        .then(function() {
            // Disconnect from database
            //mongoose.disconnect();
            // End process
            //process.emit('SIGINT');
            done();
        });
    });

    it('Test case 1: Create bucketlist with correct information', function(done) {
        let newBucketlist = new Bucketlist({
            title: 'My first bucketlist',
            user: 'bucketlistUser'
        });

        newBucketlist.save()
            .then(function() {
                Bucketlist.find({user: 'bucketlistUser'}).exec()
                    .then(function(data) {
                        // Map the data
                        let context = {
                            bucketlists: data.map(function(bucketlist) {
                                return {
                                    title: bucketlist.title,
                                    user: bucketlist.user
                                };
                            })
                        };
                        return context.bucketlists;
                    })
                    .then(function(bucketlist) {
                        expect(newBucketlist).to.be.an.instanceof(Bucketlist);
                        expect(newBucketlist).to.have.property('title').that.is.a('string');
                        expect(newBucketlist).to.have.property('createdAt').that.is.a('date');
                        expect(newBucketlist).to.have.property('user').that.is.a('string');
                        expect(newBucketlist).to.have.property('goals');
                        expect(bucketlist[0].title).to.equal('My first bucketlist');
                        expect(bucketlist[0].user).to.equal('bucketlistUser');
                        done();
                    });
            });
    });

    it('Test case 2: Try to create bucketlist with missing information', function(done) {
        let newBucketlist2 = new Bucketlist({

        });

        newBucketlist2.save()
            .catch(function(err) {
                expect(err.message).to.equal('Bucketlist validation failed');
                expect(err.name).to.equal('ValidationError');
                expect(err.errors.user.message).to.equal('Path `user` is required.');
                expect(err.errors.title.message).to.equal('A title is required!');
                done();
            });
    });
});

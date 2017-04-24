// API documentation - https://github.com/visionmedia/supertest
let request = require('supertest');
let app = require('../app');
let mongoose = require('../config/mongoose');

// Auxiliary function.
function createLoginCookie(server, loginDetails, done) {
    request(app)
        .post(server)
        .send(loginDetails)
        .end(function(error, response) {
            if (error) {
                throw error;
            }
            let loginCookie = response.headers['set-cookie'];
            done(loginCookie);
        });
}

describe('F3 - Log out user', function () {
    // Executes after all tests
    after(function(done) {
        console.log('After all tests:');
        // Disconnect from database
        mongoose.disconnect();
        // End process
        process.emit('SIGINT');
        done();
    });

    describe('Test case 1: Log out user who is logged in', function() {

        it('redirects to home page', function(done) {
            createLoginCookie('/login', {username: 'Test', password: 'Hej123'}, function(cookie) {
                request(app)
                    .get('/logout')
                    .set('cookie', cookie)
                    .expect(302)
                    .expect('Location', '/')
                    .end(done);
            });
        });
    });

    describe('Test case 2: Try to log out user who is not logged in', function() {

        it('respond with status code 403', function (done) {

            request(app)
                .get('/logout')
                .set('Accept', 'text/html')
                .expect('Content-Type', /text\/html/)
                .expect(403, done);
        });
    });
});

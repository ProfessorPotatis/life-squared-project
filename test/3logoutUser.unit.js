// API documentation - https://github.com/visionmedia/supertest
var request = require('supertest');

var app = require("../app");


describe("F3 - Log out user", function () {

    describe("Test case 2: Try to log out user who is not logged in", function () {

        it("respond with status code 403", function (done) {

            request(app)
                .get('/logout')
                .set('Accept', 'text/html')
                .expect('Content-Type', /text\/html/)
                .expect(403, done);
        });
    });
});

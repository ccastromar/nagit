var expect  = require('chai').expect;
var request = require('request');
var app= require('../app');

it('Main page content', function(done) {
    request('http://localhost:8000' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

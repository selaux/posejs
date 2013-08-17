'use strict';

var expect = require('expect.js'),
    webdriver = require('selenium-webdriver'),

    promiseUtils = require('../../../../lib/utils/promiseUtils');

describe('promiseUtils', function () {
    describe('all', function () {
        it('fulfills when passed an empty array', function (done) {
            var empty = [];

            promiseUtils.all(empty).then(function (result) {
                expect(result).to.be(empty);
                done();
            }, done);
        });

        it('rejects when any of the promises is rejected', function (done) {
            var fulfilledPromise = webdriver.promise.defer(),
                rejectedPromise = webdriver.promise.defer(),
                promises = [ fulfilledPromise.promise, rejectedPromise.promise ];

            promiseUtils.all(promises).then(function () {
                done('Promise not rejected!');
            }, function (err) {
                expect(err).to.equal('rejected');
                done();
            });

            fulfilledPromise.fulfill(12);
            setTimeout(function () {
                rejectedPromise.reject('rejected');
            }, 100);
        });

        it('modifies the promise array instead of creating a new one', function (done) {
            var promise1 = webdriver.promise.defer(),
                promise2 = webdriver.promise.defer(),
                promises = [ promise1, promise2 ];

            promiseUtils.all(promises).then(function (result) {
                expect(result).to.be(promises);
                expect(result).to.eql([ 1, 2 ]);
                done();
            }, done);

            promise1.fulfill(1);
            promise2.fulfill(2);
        });

        it('works with foreign promises', function (done) {
            var promise1 = webdriver.promise.defer(),
                promise2 = { then: function (f) { f(2); } },
                promises = [ promise1, promise2 ];

            promiseUtils.all(promises).then(function (result) {
                expect(result).to.eql([ 1, 2 ]);
                done();
            }, done);

            promise1.fulfill(1);
        });
    });
});
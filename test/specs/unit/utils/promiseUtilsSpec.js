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

    describe('map', function () {
        var doubles = function (el) {
            var d = webdriver.promise.defer();
            setTimeout(function () {
                d.fulfill(2 * el);
            }, 10);
            return d;
        };

        it('fulfills when passed an empty array', function (done) {
            promiseUtils.map([], doubles).then(function (result) {
                expect(result).to.eql([]);
                done();
            }, done);
        });

        it('rejects when any of the promises is selected', function (done) {
            var fails = function (el) {
                var d = webdriver.promise.defer();
                setTimeout(function () {
                    if (el === 3) {
                        d.reject('rejected');
                    } else {
                        d.fulfill(1);
                    }
                }, 10);
                return d;
            };

            promiseUtils.map([ 1, 2, 3 ], fails).then(function () {
                done(new Error('No error thrown'));
            }, function (err) {
                expect(err).to.equal('rejected');
                done();
            });
        });

        it('creates a new array containing the mapped values', function (done) {
            promiseUtils.map([ 1, 2, 3], doubles).then(function (result) {
                expect(result).to.eql([ 2, 4, 6 ]);
                done();
            }, done);
        });

        it('passes on the iterator', function (done) {
            var multipliesIterator = function (el, it) {
                var d = webdriver.promise.defer();
                setTimeout(function () {
                    d.fulfill(el * it);
                }, 10);
                return d;
            };

            promiseUtils.map([ 1, 2, 3], multipliesIterator).then(function (result) {
                expect(result).to.eql([ 0, 2, 6 ]);
                done();
            }, done);
        });
    });

    describe('fulfillTo', function () {
        it('should reject when the promise is rejected', function (done) {
            var promise = webdriver.promise.defer();

            promiseUtils.fulfillTo(promise, 1).then(function () {
                done('Promise not rejected!');
            }, function (err) {
                expect(err).to.equal('rejected');
                done();
            });

            promise.reject('rejected');
        });

        it('should fulfill to the specified value', function (done) {
            var promise = webdriver.promise.defer();

            promiseUtils.fulfillTo(promise, 1).then(function (result) {
                expect(result).to.equal(1);
                done();
            }, done);

            promise.fulfill(1234);
        });
    });
});
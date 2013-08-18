'use strict';

var expect = require('expect.js'),
    webdriver = require('selenium-webdriver'),

    ElementSet = require('../../../lib/elementset');

describe('ElementSet', function () {
    var WebElementStub = function (i) { this.number = i; };

    describe('constructor', function () {

        it('should be initializable with a promise to a single WebElement', function (done) {
            var webelement = new WebElementStub(1),
                webelementPromise = webdriver.promise.defer(),
                elementSetPromise = new ElementSet(webelementPromise);

            elementSetPromise.then(function (elementSet) {
                expect(elementSet.getWebElements()).to.eql([ webelement ]);
                done();
            }, done);

            webelementPromise.fulfill(webelement);
        });

        it('should be initializable with a promise to an array of WebElements', function (done) {
            var webelement1 = new WebElementStub(1),
                webelement2 = new WebElementStub(2),
                webelementPromise = webdriver.promise.defer(),
                elementSetPromise = new ElementSet(webelementPromise);

            elementSetPromise.then(function (elementSet) {
                expect(elementSet.getWebElements()).to.eql([ webelement1, webelement2 ]);
                done();
            }, done);

            webelementPromise.fulfill([ webelement1, webelement2 ]);
        });

        it('should be initializable with a promise to a nested array of WebElements', function (done) {
            var webelement1 = new WebElementStub(1),
                webelement2 = new WebElementStub(2),
                webelement3 = new WebElementStub(3),
                webelement4 = new WebElementStub(4),
                webelementPromise = webdriver.promise.defer(),
                elementSetPromise = new ElementSet(webelementPromise);

            elementSetPromise.then(function (elementSet) {
                expect(elementSet.getWebElements()).to.eql([ webelement1, webelement2, webelement3, webelement4 ]);
                done();
            }, done);

            webelementPromise.fulfill([ webelement1, [ webelement2, webelement3 ], webelement4 ]);
        });
    });

    describe('length', function () {

        it('should return the number of found WebElements', function (done) {
            var webelement1 = new WebElementStub(1),
                webelement2 = new WebElementStub(2),
                webelementPromise = webdriver.promise.defer(),
                elementSetPromise = new ElementSet(webelementPromise);

            elementSetPromise.then(function (elementSet) {
                expect(elementSet).to.have.length(2);
                done();
            }, done);

            webelementPromise.fulfill([ webelement1, webelement2 ]);
        });

        it('should return 0 for empty ElementSets', function (done) {
            var webelementPromise = webdriver.promise.defer(),
                elementSetPromise = new ElementSet(webelementPromise);

            elementSetPromise.then(function (elementSet) {
                expect(elementSet).to.be.empty();
                done();
            }, done);

            webelementPromise.fulfill([]);
        });

    });

    describe('getWebElements', function () {

        it('should return the underlying WebElements', function (done) {
            var webelement = new WebElementStub(1),
                webelementPromise = webdriver.promise.defer(),
                elementSetPromise = new ElementSet(webelementPromise);

            elementSetPromise.then(function (elementSet) {
                expect(elementSet.getWebElements()).to.eql([ webelement ]);
                done();
            });

            webelementPromise.fulfill([ webelement ]);
        });

    });

});
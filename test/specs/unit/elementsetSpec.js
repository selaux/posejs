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
            });

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
            });

            webelementPromise.fulfill([ webelement1, webelement2 ]);
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
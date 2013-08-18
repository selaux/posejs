'use strict';

var path = require('path'),

    expect = require('expect.js'),
    _ = require('lodash'),
    webdriver = require('selenium-webdriver'),

    driverUtils = require('../../utils/driverUtils'),
    promiseUtils = require('../../../lib/utils/promiseUtils'),
    serverUtils = require('../../utils/serverUtils'),

    Driver = require('../../../lib/driver'),
    ElementSet = require('../../../lib/elementset'),

    testPage = 'file://' + path.join(__dirname, '../../fixtures/test.html');

function testThatDriverWorks(driver, done) {
    driver.get(testPage);
    driver.getTitle().then(function (title) {
        expect(title).to.eql('It Works!');
    });

    driver.quit().then(done, done);
}

describe('Driver', function () {
    it('should inherit methods from selenium-webdriver', function (done) {
        var driver = driverUtils.getTestDriver();
        testThatDriverWorks(driver, done);
    });

    describe('options', function () {
        it('should be able change the used browser', function (done) {
            var driver = driverUtils.getTestDriver({
                capabilities: [
                    webdriver.Capabilities.firefox()
                ]
            });
            driver.getCapabilities().then(function (cap) {
                expect(cap.get('browserName')).to.eql('firefox');
            });
            driver.quit().then(done, done);
        });

        it('should be able to set the used server url', function (done) {
            this.timeout(30000);

            var server = serverUtils.startServer({ port: 5556, local: true }, function () {
                var driver = driverUtils.getTestDriver(server);
                testThatDriverWorks(driver, function () {
                    serverUtils.stopServer(server, done);
                });
            });
        });
    });

    describe('getWebDriver', function () {
        it('should return the underlying webdriver', function (done) {
            var driver = driverUtils.getTestDriver(this.server);
            expect(driver.getWebDriver()).to.be.a(webdriver.WebDriver);
            driver.quit().then(done, done);
        });
    });

    describe('findElement', function () {

        it('should return an ElementSet containing a single element', function (done) {
            var driver = driverUtils.getTestDriver(this.server),
                elementSet,
                webElement;

            driver.get(testPage);

            driver.findElement(webdriver.By.id('selectMe')).then(function (result) {
                elementSet = result;
            });
            driver.getWebDriver().findElement(webdriver.By.id('selectMe')).then(function (result) {
                webElement = result;
            });
            driver.controlFlow().execute(function () {
                return webdriver.WebElement.equals(elementSet.getWebElements()[0], webElement).then(function (areEqual) {
                    expect(elementSet).to.be.a(ElementSet);
                    expect(elementSet.getWebElements()).to.have.length(1);
                    expect(areEqual).to.be(true);
                });
            }).then(done, done);
        });

        it('should throw an error if the element is not present', function (done) {
            var driver = driverUtils.getTestDriver(this.server);

            driver.get(testPage);

            driver.findElement(webdriver.By.id('nonExistant')).then(function () {
                done(new Error('There was no error thrown'));
            }, function (err) {
                expect(err).to.be.ok();
                expect(err.message).to.contain('Unable to find element');
                done();
            });
        });

    });

    describe('findElements', function () {

        it('should return an ElementSet containing all matching elements', function (done) {
            var driver = driverUtils.getTestDriver(this.server),
                elementSet,
                webElements;

            driver.get(testPage);

            driver.findElements(webdriver.By.className('testClass')).then(function (result) {
                elementSet = result;
            });
            driver.getWebDriver().findElements(webdriver.By.className('testClass')).then(function (result) {
                webElements = result;
            });
            driver.controlFlow().execute(function () {
                return promiseUtils.map(elementSet.getWebElements(), function (val, it) {
                    return webdriver.WebElement.equals(val, webElements[it]);
                }).then(function (areEqual) {
                    expect(elementSet).to.be.a(ElementSet);
                    expect(elementSet.getWebElements()).to.have.length(2);
                    expect(_.unique(areEqual)).to.eql([ true ]);
                });
            }).then(done, done);
        });

        it('should not throw an error when no elements are found', function (done) {
            var driver = driverUtils.getTestDriver(this.server);

            driver.get(testPage);
            driver.findElements(webdriver.By.id('nonExistant')).then(function (elementSet) {
                expect(elementSet).to.be.a(ElementSet);
                expect(elementSet.getWebElements()).to.be.empty();
                done();
            }, done);
        });

    });

});
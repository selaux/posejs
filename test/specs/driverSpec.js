'use strict';

var path = require('path'),

    expect = require('expect.js'),
    webdriver = require('selenium-webdriver'),

    driverUtils = require('../utils/driverUtils'),
    Driver = require('../../lib/driver');

function testThatDriverWorks(driver, done) {
    var testPage = 'file://' + path.join(__dirname, '../fixtures/test.html');
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
                    webdriver.Capabilities.phantomjs()
                ]
            });
            driver.getCapabilities().then(function (cap) {
                expect(cap.get('browserName')).to.eql('phantomjs');
            });
            driver.quit().then(done, done);
        });

        it('should be able to set the used server url', function (done) {
            var driver = driverUtils.getTestDriver({
                server: 'http://127.0.0.1:4444/wd/hub'
            });
            testThatDriverWorks(driver, done);
        });
    });

    describe('getWebDriver', function () {
        it('should return the webdriver', function (done) {
            var driver = driverUtils.getTestDriver();
            expect(driver.getWebDriver()).to.be.a(webdriver.WebDriver);
            driver.quit().then(done, done);
        });
    });

});
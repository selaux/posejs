'use strict';

var path = require('path'),

    expect = require('expect.js'),
    webdriver = require('selenium-webdriver'),

    driverUtils = require('../../utils/driverUtils'),
    serverUtils = require('../../utils/serverUtils'),
    Driver = require('../../../lib/driver');

function testThatDriverWorks(driver, done) {
    var testPage = 'file://' + path.join(__dirname, '../../fixtures/test.html');
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
        it('should return the webdriver', function (done) {
            var driver = driverUtils.getTestDriver(this.server);
            expect(driver.getWebDriver()).to.be.a(webdriver.WebDriver);
            driver.quit().then(done, done);
        });
    });

});
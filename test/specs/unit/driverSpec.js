/*jshint nonew:false */

'use strict';

var expect = require('expect.js'),
    webdriver = require('selenium-webdriver'),

    sandbox = require('sandboxed-module'),
    sinon = require('sinon'),

    WebdriverStub = function () { return this; },
    builderStub = {
        usingServer: function () { return this; },
        withCapabilities: function () { return this; },
        build: function () { return new WebdriverStub(); }
    },
    webdriverModuleStub = {
        Builder: function () {
            return builderStub;
        },
        WebDriver: WebdriverStub,
        Capabilities: webdriver.Capabilities
    };

expect = require('sinon-expect').enhance(expect, sinon, 'was');

WebdriverStub.prototype.methodToBeInherited = function () { return this; };

function getStubbedDriver() {
    return sandbox.require('../../../lib/driver', {
        requires: {
            'selenium-webdriver': webdriverModuleStub
        }
    });
}

describe('Driver', function () {

    it('should inherit methods from selenium-webdriver', function () {
        var Driver = getStubbedDriver(),
            driver = new Driver();
        expect(driver.methodToBeInherited).to.be.ok();
        expect(driver.methodToBeInherited()).to.be(driver.getWebDriver());
    });

    describe('options', function () {
        it('should be able change the used browser', sinon.test(function () {
            var capability = webdriver.Capabilities.firefox(),
                driver,
                Driver;

            sinon.stub(builderStub, 'withCapabilities').returns(builderStub);

            Driver = getStubbedDriver();
            driver = new Driver({
                capabilities: [
                    capability
                ]
            });

            expect(driver).to.be.ok();
            expect(builderStub.withCapabilities).was.calledOnce();
            expect(builderStub.withCapabilities).was.calledWith(capability);
        }));

        it('should be able to set the used server url', sinon.test(function () {
            var serverUrl = 'http://www.some.server:4444/url',
                driver,
                Driver;

            sinon.stub(builderStub, 'usingServer').returns(builderStub);

            Driver = getStubbedDriver();
            driver = new Driver({
                server: serverUrl
            });

            expect(driver).to.be.ok();
            expect(builderStub.usingServer).was.calledOnce();
            expect(builderStub.usingServer).was.calledWith(serverUrl);
        }));
    });

});
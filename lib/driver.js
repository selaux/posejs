'use strict';

var _ = require('lodash'),
    webdriver = require('selenium-webdriver'),

    ElementSet = require('./elementset'),

    Driver;


Driver = function (options) {
    var builder = new webdriver.Builder(),
        defaults = {
            capabilities: [
                webdriver.Capabilities.chrome()
            ]
        };

    options = _.defaults(options || {}, defaults);

    if (options.server) {
        builder.usingServer(options.server);
    }

    if (options.capabilities) {
        _.each(options.capabilities, function (c) {
            builder.withCapabilities(c);
        });
    }

    this._driver = builder.build();
};

// Manually inherit methods from WebDriver since we need to encapsule it
/*jslint unparam: true*/
_.each(webdriver.WebDriver.prototype, function (val, name) {
    if (name !== 'constructor') {
        Driver.prototype[name] = function () {
            return this.getWebDriver()[name].apply(this._driver, arguments);
        };
    }
});
/*jslint unparam: false*/

Driver.prototype.getWebDriver = function () {
    return this._driver;
};

Driver.prototype.findElement = function () {
    var webDriver = this.getWebDriver(),
        mainArgs = arguments;
    return webDriver.controlFlow().execute(function () {
        var element = webDriver.findElement.apply(webDriver, mainArgs);
        return new ElementSet(element);
    });
};

Driver.prototype.findElements = function () {
    var webDriver = this.getWebDriver(),
        mainArgs = arguments;
    return webDriver.controlFlow().execute(function () {
        var elements = webDriver.findElements.apply(webDriver, mainArgs);
        return new ElementSet(elements);
    });
};

module.exports = Driver;


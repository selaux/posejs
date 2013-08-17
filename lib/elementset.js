'use strict';

var _ = require('lodash'),
    webdriver = require('selenium-webdriver');

var ElementSet = function (webelements) {
    var self = this,
        d = webdriver.promise.defer();

    webelements.then(function (elements) {
        if (_.isArray(elements)) {
            self.webelements_ = elements;
        } else {
            self.webelements_ = [ elements ];
        }
        d.fulfill(self);
    }, d.reject);

    return d;
};

ElementSet.prototype.getWebElements = function () {
    return this.webelements_;
};

module.exports = ElementSet;
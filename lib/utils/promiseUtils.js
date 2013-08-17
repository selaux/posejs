'use strict';

var _ = require('lodash'),
    webdriver = require('selenium-webdriver');

module.exports = {

    all: function (promises) {
        var d = webdriver.promise.defer(),
            countdown = 0;

        if (promises.length === 0) {
            d.fulfill(promises);
            return d;
        }

        _.each(promises, function (promise, i) {
            promise.then(function (result) {
                countdown += 1;
                promises[i] = result;
                if (countdown === promises.length) {
                    d.fulfill(promises);
                }
            }, function (err) {
                d.reject(err);
            });
        });

        return d;
    }

};
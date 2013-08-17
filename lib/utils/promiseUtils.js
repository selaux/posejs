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
    },

    map: function (arr, func) {
        return this.all(_.map(arr, function (el, it) {
            return func(el, it);
        }));
    },

    fulfillTo: function (promise, value) {
        var d = webdriver.promise.defer();
        promise.then(function () {
            d.fulfill(value);
        }, d.reject);
        return d;
    }

};
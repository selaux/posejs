'use strict';

var path = require('path'),
    fs = require('fs'),
    http = require('http'),

    _ = require('lodash'),
    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer,

    SELENIUM_VERSION = require('selenium-webdriver/package.json').version,
    SELENIUM_JAR = 'selenium-server-standalone-' + SELENIUM_VERSION + '.jar',

    server;

module.exports = {

    startServer: function (options, callback) {
        var defaults = {
                port: 5555
            },
            localServer;

        options = _.defaults(options || {}, defaults);

        localServer = new SeleniumServer(this.getSeleniumLocalPath(), {
            port: options.port
        });

        if (!options.local) {
            server = localServer;
        }

        server.start().then(function (uri) {
            callback(null, uri);
        }, callback);

        return localServer;
    },

    stopServer: function (server, callback) {
        server.stop().then(callback, callback);
    },

    getServer: function () {
        return server;
    },

    getSeleniumDownloadUri: function () {
        return 'http://selenium.googlecode.com/files/' + SELENIUM_JAR;
    },

    getSeleniumLocalPath: function () {
        return path.join(__dirname, '../fixtures/', SELENIUM_JAR);
    }

};
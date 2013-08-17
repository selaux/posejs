'use strict';

var _ = require('lodash'),

    pose = require('../../lib/pose'),
    serverUtils = require('./serverUtils'),

    Driver = pose.Driver;

module.exports = {
    getTestDriver: function (options) {
        var defaults = {
            server: serverUtils.getServer().address(),
            capabilities: [
                pose.Capabilities.phantomjs()
            ]
        };

        options = _.defaults(options || {}, defaults);

        return new Driver(options);
    }
};
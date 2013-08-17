'use strict';

var _ = require('lodash'),

    pose = require('../../lib/pose'),
    Driver = pose.Driver;

module.exports = {
    getTestDriver: function (options) {
        var defaults = {
            capabilities: [
                pose.Capabilities.phantomjs()
            ]
        };

        options = _.defaults(options || {}, defaults);

        return new Driver(options);
    }
};
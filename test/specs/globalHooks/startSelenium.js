'use strict';

var serverUtils = require('../../utils/serverUtils');

before(function (done) {
    this.timeout(30000);
    console.log('Starting up selenium server ...');
    serverUtils.startServer({}, done);
});

after(function (done) {
    console.log('Shutting down selenium server ...');
    serverUtils.stopServer(serverUtils.getServer(), done);
});
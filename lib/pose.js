var webdriver = require('selenium-webdriver'),
    Server = require('selenium-webdriver/remote'),
    pose = {};

pose.Capabilities = webdriver.Capabilities;
pose.Driver = require('./driver');
pose.Server = Server;


module.exports = pose;
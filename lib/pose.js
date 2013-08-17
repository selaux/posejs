var webdriver = require('selenium-webdriver'),
    pose = {};

pose.Driver = require('./driver');
pose.Capabilities = webdriver.Capabilities;

module.exports = pose;
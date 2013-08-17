'use strict';

var serverUtils = require('./test/utils/serverUtils');

module.exports = function (grunt) {
    grunt.initConfig({

        jslint: {
            all: {
                src: [
                    '**/*.js',
                    '!node_modules/**/*.js'
                ],

                directives: {
                    node: true,
                    nomen: true,
                    globals: {
                        before: true,
                        after: true,
                        describe: true,
                        it: true
                    }
                }
            }
        },

        curl: {
            seleniumServer: {
                src: serverUtils.getSeleniumDownloadUri(),
                dest: serverUtils.getSeleniumLocalPath()
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    timeout: 5000
                },

                src: [
                    'test/specs/**/*.js'
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', [ 'jslint', 'curl', 'mochaTest' ]);
};
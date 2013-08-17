'use strict';

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
                        describe: true,
                        it: true
                    }
                }
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
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', [ 'jslint', 'mochaTest' ]);
};
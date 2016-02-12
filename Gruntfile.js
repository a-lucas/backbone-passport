var _ = require('underscore');

var config = require('./server/config/config');


module.exports = function(grunt) {

    // All upfront config goes in a massive nested object.
    grunt.initConfig({
        watch: {
            serverViews: {
                files: config.server.serverViews,
                options: {
                    livereload: true
                }
            },
            serverJS: {
                files: config.server.serverJS,
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            clientJS: {
                files: config.server.clientJS,
                options: {
                    livereload: true
                }
            },
            clientCSS: {
                files: config.server.clientCSS,
                options: {
                    livereload: true
                }
            }
        },
        env: {
            dev: {
                NODE_ENV: 'development'
            }
        },
        nodemon: {
            script: 'server.js',
            options: {
                nodeArgs: ['--debug'],
                ext: 'js,html',
                watch: _.union( config.server.clientCSS, config.server.clientJS, config.server.serverJS, config.server.serverViews)
            }
        },
        concurrent: {
            default: ['nodemon', 'watch'],
            debug: ['nodemon', 'watch', 'node-inspector'],
            options: {
                logConcurrentOutput: true
            }
        },
        'node-inspector': {
            custom: {
                options: {
                    'web-port': 1337,
                    'web-host': 'localhost',
                    'debug-port': 5858,
                    'save-live-edit': true,
                    'no-preload': true,
                    'stack-trace-limit': 50,
                    'hidden': []
                }
            }
        },
        jshint: {
            all: {
                src: _.union(config.server.serverJS, config.server.clientJS),
                options: {
                    jshintrc: true,
                    node: true,
                    mocha: false,
                    jasmine: false,
                    ignores: ['client/**/*.js', 'node_modules/**/*.js']
                }
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc',
                ignores: ['client/**/*.css', 'node_modules/**/*.css']

            },
            all: {
                src: config.server.clientCSS
            }
        },
    }); // The end of grunt.initConfig


    require('load-grunt-tasks')(grunt);


    grunt.registerTask("run", ["concurrent", "lint"]);



    // Lint CSS and JavaScript files.
    grunt.registerTask('lint', ['jshint', 'csslint']);

    // Run the project in development mode
    grunt.registerTask('default', ['env:dev', 'lint', 'concurrent' ]);

    // Run the project in debug mode
    grunt.registerTask('debug', ['env:dev', 'lint', 'concurrent.debug']);
}
(function () {
    "use strict";

    module.exports = function (grunt) {

        grunt.initConfig({
            ui5: {
                version: '1.38.4'
            },
            dir: {
                webapp: 'app',
                dist: 'WebContent',
                bower_components: 'bower_components'
            },
            jshint: {
                all: ['Gruntfile.js', '<%= dir.webapp %>/**/*.js'],
                options: {
                    jshintrc: '.jshintrc',
                    jshintignore: '.jshintignore'
                }
            },
            jsvalidate: {
                options: {
                    globals: {},
                    esprimaOptions: {},
                    verbose: false
                },
                targetName: {
                    files: {
                        src: ['<%=jshint.all%>']
                    }
                }
            },
            connect: {
                options: {
                    port: 9876,
                    hostname: '*',
                    middleware: function (connect, options, defaultMiddleware) {
						var proxy;
                        proxy = require('grunt-connect-proxy/lib/utils').proxyRequest; // jshint ignore:line
                        return [
                            // Include the proxy first
                            proxy
                        ].concat(defaultMiddleware);
                    }
                },
                src: {},
                dist: {},
				proxies: [
                    {
                        context: "/XMII", // When the url contains this...
                        host: "172.16.20.231", // Proxy to this host
                        port: 50000,
                        changeOrigin: true,
						headers: {
                            "Authorization": "Basic bWJhcmF0ZWxsYTpJbml0MTIzNA=="
                        },
                    }
                ]
            },
            openui5_connect: {
                options: {
                    resources: [
                        '<%= dir.bower_components %>/openui5-sap.ui.core/resources',
                        '<%= dir.bower_components %>/openui5-sap.m/resources',
                        '<%= dir.bower_components %>/openui5-sap.ui.layout/resources',
                        '<%= dir.bower_components %>/openui5-sap.ui.commons/resources',
                        '<%= dir.bower_components %>/openui5-themelib_sap_bluecrystal/resources',
                        '<%= dir.bower_components %>/openui5-sap.ui.unified/resources',
                        '<%= dir.bower_components %>/openui5-sap.ui.table/resources'
                    ]
                },
                src: {
                    options: {
                        appresources: '<%= dir.webapp %>'
                    }
                },
                dist: {
                    options: {
                        appresources: '<%= dir.dist %>'
                    }
                }
            },
            openui5_preload: {
                component: {
                    options: {
                        resources: {
                            cwd: '<%= dir.webapp %>',
                            prefix: 'myapp'
                        },
                        dest: '<%= dir.dist %>'
                    },
                    components: true
                }
            },
            clean: {
                dist: {
                    src: ['<%= dir.dist %>/**']
                }
            },
            copy: {
                dist: {
                    files: [{
                            expand: true,
                            cwd: '<%= dir.webapp %>',
                            src: [
                                '**',
                                '!test/**',
                                '!META-INF/**',
                                '!WEB-INF/**',
                                '!.idea/**',
                                '!index_test.html'
                            ],
                            dest: '<%= dir.dist %>'
                        }, {
                            expand: true,
                            cwd: './',
                            src: [
                                '.Ui5RepositoryIgnore'
                            ],
                            dest: '<%= dir.dist %>'
                        }, {
                            expand: true,
                            cwd: '<%= dir.bower_components %>/normalize-css',
                            src: 'normalize.css',
                            dest: '<%= dir.dist %>/css/'
                        }, {
                            expand: true,
                            cwd: '<%= dir.bower_components %>/raphael',
                            src: 'raphael.min.js',
                            dest: '<%= dir.dist %>/libs/'
                        }, {
                            expand: true,
                            cwd: '<%= dir.bower_components %>/justgage',
                            src: 'justgage.js',
                            dest: '<%= dir.dist %>/libs/'
                        }, {
                            expand: true,
                            cwd: '<%= dir.bower_components %>/velocity',
                            src: 'velocity.min.js',
                            dest: '<%= dir.dist %>/libs/'
                        }, {
                            expand: true,
                            cwd: '<%= dir.bower_components %>/vis/dist',
                            src: 'vis.min.js',
                            dest: '<%= dir.dist %>/libs/'
                        }, {
                            expand: true,
                            cwd: '<%= dir.bower_components %>/vis/dist',
                            src: 'vis-timeline-graph2d.min.css',
                            dest: '<%= dir.dist %>/css/'
                        }, {
                            expand: true,
                            cwd: '<%= dir.bower_components %>/moment/min',
                            src: 'moment-with-locales.min.js',
                            dest: '<%= dir.dist %>/libs/'
                        }]
                },
                test: {
                    files: [{
                            expand: true,
                            cwd: '<%= dir.webapp %>',
                            src: [
                                '**',
                                '!test/**',
                                '!META-INF/**',
                                '!WEB-INF/**',
                                '!.idea/**',
                                '!index_test.html'
                            ],
                            dest: '<%= dir.dist %>'
                        }, {
                            expand: true,
                            cwd: './',
                            src: [
                                '.Ui5RepositoryIgnore'
                            ],
                            dest: '<%= dir.dist %>'
                        }, {
                            expand: true,
                            cwd: '<%= dir.bower_components %>/normalize-css',
                            src: 'normalize.css',
                            dest: '<%= dir.dist %>/css/'
                        }]
                }
            },
            eslint: {
                webapp: ['<%= dir.webapp %>']
            },
            'string-replace': {
                test: {
                    inline: {
                        files: {
                            '<%= dir.dist %>/index.html': '<%= dir.dist %>/index.html'
                        },
                        options: {
                            replacements: [{
                                    pattern: 'src=\"resources/sap-ui-core.js\"',
                                    replacement: 'src=\"resources/sap-ui-core.js\"'
                                }]
                        }
                    }
                },
                dist: {
                    inline: {
                        files: {
                            '<%= dir.dist %>/index.html': '<%= dir.dist %>/index.html'
                        },
                        options: {
                            replacements: [{
                                    pattern: 'src=\"resources/sap-ui-core.js\"',
                                    replacement: 'src=\"sapui5/resources/sap-ui-core.js\"'
                                }]
                        }
                    }
                }
            },
            sync: {
                main: {
                    files: [{
                            expand: true,
                            cwd: '<%= dir.webapp %>',
                            src: [
                                '**',
                                '!META-INF/**',
                                '!WEB-INF/**',
                                '!.idea/**'
                            ],
                            dest: '<%= dir.dist %>'
                        }],
                    failOnError: true,
                    verbose: true, // Display log messages when copying files
                    updateAndDelete: false,
                    ignoreInDest: ["**/libs/*", "**/css/*", "**/css/Roboto/*", "**/fonts/Roboto/*"],
                    compareUsing: "md5" // compares via md5 hash of file contents, instead of file modification time. Default: "mtime"
                }
            },
            watch: {
                files: ['Gruntfile.js', '<%= dir.webapp %>/**/*.js', '<%= dir.webapp %>/**/*.xml', '<%= dir.webapp %>/**/*.html', '<%= dir.webapp %>/**/*.css', '<%= dir.webapp %>/**/*.json', '<%= dir.webapp %>/**/*.properties'],
                tasks: ['buildSync'],
                options: {
                    livereload: true
                }
            }

        });

        // These plugins provide necessary tasks.
		grunt.loadNpmTasks('grunt-connect-proxy');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-jsvalidate');
        grunt.loadNpmTasks('grunt-contrib-connect');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-openui5');
        grunt.loadNpmTasks('grunt-eslint');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-sync');
        grunt.loadNpmTasks('grunt-string-replace');

        // Server task
        grunt.registerTask('serve', function (target) {
            grunt.task.run('openui5_connect:' + (target || 'src') + '');
        });

        // Compile task
        grunt.registerTask('compile', ['jsvalidate', 'jshint', 'eslint']);

        // JSHint task
        grunt.registerTask('hint', ['jshint']);

        // Linting task
        grunt.registerTask('lint', ['eslint']);

        // Build task
        //grunt.registerTask('build', ['compile', 'openui5_preload', 'copy:dist', 'string-replace']);
        grunt.registerTask('build', ['compile', 'copy:dist', 'string-replace:dist']);

        // Copy sync mode
        grunt.registerTask('copySync', 'sync');

        // Build sync
        grunt.registerTask('buildSync', ['compile', 'copySync']);

        // Build test
        grunt.registerTask('build_test', ['buildSync', 'copy:test']);

        // Watch task
        grunt.registerTask('mywatch', ['watch']);

        // Default task
	    grunt.registerTask('default', [
           'build_test',
		   'configureProxies:server',
           'serve:dist',
           'watch'
        ]);
    };

}
());

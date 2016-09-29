'use strict';
module.exports = function(grunt) {

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        // watch for changes and trigger sass, jshint, uglify and livereload
        watch: {
            sass: {
                files: ['scss/*.{scss,sass}'],
                tasks: ['sass:dist', 'autoprefixer'],
            },
            js: {
                files: 'js/*.js',
                tasks: ['jshint', 'uglify']
            },
            images: {
                files: ['images/*.{png,jpg,gif}'],
                tasks: ['imagemin']
            },
        },

        // sass
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                },
                files: {
                    'css/screen.css': 'scss/screen.scss',
                    //'editor-style.css': 'scss/editor-style.scss'
                }
            }
        },

        // autoprefixer
        autoprefixer: {
            options: {
                browsers: ['last 3 versions', 'ie 9', 'ios 6', 'android 4'],
                map: false,
                expand: true,
                flatten: true
            },
            dist: {
                files: {
                    'css/screen.css': 'css/screen.css'
                }
            }
        },



        cssmin: {
            options: {
                keepSpecialComments: 1
            },
          target: {
            files: [{
              expand: true,
              cwd: 'css',
              src: ['*.css', '!*.min.css'],
              dest: 'css',
              ext: '.css'
            }]
          }
        },

        // image sprites
        sprite: {
            all: {
                src: 'images/sprites/*.png',
                dest: 'images/spritesheet.png',
                destCss: 'styles/partials/_spritesheet.scss',
                padding: 30,
                cssFormat: 'css',
                imgPath: 'images/spritesheet.png'
            }
        },

        // javascript linting with jshint
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                "force": true
            },
            all: [
                'Gruntfile.js',
                'js/source/**/*.js'
            ]
        },

        // uglify to concat, minify, and make source maps
        uglify: {
            plugins: {
                options: {
                    sourceMap: 'js/plugins.js.map',
                    sourceMappingURL: 'plugins.js.map',
                    sourceMapPrefix: 2
                },
                files: {
                    'js/plugins.min.js': [
                        'js/source/bootstrap.js',
                        'js/vendor/cbpAnimatedHeader.js',
                        'js/vendor/classie.js',
                        'js/vendor/contact_me.js',
                        'js/vendor/jquery-1.11.0.js',
                    ]
                }
            },
            main: {
                options: {
                    sourceMap: 'js/main.js.map',
                    sourceMappingURL: 'main.js.map',
                    sourceMapPrefix: 2
                },
                files: {
                    'js/main.min.js': [
                        'js/source/main.js'
                    ]
                }
            }
        },

        // image optimization
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 7,
                    progressive: true,
                    interlaced: true
                },
                files: [{
                    expand: true,
                    cwd: '/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '/images/'
                }]
            }
        },

        // browserSync
        browserSync: {
            dev: {
                bsFiles: {
                    src : ['css/screen.css', '/js/*.js', '/images/**/*.{png,jpg,jpeg,gif,webp,svg}']
                },
                options: {
                    proxy: "http://localhost/proposalboot/",
                    watchTask: true,
                    browser: "google chrome",
                    notify: false
                }
            }
        },


        // deploy via rsync
        deploy: {
            options: {
                src: "./",
                args: ["--verbose"],
                exclude: ['.git*', 'node_modules', '.sass-cache', 'Gruntfile.js', 'package.json', '.DS_Store', 'README.md', 'config.rb', '.jshintrc'],
                recursive: true,
                syncDestIgnoreExcl: true
            },
            staging: {
                 options: {
                    dest: "~/path/to/theme",
                    host: "user@host.com"
                }
            },
            production: {
                options: {
                    dest: "~/path/to/theme",
                    host: "user@host.com"
                }
            }
        }

    });

    // Load in `grunt-spritesmith`
    grunt.loadNpmTasks('grunt-spritesmith');

    // rename tasks
    grunt.renameTask('rsync', 'deploy');

    // register task
    grunt.registerTask('default', ['sass', 'autoprefixer', 'cssmin', 'uglify', 'imagemin', 'browserSync', 'watch']);

};

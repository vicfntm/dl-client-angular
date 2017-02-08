  module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var modRewrite = require('connect-modrewrite'),
    serveStatic = require('serve-static'),
    appConfig = {
      src: 'app',
      tmp: 'tmp',
      dist: 'public',
      name: 'trainee'
    };

  grunt.initConfig({
    app: appConfig,

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= app.dist %>/js/**/*.js',
          '<%= app.dist %>/css/**/*.css'
        ]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: {
          '<%= app.tmp %>/js/app.js': ['<%= app.tmp %>/js/app.js']
        }
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              modRewrite(['^[^\\.]*$ /index.html [L]']),
              serveStatic(appConfig.dist)
            ];
          }
        }
      }
    },

    sass: {
      dist: {
        files: {
          '<%= app.tmp %>/css/app.css': '<%= app.src %>/scss/app.scss'
        }
      }
    },

    bower_concat: {
      dist: {
        dest: '<%= app.tmp %>/js/vendor/bower.js'
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 0%']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app.tmp %>/css/',
          src: '**/*.css',
          dest: '<%= app.tmp %>/css/'
        }]
      }
    },

    includeSource: {
      options: {
        basePath: '<%= app.dist %>',
        baseUrl: '<%= app.dist %>'
      },
      dist: {
        files: {
          '<%= app.dist %>/index.html': '<%= app.src %>/html/index.tpl.html'
        }
      },
      mobile: {
        files: {
          '<%= app.dist %>/index.html': '<%= app.src %>/cordova/index.mobile.tpl.html'
        }
      }
    },

    clean: {
      tmp: {
        files: [{
          expand: true,
          src: [
            '<%= app.tmp %>'
          ]
        }]
      },
      dist: {
        files: [{
          expand: true,
          src: [
            '<%= app.dist %>'
          ]
        }]
      }
    },

    copy: {
      js: {
        files: [{
          expand: true,
          cwd: '<%= app.tmp %>',
          dest: '<%= app.dist %>',
          src: [
            '**/*.js'
          ]
        }]
      },
      vendor: {
        files: [{
          expand: true,
          cwd: '<%= app.src %>',
          dest: '<%= app.tmp %>',
          src: [
            'js/vendor/**/*.js'
          ]
        }]
      },
      html: {
        files: [{
          expand: true,
          cwd: '<%= app.src %>',
          dest: '<%= app.dist %>',
          src: [
            'html/**/*.html',
            '!html/**/*.tpl.html'
          ]
        }]
      },
      styles: {
        files: [{
          expand: true,
          cwd: '<%= app.tmp %>',
          dest: '<%= app.dist %>',
          src: [
            '**/*.css'
          ]
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: '<%= app.src %>',
          dest: '<%= app.dist %>',
          src: [
            'images/**/*'
          ]
        }]
      },
      audio: {
        files: [{
          expand: true,
          cwd: '<%= app.src %>',
          dest: '<%= app.dist %>',
          src: [
            'audio/**/*'
          ]
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= app.src %>',
          dest: '<%= app.dist %>',
          src: [
            'fonts/**/*'
          ]
        }]
      },
      index: {
        files: {
          '<%= app.dist %>/index.html': '<%= app.src %>/html/index.prod.tpl.html'
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          '<%= app.dist %>/css/app.css': ['<%= app.tmp %>/css/app.css']
        }
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      vendor: {
        files: [{
          expand: true,
          cwd: '<%= app.tmp %>/js/vendor',
          src: '**/*.js',
          dest: '<%= app.dist %>/js/vendor'
        }]
      },
      app: {
        files: [{
          expand: true,
          cwd: '<%= app.tmp %>/js',
          src: ['**/*.js', '!vendor/**/*.js'],
          dest: '<%= app.dist %>/js'
        }]
      }
    },

    ngtemplates: {
      options: {
        url: function (url) {
          return url.replace('app/', '');
        }
      },
      'traineeApp': {
        src: '<%= app.src %>/html/**/*.html',
        dest: '<%= app.tmp %>/js/templates.js',
        options: {
          htmlmin: {
            collapseWhitespace: true,
            collapseBooleanAttributes: true
          }
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: '<%= app.src %>',
          dest: '<%= app.dist %>',
          src: [
            'html/**/*.html',
            '!html/**/*.tpl.html'
          ]
        }]
      }
    },

    mkdir: {
      dist: {
        options: {
          create: ['<%= app.tmp %>', '<%= app.dist %>']
        }
      }
    },

    oldmen_build: {
      dist: {
        source: '<%= app.src %>',
        destination: '<%= app.tmp %>',
        appName: '<%= app.name %>'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      clean: [
        'clean:tmp',
        'clean:dist'
      ],
      dist1: [
        'bower_concat:dist',
        'sass:dist',
        'oldmen_build:dist',
        'copy:images',
        'copy:fonts',
        'copy:audio',
        'copy:vendor'
      ],
      dist2: [
        'ngAnnotate:dist',
        'autoprefixer:dist'
      ],
      dev: [
        'copy:html',
        'copy:js',
        'copy:styles'
      ],
      prod: [
        'cssmin:dist',
        'uglify:vendor',
        'uglify:app'
      ]
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= app.src %>/js/**/*.js'],
        tasks: ['oldmen_build:dist', 'copy:js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      styles: {
        files: ['<%= app.src %>/scss/**/*.scss'],
        tasks: ['sass:dist', 'autoprefixer:dist', 'copy:styles'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      index: {
        files: ['<%= app.src %>/html/index.tpl.html'],
        tasks: ['includeSource:dist'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      html: {
        files: ['<%= app.src %>/html/**/*.html', '!<%= app.src %>/html/**/*.tpl.html'],
        tasks: ['copy:html'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      images: {
        files: ['<%= app.src %>/images/**/*'],
        tasks: ['copy:images'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      fonts: {
        files: ['<%= app.src %>/fonts/**/*'],
        tasks: ['copy:fonts'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      }
    }
  });

  grunt.registerTask('serve', [
    'concurrent:clean',
    'mkdir:dist',
    'concurrent:dist1',
    'concurrent:dist2',
    'concurrent:dev',
    'includeSource:dist',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'concurrent:clean',
    'mkdir:dist',
    'concurrent:dist1',
    'concurrent:dist2',
    'htmlmin:dist',
    'concurrent:prod',
    'filerev:dist',
    'copy:index'
  ]);

  grunt.registerTask('default', ['serve']);
};

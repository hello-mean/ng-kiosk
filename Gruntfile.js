'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    kiosk: {
      dist: 'dist',
      src: 'src',
      test: 'test'
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= kiosk.dist %>/*',
          ]
        }]
      },
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%= kiosk.src %>/{,*/}*.js'
      ]
    },
    // not used since Uglify task does concat,
    // but still available if needed
    concat: {
      dist: {
        src:['src/kiosk.js', 'src/*.js'],
        dest: 'dist/kiosk.js'
      }
    },
    // Put files not handled in other tasks here
    uglify: {
      dist: {
        files: {
          '<%= kiosk.dist %>/kiosk.min.js': [
          '<%= kiosk.dist %>/kiosk.js'
          ]
        }
      }
    },
    karma: {
      unit: {
        configFile: "karma.conf.js"
      }  
    }
  });

  grunt.registerTask('test', [
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'concat',
    'uglify',
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};

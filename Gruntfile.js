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
    html2js: {
      dist: {
        options: {
          module: null, // no bundle module for all the html2js templates
          base: '.'
        },
        files: [{
          expand: true,
          src: ['templates/**/*.html'],
          ext: '.html.js'
        }]
      }
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
        src:['templates/*.js', 'src/kiosk.js', 'src/*.js', 'src/**/*.js'],
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
    watch: {
      styles: {
        files:['styles/*.css'],
        tasks:['copy'],
        options: {
          spawn: false
        }
      }
    },
    copy: {
      dist: {
        files:[
          {src: ['styles/*.css'], dest: 'dist/', flatten:true, expand:true}
        ]
      }
    },
    karma: {
      unit: {
        configFile: "karma.conf.js"
      }  
    }
  });

  grunt.registerTask('test', [
    'html2js',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'html2js',
    'concat',
    'uglify',
    'copy'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};

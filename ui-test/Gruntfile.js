module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  sass: {                              // Task 
    dist: {                            // Target 
      options: {                       // Target options 
        style: 'expanded'
      },
      files: {                         // Dictionary of files 
        '../ozp-webtop/src/sass/main.css': 'main.scss',       // 'destination': 'source' 
        '../ozp-webtop/src/sass/variables.css': 'variables.scss'
      }
    }
  }
});

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task(s).
  grunt.registerTask('default', ['sass']);

};
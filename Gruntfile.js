module.exports = function(grunt) {

	var
	tempy = require('./src/tempy.js'),
	tempy_build = tempy.read( grunt.file.read('src/tempy.js') ).render({
		debug : false
	});
	grunt.file.write('dist/tempy.js', tempy_build);


	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			my_target : {
				files : {
					'dist/tempy.min.js' : ['dist/tempy.js']
				}
			}
		}	
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['uglify']);

};
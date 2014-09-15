module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		nodeunit : {
			all : ['test/*.js']
		},
		concat : {
			dist : {
				src : ['src/intro.js', 'src/tempy.js', 'src/outro.js'],
				dest : 'dist/tempy.dev.js'
			}
		},
		tempybuild : {
			builder : 'dist/tempy.dev.js',
			src : 'dist/tempy.dev.js',
			dest : 'dist/tempy.js'
		},
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

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.loadTasks('./tasks');

	grunt.registerTask('test', ['default', 'nodeunit']);
	grunt.registerTask('default', ['concat', 'tempybuild','uglify']);

};
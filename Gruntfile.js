module.exports = function(grunt) {


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		nodeunit : {
			all : ['test/dev.*.js'],
			master : ['test/tempy.js']
		},
		concat : {
			dist : {
				src : ['src/intro.js', 'src/tempy.js', 'src/outro.js'],
				dest : 'dist/tempy.dev.js'
			}
		},
		tempybuild : {
			builder : 'src/tempy.js',
			src : 'dist/tempy.dev.js',
			dest : 'dist/tempy.js'
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> ver.<%= pkg.version %> (build<%= grunt.template.today("yymmdd") %>) */\n'
			},
			target : {
				files : {
					'dist/tempy.min.js' : ['dist/tempy.js']
				}
			}
		},
		update_json: {
			bower: {
				src: 'package.json',
				dest: 'bower.json',
				fields: [
					'name',
					'version',
					'description',
					'authors',
					'homepage'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.loadNpmTasks('grunt-update-json');

	// tempybuild
	grunt.loadTasks('./tasks');



	grunt.registerTask('test', [ 'nodeunit:all' ]);
	grunt.registerTask('default', ['test', 'concat', 'tempybuild', 'uglify', 'nodeunit:master', 'update_json']);

};
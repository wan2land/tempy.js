module.exports = function ( grunt ) {

	grunt.task.registerTask('tempybuild', 'Tempy가 Tempy를 다시 빌드하는 테스크.', function( x, y ) {

		var
		config = grunt.config.data.tempybuild,
		tempy = require('../' + config.builder),

		tempy_build = tempy.read( grunt.file.read( config.src ) ).render({
			debug : false
		});
		grunt.file.write(config.dest, tempy_build);

	});
};
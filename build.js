var
Tempy = require('./src/tempy'),
fs = require('fs'),
compressor = require('node-minify')
;

fs.readFile('./src/tempy.js', 'utf-8', function(err, data) {

	var contents = Tempy.read( data );

	contents.assign('debug', false);

	var rendered_contents = contents.render();

	// tempy를 사용해서 스스로를 빌드.
	fs.writeFileSync('./build/tempy.js', rendered_contents, 'utf-8' );

	new compressor.minify({
		type : 'yui-js',
		fileIn : './build/tempy.js',
		fileOut : './build/tempy.min.js'
	});

});


//var contents = Tempy.read()

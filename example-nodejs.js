var
Tempy = require('./build/tempy'),
fs = require('fs')
;

fs.readFile('./view/example.tempy', 'utf-8', function(err, data) {

	var contents = Tempy.read( data );
	contents.assign('foo', 'This is foo string.');
	contents.assign('bar', [[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9]] );

	var rendered_contents = contents.render({
		hello : 'world'
	});

	console.log( rendered_contents );

});


//var contents = Tempy.read()

var
//Tempy = require('./build/tempy'),
Tempy = require('./src/tempy'),
fs = require('fs')
;

fs.readFile('./README.md', 'utf-8', function(err, data) {

	var contents = Tempy.read( data );

	contents.assign('foo', 'This is foo string.');
	contents.assign('bar', ['this is bar0','this is bar1','this is bar2','this is bar3']);
	contents.assign('baz', [
		[
			'this is baz0-0',
			'this is baz0-1',
		],
		[
			'this is baz1-0',
			'this is baz1-1',
			'this is baz1-2'
		],
		[
			'this is baz2-0',
			'this is baz2-1',
			'this is baz2-2',
			'this is baz2-3'
		]
	]);
	contents.assign('qux', [true, false, false, true]);
	contents.assign('quux', {
		obj1 : 'obj1 string',
		obj2 : 'obj2 string'
	});

	var rendered_contents = contents.render();
	
	/** 위 내용은 다음과 같이도 사용가능합니다.
	var rendered_contents = contents.render({
		foo : 'This is foo string.',
		bar : ['this is bar0','this is bar1','this is bar2','this is bar3'],
		baz : [
			[
				'this is baz0-0',
				'this is baz0-1',
			],
			[
				'this is baz1-0',
				'this is baz1-1',
				'this is baz1-2'
			],
			[
				'this is baz2-0',
				'this is baz2-1',
				'this is baz2-2',
				'this is baz2-3'
			]
		],
		qux : [true, false, false, true],
		quux : {
			obj1 : 'obj1 string',
			obj2 : 'obj2 string'
		}
	})
	// */
	
	console.log( rendered_contents );

});


//var contents = Tempy.read()

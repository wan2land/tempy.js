var
//Tempy = require('./build/tempy'),
Tempy = require('./src/tempy'),
Tempy2 = require('./src/tempy_test'),
fs = require('fs')
;

fs.readFile('./README.md', 'utf-8', function(err, data) {
	
	var
	result1,
	result2
	;

	result1 = (function(){
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

		contents.assign('items1', {
			a : 'a',
			b : 'b', 
			c : 'c'
		});
		contents.assign('items2', [
			'1', '2', '3'
		]);
		contents.assign('items3', 'string');

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
			},
			items1 : {
				a : 'a',
				b : 'b',
				c : 'c'
			},
			items2 : [
				'1', '2', '3'
			],
			items3 : 'string'
		});
		// */
		return contents.render();
	})();

	result2 = (function(){
		var contents = Tempy2.read( data );

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

		contents.assign('items1', {
			a : 'a',
			b : 'b', 
			c : 'c'
		});
		contents.assign('items2', [
			'1', '2', '3'
		]);
		contents.assign('items3', 'string');

		return contents.render();
	})();
	
	
	if ( result1 == result2 ) {
		console.log( 'Same Result!' );
	}
	else {
		fs.writeFile('result1.result.txt', result1);
		fs.writeFile('result2.result.txt', result2);
	}
});


//var contents = Tempy.read()

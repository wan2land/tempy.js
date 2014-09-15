
var
tempy = require('../dist/tempy'),
fs = require('fs'),
assigned_value = {
	foo : 'Foo String',
	bar : ['Bar0','Bar1','Bar2'],
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
		obj1 : 'Quux Obj1',
		obj2 : 'Quux Obj2'
	},
	items1 : {
		a : 'AA',
		b : 'BB',
		c : 'CC'
	},
	items2 : [
		'00', '11', '22'
	]
};


module.exports = {
	testExamples : function( test ) {
		var examples = {
			'example1.1.tempy' : 'hello\nworld',
			'example1.2.tempy' : 'Foo String',

			'example3.1.tempy' : 'Print1\n\nPrint2\n\nPrint3',
			'example3.3.tempy' : 'Inner Condition\n',
			'example3.4.tempy' : 'Condition',

			'example4.1.tempy' : 'Bar0\nBar1\nBar2\n',
			'example4.2.tempy' : 'this is baz0-0\nthis is baz0-1\n\nthis is baz1-0\nthis is baz1-1\nthis is baz1-2\n\nthis is baz2-0\nthis is baz2-1\nthis is baz2-2\nthis is baz2-3\n\n',
			'example4.3.tempy' : '[With Condition:Bar0][With Condition:Bar1][With Condition:Bar2]',
			'example4.4.tempy' : '0[True]\n1[False]\n2[False]\n3[True]\n',
			'example4.5.tempy' : 'a,AA\nb,BB\nc,CC\n\n\n0,00\n1,11\n2,22\n',
			'example4.6.tempy' : 'a\nb\nc\n\n\n0\n1\n2\n',
		};

		for ( key in examples ) {
			test.equal( tempy.read(fs.readFileSync('./test/' + key).toString())
				.render(assigned_value), examples[key]);
		}

		test.done();
	}
};
#!/usr/bin/env node
var
tempy = require('./src/tempy'),
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

console.log( "Print Result!!" );
console.log( tempy.read(fs.readFileSync( process.argv[2] ).toString())
	.render(assigned_value) );


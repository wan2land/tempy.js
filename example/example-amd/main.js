require(['/dist/tempy.min.js'], function(tempy) {


	var
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

	var examples = {
		'example1.1.tempy' : 'hello\nworld',
		'example1.2.tempy' : 'Foo String',

		'example2.1.tempy' : 'Print1\n\nPrint2\n\nPrint3',
		'example2.2.tempy' : 'Inner Condition\n',
		'example2.3.tempy' : 'Condition',

		'example3.1.tempy' : 'Bar0\nBar1\nBar2\n',
		'example3.2.tempy' : 'this is baz0-0\nthis is baz0-1\n\nthis is baz1-0\nthis is baz1-1\nthis is baz1-2\n\nthis is baz2-0\nthis is baz2-1\nthis is baz2-2\nthis is baz2-3\n\n',
		'example3.3.tempy' : '[With Condition:Bar0][With Condition:Bar1][With Condition:Bar2]',
		'example3.4.tempy' : '0[True]\n1[False]\n2[False]\n3[True]\n',
		'example3.5.tempy' : 'a,AA\nb,BB\nc,CC\n\n\n0,00\n1,11\n2,22\n',
		'example3.6.tempy' : 'a\nb\nc\n\n\n0\n1\n2\n',
		'example3.7.tempy' : 'this(a) is AA\nthis(b) is not AA\nthis(c) is not AA\n',
	};

	for ( key in examples ) {
		(function( name ) {
			var
			xhr = new XMLHttpRequest();

			xhr.open('GET', '/test/' + name, true);
			xhr.onreadystatechange = function() {
				if ( xhr.readyState === 4 ) {
					document.body.innerText += '>>' + name + "\n";
					document.body.innerText += tempy.read( xhr.responseText )
						.render(assigned_value) + "\n\n";
					
				}
			};
			xhr.send();

		})( key );
	}



});
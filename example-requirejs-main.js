require(['src/tempy.js'], function(tempy) {

	var

	xhr = new XMLHttpRequest()
	;

	xhr.open('GET', './README.md', true);
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 ) {
			
			var contents = tempy.read( xhr.responseText );
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

			var rendered_contents = contents.render();

			document.getElementById('Example').innerHTML = rendered_contents;

		}
	};
	xhr.send();

});
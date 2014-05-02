;(function(global, factory){
	if (typeof exports === "object") {
		module.exports = factory();
	}
	else if ( typeof define === 'function' && define.amd ) {
		define(factory);
	}
	else {
		global.MyApp = factory();
	}
})(this, function() {

//{{ ? debug }}
	function sleep(delay) {
		var start = new Date().getTime();
		while (new Date().getTime() < start + delay);
	}
//{{ / }}

	function Scanner(string) {
		this.string = string;
		this.tail = string;
		this.pos = 0;
	}
	Scanner.prototype = {
		eos : function() { return this.tail === ''; },
		scan : function( re ) {
			var match = this.tail.match(re);

			if ( !match || match.index !== 0 )
				return false;
			
			var string = match[0];
			this.tail = this.tail.substring( string.length );
			this.pos += string.length;

			return match[0];
		},
		scanUntil : function( re ) {
			var
			result, index,
			match = this.tail.match(re)
			;

			if ( match === null ) {
				result = this.tail;
				this.tail = "";
				this.pos += result.length;
				return result;
			}
			
			index = match.index;
			result = this.tail.substring( 0, index );
			this.tail = this.tail.substring( index );
			this.pos += index;

			return result;
		}
	};

	var Tempy = {};

	Tempy.read = function( contents ) {

		var

		assigned_value = {},
		re_eoc = /[\n\r;]|(\}\})|(--)/,
		re_eol = /[\n\r;]/,
		trim = function( string ) {
			return string.replace(/(^\s*)|(\s*$)/g, '');
		},
		getAssignedValue = function( name ) {
			var k, result = assigned_value;
			name = name.split('.');
			while( k = name.shift() ) {
				if ( typeof result[k] === "undefined" )
					throw new Error('There is no variable');

				result = result[ k ];
			}
			return result;
		},
		parseValue = function( value ) {
			value = trim( value );
			if ( /^true$/i.test(value) ) {
				return true;
			}
			if ( /^false$/i.test(value) ) {
				return false;
			}
			if ( /^null$/i.test(value) ) {
				return null;
			}
			if ( /^(0|[1-9][0-9]*)$/.test(value) ) {
				return parseInt(value);
			}
			if ( /^"((?:[^"]|\\")*)"$/.test(value) ) {
				return value.slice(1,-1).replace(/\\"/, '"').replace(/\\n/, '\n');
			}
			if ( /^'([^']*)'$/.test(value) ) {
				return value.slice(1,-1);
			}
			if ( /^([a-zA-Z_][a-zA-Z0-9_]*)(\.(([a-zA-Z_][a-zA-Z0-9_]*)|(0|[1-9][0-9]*)))*$/.test(value) ) {
				try {
					return getAssignedValue( value );
				}
				catch ( e ) {
					return;
				}
			}

			throw new Error("알 수 없는 타입");
		},
		arrayLast = function( arr ) {
			return arr[arr.length - 1];
		};

		return {
			assign : function( name, value ) {
				assigned_value[name] = value;
			},
			render : function( values ) {

				for( idx in values ) {
					this.assign( idx, values[idx] );
				}
//{{ ? debug }}
				var start_t = process.hrtime();
//{{/}}
				var
				scanner = new Scanner( '}' + '}' + contents + '{' + '{' ),
				result = '',

				value,

				current_block = {
					type : 0, // type 0 : global , 1 : if, 2 : loop
					is_print : true
				},
				block_stack = []

				;
				// initialize :)
				block_stack.push( current_block );
				while( !scanner.eos() ) {
					//sleep(1000);
					if ( scanner.scan(/^\s*\}\}/) ) {
						value = scanner.scanUntil(/\{\{/);
//{{ ? debug }}
						console.log( (new Array(block_stack.length)).join('    '),
							'[출력 : ', value.replace(/[\r\n]/g, '\\n'), ']');
//{{ / }}
						if ( current_block.is_print ) {
							result += value;
						}
						scanner.scan(/\{\{\s*/);

						continue;
					}

					// 주석 무시.
					if ( scanner.scan(/^\s*--/) ) {
						value = scanner.scanUntil(re_eoc);
//{{ ? debug }}
						console.log( (new Array(block_stack.length)).join('    '),
							'[주석 :', value, ']' );
//{{ / }}
						scanner.scan(re_eol);

						continue;
					}

					// print
					if ( scanner.scan(/^\s*\=\s*/) ) {
						value = scanner.scanUntil(re_eoc);
						if ( current_block.is_print ) {
							value = parseValue(value );
							if ( typeof value !== 'undefined' && value !== null ) {
//{{ ? debug }}
								console.log( (new Array(block_stack.length)).join('    '),
									'[출력 : ', value.replace(/[\r\n]/g, '\\n'), ']');
//{{ / }}
								result += value.toString();
							}
						}
						scanner.scan(re_eol);

						continue;
					}

					if ( scanner.scan(/^\s*\?/) ) {
						value = scanner.scanUntil(re_eoc);
	
						value = parseValue(value );
//{{ ? debug }}
						console.log( (new Array(block_stack.length)).join('    '),
							'[조건문 시작]');
//{{/}}
						if ( value ) { // true 일때
//{{ ? debug }}
							console.log( (new Array(block_stack.length)).join('    '),
								'[조건문, IF 출력]');
//{{/}}
							current_block = {
								type : 1,
								is_print : current_block.is_print,
								status : 1
							};
						}
						else { // 아닐 때
							current_block = {
								type : 1,
								is_print : false,
								status : 0
							};
						}
						block_stack.push( current_block );

						scanner.scan(re_eol);

						continue;
					}

					if ( scanner.scan(/^\s*\@/) ) {
						value = scanner.scanUntil(re_eoc);
//{{ ? debug }}
						console.log( (new Array(block_stack.length)).join('    '),
							'[반복문 시작]');
//{{/}}
						var
						iter = value.split('->'),
						iter_name = trim( iter[1] ),
						iter_value = parseValue( iter[0] ) || [],
						iter_len = iter_value.length
						;

						if ( iter_len === 0 || current_block.is_print === false ) {
							current_block = {
								type : 2,
								is_print : false,
								status : 1
							};
						}
						else {
							assigned_value[ iter_name ] = iter_value[0];
							current_block = {
								type : 2,
								is_print : current_block.is_print,
								status : 0,
								tail : scanner.tail,
								pos : scanner.pos,
								iterator : {
									name : iter_name,
									value : iter_value,
									len : iter_len,
									i : 0
								}
							};
						}
						block_stack.push( current_block );

						scanner.scan(re_eol);

						continue;
					}

					// 세미콜론은 걍 지나갑시다.
					scanner.scan(/^\s*\;/);

					// 그외 경우에 처리.
					switch( current_block.type ) {
						case 1 : // if
							if ( scanner.scan(/^\s*\:\?/) ) { // else if

								value = scanner.scanUntil(re_eoc);

								if ( current_block.status === 1 ) {
									current_block.is_print = false;
								}
								else {
									value = parseValue(value );
									if ( value ) {
//{{ ? debug }}
										console.log( (new Array(block_stack.length)).join('    '),
											'[조건문, ELSE IF 출력]');
//{{/}}
										current_block.is_print = true;
										current_block.status = 1;
									}
								}
								scanner.scan(re_eol);
							}
							if ( scanner.scan(/^\s*\:/) ) { // else
								if ( current_block.status === 1 ) {
									current_block.is_print = false;
								}
								else {
//{{ ? debug }}
									console.log( (new Array(block_stack.length)).join('    '),
										'[조건문, ELSE 출력]');
//{{/}}
									current_block.is_print = true;
								}
								scanner.scan(re_eol);
							}
							if ( scanner.scan(/^\s*\//) ) { // endof if
								block_stack.pop();
								current_block = arrayLast( block_stack );
//{{ ? debug }}
								console.log( (new Array(block_stack.length)).join('    '),
									'[조건문 끝]');
//{{/}}
								scanner.scan(re_eol);
							}

							continue;
						case 2 : // loop
							if ( scanner.scan(/^\s*\//) ) { // endof loop
								if ( current_block.status === 0 ) {
									var iter = current_block.iterator;
									iter.i++;
									if ( iter.i < iter.len ) {
										assigned_value[ iter.name ] = iter.value[ iter.i ];
										scanner.tail = current_block.tail;
										scanner.pos = current_block.pos;
									}
									else {
										current_block.status = 1;
									}
								}

								if ( current_block.status === 1 ) {
									block_stack.pop();
									current_block = arrayLast( block_stack );
//{{ ? debug }}
									console.log( (new Array(block_stack.length)).join('    '),
										'[반복문 끝]');
//{{/}}
									scanner.scan(re_eol);
								}
							}
							continue;
					}


//{{ ? debug }}
					console.log( (new Array(block_stack.length)).join('    '),
						"[모르겠는 구문 :: ??")
//{{/}}
				}
//{{ ? debug }}
				var end_t = process.hrtime();

				console.log(' [Runtime : ', end_t[0]-start_t[0] + ( end_t[1]-start_t[1] ) / 1000000000, ']');
//{{/}}
				return result;
			}

		};

	};

	return Tempy;
});
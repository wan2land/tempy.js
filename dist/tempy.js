;(function(global, factory){
	if (typeof exports === "object") {
		module.exports = factory();
	}
	else if ( typeof define === 'function' && define.amd ) {
		define(factory);
	}
	else {
		global.Tempy = factory();
	}
})(this, function() {


//

var Scanner = function(string) {
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

var Tempy = function() {
	/* 임시로 비워둠. */
},
trim = function( string ) {
	return string.replace(/(^\s*)|(\s*$)/g, '');
};

Tempy.read = function( contents ) {

	var

	assigned_value = {},
	re_eoc = /[\n\r;]|(\}\})|(--)/,
	re_eol = /[\n\r;]/,

	assign = function( name, value ) {
		assigned_value[name] = value;
	},

	getAssignedValue = function( name ) {
		var k, result = assigned_value;
		name = name.split('.');
		while( k = name.shift() ) {
			if ( typeof result[k] === "undefined" )
				throw new Error('no value');

			result = result[ k ];
		}
		return result;
	},
	parseFormula = function( value ) {
		var ret = parseValue( value );
		if ( typeof ret === 'object' ) {
			return JSON.stringify( ret );			
		}
		return ret;
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
				return; // return undefined
			}
		}

		throw new Error("알 수 없는 타입");
	},
	parseInterValue = function( value ) {
		var result = [];
		for( var i in value )
			if ( value.hasOwnProperty(i) )
				result.push({
					k : i,
					v : value[i]
				});
		
		return result;
	},
	arrayLast = function( arr ) {
		return arr[arr.length - 1];
	};

	return {
		assign : assign,
		render : function( values ) {

			for( idx in values ) {
				this.assign( idx, values[idx] );
			}
//
			var
			scanner = new Scanner( '}' + '}' + contents + '{' + '{' ),
			result = '',

			value,

			current_block = {
				t : 0, // type 0 : global , 1 : if, 2 : loop
				isp : true // is_print :)
			},
			block_stack = []

			;
			// initialize :)
			block_stack.push( current_block );
			while( !scanner.eos() ) {
				//sleep(1000);
				if ( scanner.scan(/^\s*\}\}/) ) {
					value = scanner.scanUntil(/\{\{/);
//
					if ( current_block.isp ) {
						result += value;
					}
					scanner.scan(/\{\{\s*/);

					continue;
				}

				// print
				if ( scanner.scan(/^\s*\=\s*/) ) {
					value = scanner.scanUntil(re_eoc);
					if ( current_block.isp ) {
						value = parseFormula(value );
						if ( typeof value !== 'undefined' && value !== null ) {
//
							result += value.toString();
						}
					}
					scanner.scan(re_eol);

					continue;
				}

				// 주석 무시.
				if ( scanner.scan(/^\s*--/) ) {
					value = scanner.scanUntil(re_eoc);
//
					scanner.scan(re_eol);

					continue;
				}

				// 조건문 시작
				// 조건문에서는 parseValue가 아니라 parseFormula를 사용한다.
				if ( scanner.scan(/^\s*\?/) ) {
					value = scanner.scanUntil(re_eoc);

					value = parseFormula(value );
//
					if ( value ) { // true 일때
//
						current_block = {
							t : 1,
							isp : current_block.isp,
							status : 1
						};
					}
					else { // 아닐 때
						current_block = {
							t : 1,
							isp : false,
							status : 0
						};
					}
					block_stack.push( current_block );

					scanner.scan(re_eol);

					continue;
				}

				if ( scanner.scan(/^\s*\@/) ) {
					value = scanner.scanUntil(re_eoc);
//
					var
					p,
					iter = value.split(':'),
					iter_value = parseInterValue( parseValue( iter[0] ) || '' ),

					iter_key_name = null,
					iter_value_name = trim( iter[1] ),

					iter_len = iter_value.length
					;

					if ( (p = iter_value_name.indexOf(',') ) !== -1 ) {
						
						iter_key_name 		= trim( iter_value_name.substring(0, p) );
						iter_value_name 	= trim( iter_value_name.substring(p+1) );
						
						if ( iter_key_name == '' ) 
							iter_key_name = null;
						
						if ( iter_value_name == '' )
							iter_value_name = null;
						
					}

					if ( iter_len === 0 || current_block.isp === false ) {
						current_block = {
							t : 2,
							isp : false,
							status : 1
						};
					}
					else {
						if ( iter_key_name !== null )
							assigned_value[ iter_key_name ] = iter_value[0].k;

						if ( iter_value_name !== null )
							assigned_value[ iter_value_name ] = iter_value[0].v;

						current_block = {
							t : 2,
							isp : current_block.isp,
							status : 0,
							tail : scanner.tail,
							pos : scanner.pos,
							iter : {
								key : iter_key_name,
								name : iter_value_name,
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
				switch( current_block.t ) {
					case 1 : // if
						if ( scanner.scan(/^\s*\:\?/) ) { // else if

							value = scanner.scanUntil(re_eoc);

							if ( current_block.status === 1 ) {
								current_block.isp = false;
							}
							else {

								// 조건문에선느 parseValue대신 parseFormula를 사용한다
								value = parseFormula(value );
								if ( value ) {
//
									current_block.isp = true;
									current_block.status = 1;
								}
							}
							scanner.scan(re_eol);
						}
						if ( scanner.scan(/^\s*\:/) ) { // else
							if ( current_block.status === 1 ) {
								current_block.isp = false;
							}
							else {
//
								current_block.isp = true;
							}
							scanner.scan(re_eol);
						}
						if ( scanner.scan(/^\s*\//) ) { // endof if
							block_stack.pop();
							current_block = arrayLast( block_stack );
//
							scanner.scan(re_eol);
						}

						continue;
					case 2 : // loop
						if ( scanner.scan(/^\s*\//) ) { // endof loop
							if ( current_block.status === 0 ) {
								var iter = current_block.iter;
								iter.i++;
								if ( iter.i < iter.len ) {
									if ( iter.key !== null )
										assigned_value[ iter.key ] = iter.value[ iter.i ].k;

									if ( iter.name !== null )
										assigned_value[ iter.name ] = iter.value[ iter.i ].v;

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
//
								scanner.scan(re_eol);
							}
						}
						continue;
				}


//
				result += '<!--Parsing Error-->';
				break;
			}
//
			return result;
		}

	};

};

//
	return Tempy;
});
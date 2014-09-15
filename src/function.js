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

	var Tempy = function() {},
	html_escape = function( string ) {
		return string.replace(/\'/g, '\\\'').replace(/\n/, '\\n');
	},
	re_comment 		= /\s*--([\s\S]+)/g,
	re_print 		= /\s*=\s*([\s\S]+)/g,
	re_for1 		= /\s*@\s*([^\:\s]+)\s*\:\s*([^\:\s]+)\s*\,\s*([^\:\s]+)\s*/g,
	re_for2 		= /\s*@\s*([^\:\s]+)\s*\:\s*([^\:\s]+)\s*\,\s*/g,
	re_for3 		= /\s*@\s*([^\:\s]+)\s*\:\s*([^\:\s]+)\s*/g,

	re_elseif 		= /\s*\:\?([\s\S]+)/g,
	re_if 			= /\s*\?([\s\S]+)/g,
	re_else 		= /\s*:\s*/g,
	re_block_end	= /\s*\/\s*/g,
	re_number_point = /\.(0|[1-9][0-9]*)/g;

	Tempy.read = function( codes ) {

		var
		assigned_value = {};
		return {
			assign : function( name, value ) {
				assigned_value[ name ] = value;
			},
			render : function( values ) {
				for ( var name in values ) {
					assigned_value[ name ] = values[ name ];
				}

				var ret = "var output='";
				var blocks = codes.split(/\{\{|\}\}/);
				for ( var i = 0, ilen = blocks.length; i < ilen; i++ ) {
					if ( i % 2 == 0 ) {
						ret += html_escape( blocks[i] );
					}
					else {
						var inner_blocks = blocks[i].split(/[\n\r;]/);
						for ( var j = 0, jlen = inner_blocks.length; j < jlen; j++ ) {
							var parsed_bit = inner_blocks[j].replace( /(^\s*)|(\s*$)/g, ''); // trim

							if ( parsed_bit == "" ) continue;

							if ( re_comment.test(parsed_bit) ) {
								parsed_bit = parsed_bit.replace( re_comment, "" ); // 주석
							}
							else if ( re_print.test(parsed_bit) ) {
								parsed_bit = parsed_bit.replace( re_print, "'+$1+'" ); // 일반 변수.
							}
							// @ items : key , value => for( var key in items ) { var value = items[key]; ret +='
							// @ items : key ,       => for( var key in items ) { ret +='
							// @ items : value       => for( var xxx in items ) { var value = items[xxx]; ret +='
							else if ( re_for1.test(parsed_bit) ) {
								parsed_bit = parsed_bit.replace( re_for1, "';for(var $2 in $1){var $3=$1[$2];ret+='");
							}
							else if ( re_for2.test(parsed_bit) ) {
								parsed_bit = parsed_bit.replace( re_for2, "';for(var $2 in $1){output+='");
							}
							else if ( re_for3.test(parsed_bit) ) {
								parsed_bit = parsed_bit.replace( re_for3, "';for(var xx in $1){var $2=$1[xx];output+='");
							}


							else if ( re_elseif.test(parsed_bit) ) {
								parsed_bit = parsed_bit.replace( re_elseif, "';}else if($1){output+='"); // else if 
							}
							else if ( re_if.test(parsed_bit) ) {
								parsed_bit = parsed_bit.replace( re_if, "';if($1){output+='"); // if
							}
							else if ( re_else.test(parsed_bit) ) {
								parsed_bit = parsed_bit.replace( re_else, "';} else{output+='"); // else
							}
							else if ( re_block_end.test(parsed_bit) ) {
								parsed_bit = parsed_bit.replace( re_block_end, "';} output+='"); // end of condition / loop	
							}
							else {
								parsed_bit += "[" + re_print.test(parsed_bit) + "]";
//								parsed_bit = parsed_bit.replace( re_print, "'+$1+'" )
//								parsed_bit = "-_-";
							}
							
							if ( re_number_point.test(parsed_bit) ) {
								parsed_bit = parsed_bit.replace( re_number_point, '[$1]'); // 숫자 변수..
							}

							ret += parsed_bit;
						}
					}

				}

				ret += "';return output;";

				var keys = [];
				var vals = [];
				for ( var key in assigned_value ) {
					keys.push( key );
					vals.push( assigned_value[key] );
				}

				return ret;
//				ret = 'var output=\'\';if( true){output+=\'\';for(var xx in bar){var item=bar[xx];output+=\'\'+ "[With Condition:"+\'= item\'+ "]"+\'\';} output+=\'\';}else if( true){output+=\'\'+ "출력x"+\'\';} else{output+=\'\'+ "출력x"+\'/\';return output;';

				eval("var xx = new Function(\""+ (keys.join("\",\"")) + "\",ret);");
				return xx.apply( null, vals );

			}
		};
	}


	return Tempy;
});

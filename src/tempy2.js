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
	re_print 		= /\{\{\s*=\s*([^\s]+)\s*\}\}/g,

	// @ items : key , value => for( var key in items ) { var value = items[key]; ret +='
	// @ items : key ,       => for( var key in items ) { ret +='
	// @ items : value       => for( var xxx in items ) { var value = items[xxx]; ret +='
	re_for1 		= /\{\{\s*@\s*([^\:\s]+)\s*\:\s*([^\:\s]+)\s*\,\s*([^\:\s]+)\s*\}\}/g,
	re_for2 		= /\{\{\s*@\s*([^\:\s]+)\s*\:\s*([^\:\s]+)\s*\,\s*\}\}/g,
	re_for3 		= /\{\{\s*@\s*([^\:\s]+)\s*\:\s*([^\:\s]+)\s*\}\}/g,

	re_elseif 		= /\{\{\s*\:\?([\s\S]+)\s*\}\}/g,
	re_if 			= /\{\{\s*\?([\s\S]+)\s*\}\}/g,
	re_else 		= /\{\{\s*:\s*\}\}/g,
	re_block_end	= /\{\{\s*\/\s*\}\}/g,
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

//				var ret = inner_blocks[j].replace( /(^\s*)|(\s*$)/g, ''); // trim
				var ret = codes;

				ret = ret.replace(/\}\}((?:[^\{]*|[^\{]*\{[^\{]+|[^\{]+\{[^\{]*)+)\{\{/g, function( contents, matches ) {
					return '}}' + html_escape(matches[0]) + '{{';
				});

				//if ( re_print.test(ret) ) {
					ret = ret.replace( re_print, "'+$1+'" ); // 일반 변수.
				//}
				//else if ( re_for1.test(ret) ) {
					ret = ret.replace( re_for1, "';for(var $2 in $1){var $3=$1[$2];ret+='");
				// }
				// else if ( re_for2.test(ret) ) {
					ret = ret.replace( re_for2, "';for(var $2 in $1){op+='");
				// }
				// else if ( re_for3.test(ret) ) {
					ret = ret.replace( re_for3, "';for(var xx in $1){var $2=$1[xx];op+='");
				// }


				// else if ( re_elseif.test(ret) ) {
					ret = ret.replace( re_elseif, "';}else if($1){op+='"); // else if 
				// }
				// else if ( re_if.test(ret) ) {
					ret = ret.replace( re_if, "';if($1){op+='"); // if
				// }
				// else if ( re_else.test(ret) ) {
					ret = ret.replace( re_else, "';}else{op+='"); // else
				// }
				// else if ( re_block_end.test(ret) ) {
					ret = ret.replace( re_block_end, "';}op+='"); // end of condition / loop	
				// }
				// else if ( re_print.test(ret) ) {
					ret = ret.replace( re_print, "'+$1+'" ); // 일반 변수.
// 				}
// 				else {
// //								ret += "[" + re_print.test(ret) + "]";
// //								ret = ret.replace( re_print, "'+$1+'" )
// //								ret = "-_-";
// 				}
				
				if ( re_number_point.test(ret) ) {
					ret = ret.replace( re_number_point, '[$1]'); // 숫자 변수..
				}

				var ret = "var op='" + ret + "';return op;";

				var keys = [];
				var vals = [];
				for ( var key in assigned_value ) {
					keys.push( key );
					vals.push( assigned_value[key] );
				}

				//return ret;
//				ret = 'var output=\'\';if( true){output+=\'\';for(var xx in bar){var item=bar[xx];output+=\'\'+ "[With Condition:"+\'= item\'+ "]"+\'\';} output+=\'\';}else if( true){output+=\'\'+ "출력x"+\'\';} else{output+=\'\'+ "출력x"+\'/\';return output;';

				eval("var xx = new Function(\""+ (keys.join("\",\"")) + "\",ret);");
				return xx.apply( null, vals );

			}
		};
	}


	return Tempy;
});

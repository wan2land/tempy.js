var Tempy = function() {},

html_escape = function( string ) {
	return string.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\n/g, '\\n');
},
re_print 		= /\{\{\s*=\s*([^\}\{]+)\s*\}\}/g,

// @ items : key , value => for( var key in items ) { var value = items[key]; ret +='
// @ items : key ,       => for( var key in items ) { ret +='
// @ items : value       => for( var xxx in items ) { var value = items[xxx]; ret +='
re_for1 		= /\{\{\s*@\s*([^\:\s]+)\s*\:\s*([^\:\s]+)\s*\,\s*([^\:\s]+)\s*\}\}/g,
re_for2 		= /\{\{\s*@\s*([^\:\s]+)\s*\:\s*([^\:\s]+)\s*\,\s*\}\}/g,
re_for3 		= /\{\{\s*@\s*([^\:\s]+)\s*\:\s*([^\:\s]+)\s*\}\}/g,

re_elseif 		= /\{\{\s*\:\?([^\}\{}]+)\s*\}\}/g,
re_if 			= /\{\{\s*\?([^\}\{}]+)\s*\}\}/g,
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

			var ret = codes;

			ret = ret.replace(/(\}\}|^)((?:[^\{]*|[^\{]*\{[^\{]+|[^\{]+\{[^\{]*)+)(\{\{|$)/g,
						function( contents, open, match, close ) {
					return open + html_escape(match) + close;
				})
				.replace( re_print,		"'+$1+'" )
				.replace( re_for1, 		"';for(var $2 in $1){var $3=$1[$2];op+='")
				.replace( re_for2, 		"';for(var $2 in $1){op+='")
				.replace( re_for3, 		"';for(var xx in $1){var $2=$1[xx];op+='")
				.replace( re_elseif, 	"';}else if($1){op+='")
				.replace( re_if, 		"';if($1){op+='")
				.replace( re_else, 		"';}else{op+='")
				.replace( re_block_end,	"';}op+='");
			
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

//{{ ? debug == true }}
			console.log( ret );
//{{ / }}f


			eval("var tf = new Function(\""+ (keys.join("\",\"")) + "\",ret);");
			return tf.apply( null, vals );

		}
	};
}

//{{ ? debug == true }}
module.exports = Tempy;
//{{ / }}
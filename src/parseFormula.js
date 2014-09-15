
var
buffer = function() {

},
isSimple = function() {

},
isFormula = function( value ) {
	return /(\|\||\(|\)|\=\=|\&\&|\!)/g.test(value);
},
parseFormula = function( string ) {
	if ( !isFormula( string ) ) {
		var ret = parseValue( string );
		if ( typeof ret === 'object' ) {
			return JSON.stringify( ret );			
		}
		return ret;
	}
	var buffer = [];
	for(var i = 0, ilen = string.length; i < ilen; i++) {
		buffer.insert( string[i] );
		buffer.next( string[i] );
		string[i]
	}

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
}
;


module.exports = {
	isSimple : isSimple,
	isFormula : isFormula,
	parseFormula : parseFormula
};


(function() {
	var
	re_escape_bracket = /^\((.*)\)$/,
	re_inner_bracket = /\([^\)\(]+\)/,
	
	realParseFormula = function( formula ) {
		var
		inner_formula;

		while( re_escape_bracket.test( formula ) ) {
			formula = formula.replace(re_escape_bracket, '$1');
		}

		while ( re_inner_bracket.test( formula ) ) {
			formula = formula.replace( re_inner_bracket, function( match ) {
				return realParseFormula( match );
			});
		}

		//while ( block = formula.match() ) {

		//}
		console.log( formula );
		//return parseValue( formula );
	},
	parseFormula = function( formula ) {
		if ( formula.split('(').length !== formula.split(')').length ) {
			throw new Error("괄호의 갯수가 서로 다릅니다.");
		}

		return realParseFormula( formula.replace(/\s+/g, '') ); 
	},
	parseValue = function( value ) {
		value = value.replace(/(^\s*)|(\s*$)/g, '');
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
	}

	;


	parseFormula( "((  (  ( false || 	true  )	&& false	) ))" );
})();





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

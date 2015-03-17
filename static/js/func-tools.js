var funcTools = (function () {	
    
    var namespace = {
	caller : caller
    };
    
    return namespace;

    function caller() {
	var args = Array.prototype.slice.call(arguments),
	    method = args.shift();
	    return function () {
		var newargs = Array.prototype.slice.call(args);
		newargs = newargs.concat(Array.prototype.slice.call(arguments));
		    return method.apply(this, newargs);
		};
	};	
})();
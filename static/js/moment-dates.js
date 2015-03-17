(function() {
	var ISO_8601 = "YYYY-MM-DDTHH:mm:ss";
	if (!moment) {
		return; // moment is required
	}
	
	Date.parseDate = function(input, format) {
		var val = moment(input, format || ISO_8601).toDate();
		return val;
	};
	Date.prototype.dateFormat = function(format) {
		return moment(this).format(format);
	};
	Date.prototype.toISOString = function(input) {
		return moment(this).format(ISO_8601);
	};
	Date.validateDateTime = function(input, format) {
		var m = moment(input, format || ISO_8601); 
		return m.isValid();
	};
	
})();
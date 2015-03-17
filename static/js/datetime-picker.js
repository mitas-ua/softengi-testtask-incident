(function () {
	angular.module("incidents.dateTimePicker", [])
		.directive('dtPicker', function () {
			return {
				restrict : "A",
				require : "?ngModel",
				link : dateTimePickerLinkFunc
			};
		})
		.filter("mdate", momentDateFilter);
	
	function dateTimePickerLinkFunc(scope, elm, attrs, ngModel) {
		var  options = scope.$eval(attrs.dtPicker || "{}")
			,format = options.format || "dd.MM.YYYY HH:mm:ss"
			,minDate, maxDate
			;

		if (ngModel) {
			
			ngModel.$validators.datetime = function(modelValue) {
				return Date.validateDateTime(modelValue);
			};
			
			if (options.minDate) {
				minDate = Date.parseDate(options.minDate, format).toISOString();
				ngModel.$validators.min = function(modelValue) {
					return modelValue >= minDate;
				};
			}
			
			if (options.maxDate) {
				maxDate = Date.parseDate(options.maxDate, format).toISOString();
				ngModel.$validators.max = function (modelValue) {
					return modelValue <= maxDate;
				};
			}
			
			ngModel.$parsers.unshift(function (viewValue) {
				var val = viewValue, isValid;
				if (!(val instanceof Date)) {
					isValid = Date.validateDateTime(val, format);
					if (!isValid) return val;
					val = Date.parseDate(val, format);
				}
				if (!val || !val.toISOString) return;
				return val.toISOString();
				
			});
			
			ngModel.$formatters.unshift(function (modelValue) {
				var val = modelValue;
					if (!val) {
						return "";
					}
					if (!(val instanceof Date)) {
						val = Date.parseDate(val);
					}
					val = val.dateFormat(format);
				return val;				
			});
		};
		
		elm.datetimepicker(options);
	}
	
	function momentDateFilter() {
		return function (input, format) {

			if (!(input instanceof Date)) {
				input = Date.parseDate(input);			
			}
			return input.dateFormat(format); 
		};
	};
})();
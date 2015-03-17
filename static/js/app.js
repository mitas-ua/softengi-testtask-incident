(function() {
	"use strict";
	var Application = angular.module("incidents", [ 
			"incidents.Resources", "incidents.commonData",
			"incidents.dateTimePicker", "incidents.generalIncident",
			"incidents.incidentActions", "incidents.incidentReview" ]);

	Application.controller("mainController", mainControllerFunc);

	mainControllerFunc.$injector = [ "Incident" ];
	function mainControllerFunc(Incident) {
		var ctrl = this;
		ctrl.incident = Incident;
	}

})();
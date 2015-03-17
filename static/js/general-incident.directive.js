(function() {
    "use strict";
    angular.module("incidents.generalIncident", ["incidents.commonData"])
        .controller("generalIncidentCtrl", generalIncidentCtrlFunc)
        .directive("generalIncident", function() {
                return {
                    restrict : "E",
                    require : "ngModel",
                    scope : {
                        incident : "=manage"
                    },
                    controller : 'generalIncidentCtrl',
                    controllerAs : "ctrl",
                    templateUrl : 'static/partials/general-incident.directive.html'
                };
            }); // end of directive declaration

    generalIncidentCtrlFunc.$inject = [ "$scope", "commonData" ];
    function generalIncidentCtrlFunc($scope, commonData) {
        var ctrl = this,
            storedData = null;
        ctrl.incident = $scope.incident || {};
        ctrl.dtPickerShown = false;
        ctrl.dtPickerBtnClick = dtPickerBtnClick;
        ctrl.usPhoneRE = /^[0-9]{3}\.[0-9]{3}\.[0-9]{4}$/;
        ctrl.getValidClass = getValidClass;
        ctrl.noneApply = false;
        ctrl.toggleIncidentSeverity = toggleIncidentSeverity;
        ctrl.severityValid = severityValid;
        ctrl.wells = commonData.wells;

        ctrl.dtOptions = {
            format : "MM/DD/YYYY hh:mm A", 
            formatDate : "MM/DD/YYYY",
            formatTime : "hh:mm a",
            maxDate : (new Date()).dateFormat("MM/DD/YYYY hh:mm A"),
            step : 15,
            defaultSelect : true,
            onShow : funcTools.caller(setDtPickerShown, true),
            onClose : funcTools.caller(setDtPickerShown, false)
        };

        ctrl.companies = commonData.companies;
        ctrl.incidentSeverity = commonData.incidentSeverity;

        try { $scope.$digest();} catch (e) {};        
        
        return;
        
        // Implementation block bellow
        
        function dtPickerBtnClick() {
            var $elm = angular.element("#dateTime");
            if (!$elm.datetimepicker) return;
            $elm.datetimepicker("show");
        }

        function getValidClass(fld, classValid, classError) {
            var form = $scope.incidentGeneral,
                elm = form[fld] || form;
            ctrl.incident.incidentForm = form;
            ctrl.incident.validationStamp(fld, elm);
            if (elm.$invalid && (elm.$dirty || elm.$touched))
                return classError || 'has-error';
            if (elm.$valid && (elm.$dirty || elm.$touched))
                return classValid || 'has-success';
            return '';
        }

        function severityValid(){
            var values = ctrl.incident.severity(false),
                valid = !!values.length,
                elm = {
                    $invalid : !valid,
                    $valid : valid,
                    $error : valid ? {} : { required : true }
                };

            ctrl.incident.validationStamp("severity", elm);
            return valid;
        }
        
        function toggleIncidentSeverity() {
            var incident = ctrl.incident,
                noneApply = incident.incidentSeverity['None Apply'];
            if (noneApply === false && storedData) {
                incident.incidentSeverity = storedData;
                storedData = null;
            } else {
                storedData = {};
                for (var p in incident.incidentSeverity)
                    if (incident.incidentSeverity.hasOwnProperty(p) && p != "None Apply") {
                        storedData[p] = incident.incidentSeverity[p];
                        incident.incidentSeverity[p] = false;
                    }
            }
        }

        function setDtPickerShown(flag) {
            ctrl.dtPickerShown = flag;
            try {$scope.$digest();} catch(e) {};
        }        
    }

})();
(function (){
    "use strict";
    var module = angular.module("incidents.incidentActions", [
        "incidents.generalIncident",
        "incidents.Resources"]);
    
    module
        .controller("incidentActionsCtrl", incidentActionsCtrlFunc)
        .directive("incidentActions", function() {
            return {
                restrict : "E",
                require : "ngModel",
                scope : {
                    incident : "=manage"
                },
                controller : 'incidentActionsCtrl',
                controllerAs : "ctrl",
                templateUrl : 'static/partials/incident-actions.directive.html'
            };
        }); // end of directive declaration)
    
    incidentActionsCtrlFunc.$inject = [ "$scope", "commonData", "Action" ];
    function incidentActionsCtrlFunc($scope, commonData, Action){
        var ctrl = this;
        ctrl.incident = $scope.incident || {};
        ctrl.actions = this.incident.actions = this.incident.actions || [];    
        ctrl.dtOptions = {
            format : "MM/DD/YYYY", 
            formatDate : "MM/DD/YYYY",
            defaultSelect : true,
            closeOnDateSelect : true,
            timepicker : false,
            defaultTime : "00:00"
        };
        ctrl.companies = commonData.companies;
        ctrl.maxActions = commonData.maxActionsCount;
        ctrl.newAction = newAction;
        ctrl.isNewDenied = isNewDenied;
        ctrl.isRemoveDenied = isRemoveDenied;
        ctrl.removeAction = removeAction;
        ctrl.getValidClass = getValidClass;
        ctrl.remaining = remaining; 
        
        try { $scope.$digest(); } catch(e) {};
        
        if (!ctrl.actions.length) {
            newAction();
        }
    
        return;
        
        // Implementation code bellow:
        
        function isNewDenied() {
            return (ctrl.actions.length >= commonData.maxActionsCount);
        }
        
        function newAction() {
            if (isNewDenied()) return;
            ctrl.actions.push(new Action());
        }
        
        function isRemoveDenied() {
            return ctrl.actions.length < 2;
        }
        
        function removeAction(index) {
            if (isRemoveDenied()) return;
            ctrl.actions.splice(index, 1);
        }
        
        function getValidClass(fld, index, classValid, classError) {
            var action = ctrl.actions[index],
                form = $scope.actionForm,
                fld = fld + "_" + index,
                elm = form[fld];
            ctrl.incident.actionForm = form;

            action.validationStamp(fld, elm);
            if (elm.$invalid && (elm.$dirty || elm.$touched))
                return classError || 'has-error';
            if (elm.$valid && (elm.$dirty || elm.$touched))
                return classValid || 'has-success';
            return '';
        }
        
        function remaining() {
            return (commonData.maxActionsCount - ctrl.actions.length);
        }
    }

})();
(function (){
    "use strict";
    angular.module("incidents.incidentReview", ["incidents.dateTimePicker"])
        .controller("incidentReviewCtrl", incidentReviewCtrlFunc)
        .directive("incidentReview", function() {
                return {
                    restrict : "E",
                    require : "ngModel",
                    scope : {
                        incident : "=manage"
                    },
                    controller : 'incidentReviewCtrl',
                    controllerAs : "ctrl",
                    templateUrl : 'static/partials/incident-review.directive.html'
                };
            }); // end of directive declaration
        
    incidentReviewCtrlFunc.$inject = [ "$scope" ];
    function incidentReviewCtrlFunc($scope) {
        var ctrl = this;
        ctrl.incident = $scope.incident;
        ctrl.allowShow = allowShow;
        ctrl.showRequired = funcTools.caller(isError, "required");
        ctrl.wrongDate = funcTools.caller(isError, "datetime");
        ctrl.wrongPattern = funcTools.caller(isError, "pattern");
        ctrl.tooBig = funcTools.caller(isError, "max");
        ctrl.tooSmall = funcTools.caller(isError, "min");
        ctrl.allowShowActions = allowShowActions;
        ctrl.actionAllowShow = actionAllowShow;
        ctrl.actionIsError = actionIsError; 
        ctrl.allowSubmit = allowSubmit;
        ctrl.submit = submit;
        
        return;
        
        // Implementation block bellow
        
        function allowShow(field) {
            var val = ctrl.incident.$validation,
                elm = val && val[field];
            if (!elm) return false;
            return elm.$valid;
        };
                
        function isError(error, field) {
            var val = ctrl.incident.$validation,
                elm = val && val[field];
            if (!elm) return error == "required";
            return elm.$error[error] && (!elm.$error.required || error == "required");
        }
        
        function actionAllowShow(field, index) {
            var index = (index < ctrl.incident.actions.length) ? index : -1,
                val = (index >=0) && ctrl.incident.actions[index].$validation,
                field = val && field+"_"+index,                
                elm = val && val[field];
            if (!elm) return false;
            return elm.$valid;
        }
        
        function actionIsError(field, index, error) {
            var index = (index < ctrl.incident.actions.length) ? index : -1,
                val = (index >=0) && ctrl.incident.actions[index].$validation,
                field = val && field+"_"+index, 
                elm = val && val[field];
            if (!elm) return error == "required";
            return elm.$error[error] && (!elm.$error.required || error == "required");
        }
        
        function allowShowActions() {
            return ctrl.incident.actions.length > 0;
        }

        function allowSubmit() {
            var incident = ctrl.incident;
            return (incident.incidentForm && incident.incidentForm.$dirty && incident.incidentForm.$valid) &&
                   (incident.actionForm && incident.actionForm.$dirty && incident.actionForm.$valid) &&
                   (incident.severity().length > 0);
        }

        function submit() {
            var incident = ctrl.incident,
                json = incident.serialize(),
                fields = json.workflowStepUpdateInformation.fields,
                i, indent = Array(13).join(" ");
                ;
            json.workflowStepUpdateInformation.fields = ["#FIELDS#"];
            json = JSON.stringify(json, "", 4);
            for(i=0; i<fields.length;i++) {
                fields[i] = JSON.stringify(fields[i]);
            }
            
            json = json.replace('"#FIELDS#"', fields.join("\n"+indent));
            var w = window.open();
            w.document.write('<script src="https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js"></script>');
            w.document.write('<pre class="prettyprint"><code class="language-javascript">'+json+"</code></pre>");
        }
    }

})();
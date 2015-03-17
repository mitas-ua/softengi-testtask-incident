(function (){
    "use strict";
    var theIncident = new Incident();
    
    angular.module("incidents.Resources", [])
        .factory("Incident", incidentObjFactory)
        .factory("Action", actionFactory)
        ;
    
    function incidentObjFactory() {
        return theIncident;
    }
    
    function actionFactory() {
        return Action;
    }
    
    function Action() {
        this.description = null;
        this.takenBy = null;
        this.company = null;
        this.date = null; 
    }
    Action.prototype.validationStamp = validationStamp;
    
    function Incident() {
        this.dateTime = null; 
        this.reportedBy = null;
        this.reporterCompany = null;
        this.contactNumber = null;
        this.supervisorName = null;
        this.description = null;
        this.well = null;
        this.incidentSeverity = {};
        this.actions = [];
    }
    
    Incident.prototype.serialize = incidentSerialize;
    Incident.prototype.validationStamp = validationStamp;
    Incident.prototype.severity = severity;
    Incident.prototype.mapping = getMapping();
    
    function incidentSerialize() {
        var fields = serialize.call(this), 
            rpcRequest = {
                "workflowCreationInformation" : {
                    "workflowTypeName" : "Incident Report",
                    "name" : "Report - 2013.05.09"
                },
                "workflowStepUpdateInformation" : {
                    "stepIdOrName" : "Initial Step",
                    "fields" : fields
                }
            };
        return rpcRequest;
    };
    
    function severity(fixNoneApply) {
        var value = this.incidentSeverity,
            values = [];
        for (var p in value) {
            if (value.hasOwnProperty(p) && value[p] === true) {
                values.push(p);
            }
        }
        if (!values.length && fixNoneApply) {
            values.push("None Apply");
        }
        return values;
    }
    
    validationStamp.toCopy = [ "$valid", "$invalid", "$error", "$dirty", "$touched", "$pristine" ];
    function validationStamp(fld, elm) {
        var i, f;
        this.$validation = this.$validation || {};
        this.$validation[fld] = this.$validation[fld] || {};
        for (i=0;i<validationStamp.toCopy.length;i++) {
            f = validationStamp.toCopy[i];
            this.$validation[fld][f] = angular.copy(elm[f]);
        }
    }
    
    function serialize () {
        var self = this, fields = [], fs,
            mapping = self.mapping, 
            f = null, rule, field, values, index;
        
        for (f in mapping) if (mapping.hasOwnProperty(f)) {
            rule = mapping[f];
            field = null;
            switch (typeof rule) {
            
            case "string":
                field = {
                    name : rule || f,
                    values : [ self[f] ]
                };
                break;

            case "object":
                if (rule.values) {
                    if (typeof rule.values === "function") {
                        values = rule.values(self[f]);
                    } else
                        values = rule.values;
                } else
                    values = [ self[f] ];
                field = {
                    name : rule.name || f,
                    values : values
                };
                break;

            case "function":
                values = self[f];
                if (values instanceof Array) {
                    field = [];
                    for (index = 0; index < values.length; index++) {
                        fs = rule(values[index], index);
                        field = field.concat(fs);
                    }
                    ;
                } else
                    field = rule(f, self[f]);
                break;

            }
            if (field) {
                fields = fields.concat(field);                        
            }
        }

        return fields;
    };
    
    function getMapping () {
        
        return {
            dateTime : "Date and Time of Incident",
            reportedBy : "Reported By",
            reporterCompany : "Company of Reporter",
            contactNumber : "Contact Number",
            supervisorName : "Supervisor Name",
            description : "High Level Description of Incident",
            well : function(name, value) {
                return [{
                    name : "Well Number",
                    values : [ value.number ]
                }, {
                    name : "Region",
                    values : [ value.region ]
                }, {
                    name : "State",
                    values : [ value.state ]
                }, {
                    name : "Field Office",
                    values : [ value.fieldOffice ]
                } ];
            },
            incidentSeverity : {
                name : "Incident Severity (Check all that Apply)",
                values : function(value) {
                    return severity.call({
                        incidentSeverity: value
                    }, true);
                }    
            },
            actions : function(item, index) {
                var fields;
                index = index + 1;
                fields = [ {
                    name : "Description of Corrective Action (" + index + ")",
                    values : [ item.description ]
                }, {
                    name : "Action Taken By (name) (" + index + ")",
                    values : [ item.takenBy ]
                }, {
                    name : "Company (" + index + ")",
                    values : [ item.company ]
                }, {
                    name : "Date (" + index + ")",
                    values : [ item.date ]
                } ];
        
                return fields;
            }
        };  // end of mapping
        
    }
})();
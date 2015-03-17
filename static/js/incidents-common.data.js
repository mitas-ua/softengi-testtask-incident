(function() {
    "use strict";
    angular
        .module("incidents.commonData", [])
        .factory("commonData", commonDataFactory);

    function commonDataFactory() {
        var data = {};

        data.wells = [ {
            "number" : "Well-01",
            "region" : "South",
            "state" : "Oklahoma",
            "fieldOffice" : "Ringwood"
        }, {
            "number" : "Well-02",
            "region" : "North",
            "state" : "Montana",
            "fieldOffice" : "Sidney"
        }, {
            "number" : "Well-03",
            "region" : "North",
            "state" : "North Dakota",
            "fieldOffice" : "Tioga"
        } ];

        data.companies = [ "Company A", "Company B", "Company C", "Company D" ];
        data.incidentSeverity = [ "Loss of well control", "Fatality(ies)",
                "Hospitalization or medical treatment",
                "Spill offsite > 50 Bbls", "Spill to water, any amount",
                "Property damage" ];
        data.maxActionsCount = 5;

        return data;
    }
})();
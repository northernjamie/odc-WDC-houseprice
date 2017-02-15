(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "monthyearformatlabel",
            alias: "monthyearformatted",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "areaname",
            alias: "areaname",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "areacode",
            alias: "areacode",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "houseprice",
            alias: "houseprice",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "monthyearlabel",
            alias: "monthyear",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "areatypename",
            alias: "areatype",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "housePriceData",
            alias: "Avge House Prices By Month Area",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("http://opendatacommunities.org/sparql.json?query=PREFIX%20qb%3A%20%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX%20rdf%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0ASELECT%20%3Fareacode%20%3Fareaname%20%3Fareatypename%20%3Fmonthyearlabel%20%3Fmonthyearformatlabel%20%3Fhouseprice%20WHERE%20%7B%20GRAPH%20%3Chttp%3A%2F%2Fopendatacommunities.org%2Fgraph%2Fhousing-market%2Fland-registry%2Fhpi%2Faverage-price%2Fby-property-type%3E%20%0A%20%7B%3Fs%20qb%3AdataSet%20%3Chttp%3A%2F%2Fopendatacommunities.org%2Fdata%2Fhousing-market%2Fland-registry%2Fhpi%2Faverage-price%2Fby-property-type%3E%20%3B%0A%20%20%20%20%3Chttp%3A%2F%2Fopendatacommunities.org%2Fdef%2Fontology%2Ftime%2FrefPeriod%3E%20%3Fmonthyear%20%3B%0A%20%20%09%3Chttp%3A%2F%2Fopendatacommunities.org%2Fdef%2Fontology%2Fgeography%2FrefArea%3E%20%3Farea%20%3B%0A%20%20%20%20%3Chttp%3A%2F%2Fopendatacommunities.org%2Fdef%2Fontology%2Fhousing-market%2Fland-registry%2Fhpi%2FaveragePriceObs%3E%20%3Fhouseprice%20.%20%20%0A%7D%0A%20%20GRAPH%20%3Chttp%3A%2F%2Fopendatacommunities.org%2Fgraph%2Fons-geography-administration%3E%0A%20%20%09%7B%3Farea%20rdfs%3Alabel%20%3Fareaname%20%3B%0A%20%20%20%20%20%09%09%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23notation%3E%20%3Fareacode%20%3B%0A%20%20%09%20%09%09%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23type%3E%20%3Fareatype%20.%0A%20%20%7D%0A%20%20%20GRAPH%20%3Chttp%3A%2F%2Fopendatacommunities.org%2Fgraph%2Fvocab%2Fontology%2Fnewadmingeo%3E%20%0A%20%20%7B%3Fareatype%20rdfs%3Alabel%20%3Fareatypename%20.%0A%20%20%7D%0A%20%20GRAPH%20%3Chttp%3A%2F%2Fopendatacommunities.org%2Fgraph%2Fdate-intervals%3E%20%0A%20%20%7B%0A%20%20%20%20%3Fmonthyear%20rdfs%3Alabel%20%3Fmonthyearlabel%20%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Ftime%23hasBeginning%3E%20%3Fmonthyeardateformat%20.%0A%20%20%20%20%3Fmonthyeardateformat%20rdfs%3Alabel%20%3Fmonthyearformatlabel%20.%0A%20%20%20%20%0A%20%20%7D%0A%20%20%0A%7D", function(resp) {
            var data = resp.results.bindings,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = data.length; i < len; i++) {
                tableData.push({
                    "houseprice": data[i].houseprice.value,
                    "areaname": data[i].areaname.value,
                    "areacode": data[i].areacode.value,
                    "areatypename": data[i].areatypename.value,
                    "monthyearlabel": data[i].monthyearlabel.value,
                    "monthyearformatlabel": data[i].monthyearformatlabel.value
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "ODC House Price Data"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();

sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/Filter',
    'sap/ui/model/json/JSONModel',
    'plantvim/utils/ResConfigManager',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/routing/History',
    'plantvim/utils/ModelManager',
    'sap/ui/core/mvc/Controller'
], function (jQuery, Filter, JSONModel, ResConfigManager, MessageBox, MessageToast, History, ModelManager, Controller) {
    "use strict";

    var MainController = Controller.extend("plantvim.controller.Main", {
        resConfigManager: new ResConfigManager(),
        onInit: function () {

            var model = ModelManager.getModel(ModelManager.NAMES.info);
            this.info = model;
            this.getView().setModel(model, "info");

        },
        onAfterRendering: function () {

            //this.getLocations();

        },
        getLocations: function () {

            var site = window.site;

            var that = this;

            if (jQuery.sap.getUriParameters().get("localMode") === "true") {
                jQuery.ajax({
                    dataType: "xml",
                    url: "model/getLocationList.xml",
                    success: function (data, response) {
                        that.getLocationsSuccess(data, response);
                    },
                    async: true
                });
                return;
            }

            var transactionName = "GetLocations";

            var transactionCall = site + "/" + "TRANSACTION" + "/" + transactionName;

            var userId = this.model.getProperty("/user/id");

            var params = {
                "TRANSACTION": transactionCall,
                "site": site,
                "user_id": userId,
                "OutputParameter": "JSON"
            };

            try {
                var req = jQuery.ajax({
                    url: "/XMII/Runner",
                    data: params,
                    method: "POST",
                    dataType: "xml",
                    async: true
                });
                req.done(jQuery.proxy(that.getLocationsSuccess, that));
                req.fail(jQuery.proxy(that.getLocationsError, that));
            } catch (err) {
                jQuery.sap.log.debug(err.stack);
            }
        },
        getLocationsSuccess: function (data, response) {
            sap.ui.core.BusyIndicator.hide();

            var jsonObjStr = jQuery(data).find("Row").text();
            var jsonObj = JSON.parse(jsonObjStr);

            this.adjustLocations(jsonObj);

            this.originLocList = JSON.parse(JSON.stringify(jsonObj));
            this.locations.setProperty("/", jsonObj);

        },
        getLocationsError: function (error) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error(error);
        },
        adjustLocations: function (objects) {


        },
        guid: function () {
            var s4 = this.s4;
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
        },
        s4: function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
        },
        plantS: function() {
            this.getOwnerComponent().getRouter().navTo("ListaMacchine", true);
        },
        plantSA1: function() {
            this.getOwnerComponent().getRouter().navTo("plantSA1", true);
        },
        gantt: function() {
            this.getOwnerComponent().getRouter().navTo("gantt", true);
        },
        navToMain: function () {
            window.location.href = "../main/index.html";
        }

    });

    return MainController;

});

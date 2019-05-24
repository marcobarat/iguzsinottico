sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/StandardTile",
    'jquery.sap.global'
], function (Control, Tile, jQuery) {
    "use strict";
    return Tile.extend("plantvim.component.CustomStandardTile", {

        metadata: {
            //eventi 
            events: {
                //evento di pressione tasto
                press: {
                    enablePreventDefault: true
                }
            },
            properties: {
                status: {type: "string"}
            }
        },
        renderer: {},

        onAfterRendering: function () {
            if (sap.m.StandardTile.prototype.onAfterRendering) {
                sap.m.StandardTile.prototype.onAfterRendering.apply(this, arguments); //run the super class's method first
            }
            var status = this.getStatus();
            var classes = ["okStatus", "warningStatus", "errorStatus", "noStatus"];
            for (var i = 0;i < classes.length; i++) {
                this.removeStyleClass(classes[i]);
            }
            switch (status) {
                case "0":
                    this.addStyleClass("okStatus");
                    break;
                case "1":
                    this.addStyleClass("warningStatus");
                    break;
                case "2":
                    this.addStyleClass("errorStatus");
                    break;
            }
        }
    });
});
sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/Control'
], function (jQuery, Control) {
    "use strict";

    var ProgressBarComponent = Control.extend("plantvim.component.ProgressBar", {
        metadata: {
            properties: {
                "height": {
                    type: "sap.ui.core.CSSSize", defaultValue: "20px"
                },
                "width": {
                    type: "sap.ui.core.CSSSize", defaultValue: "100px"
                },
                "value": {
                    type: "string", defaultValue: "0"
                },
                "barColor": {
                    type: "string", defaultValue: "lightblue"
                }
            }
        },
        renderer: function (oRm, oControl) {

            var pvalue = "";
            if (oControl.getValue()) {
                try {
                    var vnum = Number(oControl.getValue());
                    pvalue = Math.round(vnum * 10) / 10;
                    pvalue = pvalue + "";
                } catch (err) {
                    jQuery.sap.log.error(err);
                }
            }

            var num, margin = "0px", width = oControl.getWidth();
            if (width.indexOf("px") !== -1) {
                width = width.replace("px", "");
                try {
                    num = Number(width);
                    if (pvalue.length >= 3) {
                        margin = num * 0.10 + "px";
                    } else {
                        margin = num * 0.35 + "px";
                    }
                } catch (err) {
                    jQuery.sap.log.error(err);
                }
            }

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addStyle("width", oControl.getWidth());
            oRm.addStyle("height", oControl.getHeight());
            oRm.writeStyles();
            oRm.addClass("customProgressBar");
            oRm.writeClasses();
            oRm.write("<div>");

            oRm.write("<div");
            oRm.addStyle("width", pvalue + "%");
            oRm.addStyle("height", oControl.getHeight());
            oRm.addStyle("background-color", oControl.getBarColor());
            oRm.writeStyles();
            oRm.write(">");
            oRm.write("<span");
            oRm.addStyle("margin-left", margin);
            oRm.writeStyles();
            oRm.write(">");
            oRm.write(pvalue + "%");
            oRm.write("</span>");
            oRm.write("</div>");

        },
        onAfterRendering: function () {

        }
    });

    return ProgressBarComponent;
});

sap.ui.define([
    'jquery.sap.global',
    'sap/m/Button',
    'sap/ui/core/Control'
], function (jQuery, Button, Control) {
    "use strict";

    var IlaPress = Control.extend("plantvim.component.IlaPress", {
        metadata: {
            properties: {
                "width": {
                    type: "sap.ui.core.CSSSize", defaultValue: "30px"
                },
                "height": {
                    type: "sap.ui.core.CSSSize", defaultValue: "60px"
                },
                "imageUrl": {
                    type: "string", defaultValue: "images/Pressa_none_3d.png"
                },
                "imageSize": {
                    type: "sap.ui.core.CSSSize", defaultValue: "80px"
                },
                "gaugeStyle": {
                    type: "string", defaultValue: "width:80px; height:60px; margin:auto;"
                },
                "mnumber": {
                    type: "string", defaultValue: "Non trovato"
                },
                "fontSize": {
                    type: "sap.ui.core.CSSSize", defaultValue: null
                },
                "backgroundColor": {
                    type: "string", defaultValue: "#DEDEDE"
                },
                "color": {
                    type: "string", defaultValue: "black"
                },
                "fontWeight": {
                    type: "string", defaultValue: "normal"
                },
                "visible": {
                    type: "boolean", defaultValue: true
                },
                "marginLeft": {
                    type: "sap.ui.core.CSSSize", defaultValue: null
                },
                "gaugeVisible": {
                    type: "boolean", defaultValue: false
                },
                "hasTool": {
                    type: "boolean", defaultValue: false
                },
                "value": {
                    type: "string", defaultValue: 0
                },
                "qtyprd": {
                    type: "string", defaultValue: 0
                },
                "qtyproduced": {
                    type: "string", defaultValue: 0
                }
                
            },
            events: {
                press: {enablePreventDefault: true}
            }
        },
        renderer: function (oRm, oControl) {

            var visible = oControl.getVisible();
            oRm.write("<div");
            oRm.writeControlData(oControl);
            if (visible === false) {
                oRm.addStyle("pointer-events", "none");
                oRm.addStyle("visibility", "hidden");
            }
            oRm.addStyle("text-align", "center");

            if (oControl.getMarginLeft() && null !== oControl.getMarginLeft()) {
                oRm.addStyle("margin-left", oControl.getMarginLeft());
            }

            oRm.writeStyles();
            oRm.writeClasses();
            oRm.write(">");


            if (oControl.getHasTool() === true) {
                oControl.setGaugeVisible(false);
                oRm.write("<div");
                oRm.writeAttribute("style", oControl.getGaugeStyle());
                oRm.write(">");
                oRm.write("<img");
                oRm.writeAttribute("src", "images/chiave.png");
                oRm.writeAttribute("alt", "tool");
                oRm.writeAttribute("style", "with:20px;height:20px;margin-top: 25px;");
                oRm.addClass("ilaPressTool");
                oRm.writeClasses();
                oRm.write("/>");
                oRm.write("</div>");
            }

            if (oControl.getGaugeVisible() === true &&
                    oControl.getGaugeStyle() && null !== oControl.getGaugeStyle()) {
                oRm.write("<div");
                oRm.writeAttribute("id", "gauge" + oControl.getId());
                oRm.writeAttribute("style", oControl.getGaugeStyle());
                oRm.write("/>");
            } else if (oControl.getHasTool() === false) {
                oRm.write("<div");
                oRm.writeAttribute("style", oControl.getGaugeStyle());
                oRm.write("/>");
            }

            if (oControl.getImageUrl() && null !== oControl.getImageUrl()) {

                var imageWidth = 60;
                var imageHeight = imageWidth / 2;
                if (oControl.getImageSize() && null !== oControl.getImageSize()) {
                    try {
                        var dim = oControl.getImageSize().replace("px", "");
                        imageWidth = Number(dim);
                        imageHeight = imageWidth / 2;
                    } catch (err) {
                        jQuery.sap.log.debug(err);
                    }
                }

                oRm.write("<img");
                oRm.writeAttribute("id", oControl.getId() + "img1");
                oRm.writeAttribute("src", oControl.getImageUrl());
                oRm.writeAttribute("alt", "press image");
                oRm.writeAttribute("height", imageHeight + "px");
                oRm.writeAttribute("width", imageWidth + "px");
                oRm.write("/>");
            }

            if (oControl.getMnumber() && null !== oControl.getMnumber()) {
                oRm.write("<div");
                if (oControl.getFontWeight() && oControl.getFontWeight() !== null) {
                    oRm.addStyle("font-weight", oControl.getFontWeight());
                }
                if (oControl.getFontSize() && oControl.getFontSize() !== null) {
                    oRm.addStyle("font-size", oControl.getFontSize());
                }
                oRm.addStyle("overflow", "hidden");
                oRm.addStyle("white-space", "nowrap");

                oRm.writeStyles();
                oRm.write(">Machine: ");
                oRm.write(oControl.getMnumber());
                oRm.write("</div>");
            }

            if (oControl.getQtyprd() && null !== oControl.getQtyprd()) {
                oRm.write("<div");
                if (oControl.getFontWeight() && oControl.getFontWeight() !== null) {
                    oRm.addStyle("font-weight", oControl.getFontWeight());
                }
                if (oControl.getFontSize() && oControl.getFontSize() !== null) {
                    oRm.addStyle("font-size", oControl.getFontSize());
                }
                oRm.addStyle("overflow", "hidden");
                oRm.addStyle("white-space", "nowrap");
                oRm.addStyle("font-weight", "bold");

                oRm.writeStyles();
                oRm.write("> Qty to build: ");
                oRm.write(oControl.getQtyprd());
                oRm.write("</div>");

            }
            if (oControl.getQtyproduced() && null !== oControl.getQtyproduced()) {
                oRm.write("<div");
                if (oControl.getFontWeight() && oControl.getFontWeight() !== null) {
                    oRm.addStyle("font-weight", oControl.getFontWeight());
                }
                if (oControl.getFontSize() && oControl.getFontSize() !== null) {
                    oRm.addStyle("font-size", oControl.getFontSize());
                }
                oRm.addStyle("overflow", "hidden");
                oRm.addStyle("white-space", "nowrap");
                oRm.addStyle("font-weight", "bold");

                oRm.writeStyles();
                oRm.write(">Qty produced till now: ");
                oRm.write(oControl.getQtyproduced());
                oRm.write("</div>");

            }      
            

            oRm.write("</div>");
        },
        onAfterRendering: function () {

            var that = this;

            jQuery.sap.byId(this.getId() + "img1").click(function (evt) {
                that.firePress({resource: that.getMnumber(), img: that.getImageUrl(), type: "molding"});
            });

            if (this.getGaugeVisible() === true) {

                var val = 0;
                var qtytb = 0;
                try {
                    val = Number(this.getValue());
                } catch (err) {
                    jQuery.sap.log.error(err);
                }
                try {
                    qtytb = Number(this.getQtyprd());
                } catch (err) {
                    jQuery.sap.log.error(err);
                }
                var g = new JustGage({
                    id: "gauge" + this.getId(),
                    value: val,
                    qtyprd: qtytb,
                    min: 0,
                    max: 100,
                    levelColors: ["#af0000", "#ffe100", "#008000"],
                    hideMinMax: true
                });
            }

        }
    });

    return IlaPress;
});

sap.ui.define([
    'jquery.sap.global',
    'sap/m/Button',
    'sap/ui/core/Control'
], function (jQuery, Button, Control) {
    "use strict";

    var IlaPressMix3 = Control.extend("plantvim.component.IlaPressMix3", {
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
                "imageUrl2": {
                    type: "string", defaultValue: "images/Pressa_none_3d.png"
                },
                "imageUrl3": {
                    type: "string", defaultValue: "images/Pressa_none_3d.png"
                },
                "imageSize": {
                    type: "sap.ui.core.CSSSize", defaultValue: "80px"
                },
                "gaugeStyle": {
                    type: "string", defaultValue: "width:240px; height:120px"
                },
                "mnumber": {
                    type: "string", defaultValue: "non trovato"
                },
                "mnumber2": {
                    type: "string", defaultValue: "non trovato"
                },
                "mnumber3": {
                    type: "string", defaultValue: "non trovato"
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
                    type: "boolean", defaultValue: true
                },
                "hasTool": {
                    type: "boolean", defaultValue: false
                },
                "value": {
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

            if (null !== oControl.getImageUrl2() && null !== oControl.getImageUrl()) {

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
                
                oRm.write("<div style=\"display: table\" >");
                oRm.write("<div style=\"display: table-row\" >");
                
                oRm.write("<div style=\"display: table-cell\" >");
                oRm.write("<img");
                oRm.writeAttribute("id", oControl.getId() + "img1");
                oRm.writeAttribute("src", oControl.getImageUrl());
                oRm.writeAttribute("alt", "press image");
                oRm.writeAttribute("height", imageHeight + "px");
                oRm.writeAttribute("width", imageWidth + "px");
                oRm.write("/>");
                if (oControl.getMnumber() && null !== oControl.getMnumber()) {
                    oRm.write("<div");
                    if (oControl.getFontWeight() && oControl.getFontWeight() !== null) {
                        oRm.addStyle("font-weight", oControl.getFontWeight());
                    }
                    if (oControl.getFontSize() && oControl.getFontSize() !== null) {
                        oRm.addStyle("font-size", oControl.getFontSize());
                    }
                    oRm.writeStyles();
                    oRm.write(">");
                    oRm.write(oControl.getMnumber());
                    oRm.write("</div>");
                }
                oRm.write("</div>"); //table-cell
                
                oRm.write("<div style=\"display: table-cell\" >");
                oRm.write("<img");
                oRm.writeAttribute("id", oControl.getId() + "img2");
                oRm.writeAttribute("src", oControl.getImageUrl2());
                oRm.writeAttribute("alt", "press image");
                oRm.writeAttribute("height", imageHeight + "px");
                oRm.writeAttribute("width", imageWidth + "px");
                oRm.write("/>");
                if (oControl.getMnumber2() && null !== oControl.getMnumber2()) {
                    oRm.write("<div");
                    if (oControl.getFontWeight() && oControl.getFontWeight() !== null) {
                        oRm.addStyle("font-weight", oControl.getFontWeight());
                    }
                    if (oControl.getFontSize() && oControl.getFontSize() !== null) {
                        oRm.addStyle("font-size", oControl.getFontSize());
                    }
                    oRm.writeStyles();
                    oRm.write(">");
                    oRm.write(oControl.getMnumber2());
                    oRm.write("</div>");
                }
                oRm.write("</div>"); //table-cell
                
                oRm.write("<div style=\"display: table-cell\" >");
                oRm.write("<img");
                oRm.writeAttribute("id", oControl.getId() + "img3");
                oRm.writeAttribute("src", oControl.getImageUrl3());
                oRm.writeAttribute("alt", "press image");
                oRm.writeAttribute("height", imageHeight + "px");
                oRm.writeAttribute("width", imageWidth + "px");
                oRm.write("/>");
                if (oControl.getMnumber2() && null !== oControl.getMnumber3()) {
                    oRm.write("<div");
                    if (oControl.getFontWeight() && oControl.getFontWeight() !== null) {
                        oRm.addStyle("font-weight", oControl.getFontWeight());
                    }
                    if (oControl.getFontSize() && oControl.getFontSize() !== null) {
                        oRm.addStyle("font-size", oControl.getFontSize());
                    }
                    oRm.writeStyles();
                    oRm.write(">");
                    oRm.write(oControl.getMnumber3());
                    oRm.write("</div>");
                }
                oRm.write("</div>"); //table-cell
                
                oRm.write("</div>"); //table-row
               oRm.write("</div>"); //table
            }

            oRm.write("</div>");
        },
        onAfterRendering: function () {
            
            var that = this;
            
            jQuery.sap.byId(this.getId() + "img1").click(function(evt) {
                that.firePress({resource: that.getMnumber(), img: that.getImageUrl(), type: "molding"});
            });
            
            jQuery.sap.byId(this.getId() + "img2").click(function(evt) {
                that.firePress({resource: that.getMnumber2(), img: that.getImageUrl2(), type: "molding"});
            });
            
            jQuery.sap.byId(this.getId() + "img3").click(function(evt) {
                that.firePress({resource: that.getMnumber3(), img: that.getImageUrl3(), type: "assembly"});
            });

            if (this.getGaugeVisible() === true) {

                var val = 0;
                try {
                    val = Number(this.getValue());
                } catch (err) {
                    jQuery.sap.log.error(err);
                }

                var g = new JustGage({
                    id: "gauge" + this.getId(),
                    value: val,
                    gaugeWidthScale: 0.5,
                    min: 0,
                    max: 113,
                    levelColors: ["#af0000", "#ffe100", "#008000"],
                    hideMinMax: true
                });
            }

        }
    });

    return IlaPressMix3;
});

sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/model/json/JSONModel',
    'plantvim/controller/GenericDialog'
], function (jQuery, MessageToast, MessageBox, JSONModel, GenericDialog) {
    "use strict";

    var DetailDialog = GenericDialog.extend("plantvim.controller.DetailDialog", {
        model: new JSONModel({detail: null, bom: [], facilities: []}),
        shopOrder: null,
        par: {},
        open: function (oView, arg) {

            var avoidCall = false;
            if ("images/Pressa_rossa_m_3d.png" === arg.img) {
                avoidCall = true;
                return;
            }
            if (arg.res === undefined || null === arg.res || "non trovato" === arg.res || "assembly" === arg.type) {
                avoidCall = true;
                return;
            }

            this.par.resource = null;
            this.shopOrder = null;

            this.model.setProperty("/detail", {});
            this.model.setProperty("/bom", []);
            this.model.setProperty("/facilities", []);

            this.par.resource = arg.res;
            this.par.img = arg.img;

            this._initDialog("plantvim.view.DetailDialog", oView, this.model);

            this.openDialog();

            var width = jQuery(".myDialog").width() - 20;

            jQuery("[id$='detailForm']").width(width);
            jQuery("[id$='detailForm2']").width(width);

            setTimeout(function () {
                jQuery("[id$='detailDialog-cont']").scrollTop(0);
            }, 500);

            if (avoidCall === false) {
                this.getDetailResource(this.par.resource);
         //       this.getDetailFacility(this.par.resource);
            }

        },
        onClose: function () {

            this.closeDialog();

        },
        showErrorMessageBox: function (msg) {
            MessageBox.error(msg);
        },
        getDetailResource: function (resource) {

            var site = window.site;

            var that = this;

            if (jQuery.sap.getUriParameters().get("localMode") === "true") {
                jQuery.ajax({
                    dataType: "xml",
                    url: "model/getDetail.xml",
                    success: function (data, response) {
                        that.getDetailResourceSuccess(data, response);
                    },
                    async: true
                });
                return;
            }

            var transactionName = "GET_DETAILS_BY_RESOURCE";

            var transactionCall = site + "/" + "TRANSACTION" + "/" + transactionName;

            var params = {
                "TRANSACTION": transactionCall,
                "SITE": site,
                "RESOURCE": resource,
                "DEPARTMENT": "SA1",
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
                req.done(jQuery.proxy(that.getDetailResourceSuccess, that));
                req.fail(jQuery.proxy(that.getDetailResourceError, that));
            } catch (err) {
                jQuery.sap.log.debug(err.stack);
            }
        },
        getDetailResourceSuccess: function (data, response) {
            sap.ui.core.BusyIndicator.hide();

            var jsonObjStr = jQuery(data).find("Row").text();
            var jsonObj = JSON.parse(jsonObjStr);

            var obj = jsonObj[0];
            if (obj) {
                this.shopOrder = obj.SHOP_ORDER;
                obj.cdlName = obj.CDL;

                try {
                    obj.TIME_TO_END = this.secondsToHms(obj.TIME_TO_END);
                } catch (err) {
                    jQuery.sap.log.error(err);
                }

                try {
                    obj.TIME_TOTAL_STOP = this.secondsToHms(obj.TIME_TOTAL_STOP);
                } catch (err) {
                    jQuery.sap.log.error(err);
                }

                try {
                    obj.QTY_TO_BUILD = obj.QTY_TO_BUILD.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    obj.QTY_DONE = obj.QTY_DONE.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    obj.QTY_PRODUCE = obj.QTY_PRODUCE.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                } catch (err) {
                    jQuery.sap.log.error(err);
                }

                if ("PRODUCTIVE" === obj.MES_STATUS) {
                    obj.MES_STATUS = "PRODUTTIVO";
                }
                if ("ENABLED" === obj.MES_STATUS) {
                    obj.MES_STATUS = "ABILITATO";
                }
                if ("UNKNOWN" === obj.MES_STATUS) {
                    obj.MES_STATUS = "SCONOSCIUTO";
                }

                obj.resName = this.par.resource;
                obj.img = this.par.img;

                this.model.setProperty("/detail", obj);
                this.getDetailFacility(this.shopOrder);	
                this.getDetailBOM(this.shopOrder);
            }

        },
        getDetailResourceError: function (error) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error(error);
        },
        getDetailBOM: function (shopOrder) {

            var site = window.site;

            var that = this;

            if (jQuery.sap.getUriParameters().get("localMode") === "true") {
                jQuery.ajax({
                    dataType: "xml",
                    url: "model/getBOM.xml",
                    success: function (data, response) {
                        that.getDetailBOMSuccess(data, response);
                    },
                    async: true
                });
                return;
            }

            var transactionName = "GET_BOM_BY_SO";

            var transactionCall = site + "/" + "TRANSACTION" + "/" + transactionName;

            var params = {
                "TRANSACTION": transactionCall,
                "SITE": site,
                "DEPARTMENT": "SA1",
                "SHOP_ORDER": shopOrder,
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
                req.done(jQuery.proxy(that.getDetailBOMSuccess, that));
                req.fail(jQuery.proxy(that.getDetailBOMError, that));
            } catch (err) {
                jQuery.sap.log.debug(err.stack);
            }
        },
        getDetailBOMSuccess: function (data, response) {
            sap.ui.core.BusyIndicator.hide();

            var jsonObjStr = jQuery(data).find("Row").text();
            var jsonObj = eval(jsonObjStr); // jshint ignore:line

            this.model.setProperty("/bom", jsonObj);

        },
        getDetailBOMError: function (error) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error(error);
        },
     //   getDetailFacility: function (resource) {
        getDetailFacility: function (shopOrder) {

            var site = window.site;

            var that = this;

            if (jQuery.sap.getUriParameters().get("localMode") === "true") {
                jQuery.ajax({
                    dataType: "xml",
                    url: "model/getFacility.xml",
                    success: function (data, response) {
                        that.getDetailFacilitySuccess(data, response);
                    },
                    async: true
                });
                return;
            }

          //  var transactionName = "GET_TOOL_BY_RESOURCE";
	
	var transactionName = "GET_TOOL_BY_ORDER";

            var transactionCall = site + "/" + "TRANSACTION" + "/" + transactionName;

            var params = {
                "TRANSACTION": transactionCall,
                "SITE": site,
          //      "RESOURCE": resource,
                 "DEPARTMENT": "SA1",
                "SHOP_ORDER": shopOrder,	
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
                req.done(jQuery.proxy(that.getDetailFacilitySuccess, that));
                req.fail(jQuery.proxy(that.getDetailFacilityError, that));
            } catch (err) {
                jQuery.sap.log.debug(err.stack);
            }
        },
        getDetailFacilitySuccess: function (data, response) {
            sap.ui.core.BusyIndicator.hide();

            var jsonObjStr = jQuery(data).find("Row").text();
            var jsonObj = JSON.parse(jsonObjStr);

            this.model.setProperty("/facilities", jsonObj);


        },
        getDetailFacilityError: function (error) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error(error);
        },
        secondsToHms: function (d) {
            d = Number(d);

            if (isNaN(d) === true) {
                return "00:00:00";
            }
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);

            var time = "";
            if (h === 0) {
                time = time + "00";
            } else if (h < 10) {
                time = time + "0" + h;
            } else {
                time = time + h;
            }
            time = time + ":";
            if (m === 0) {
                time = time + "00";
            } else if (m < 10) {
                time = time + "0" + m;
            } else {
                time = time + m;
            }
            time = time + ":";
            if (s === 0) {
                time = time + "00";
            } else if (s < 10) {
                time = time + "0" + s;
            } else {
                time = time + s;
            }

            return time;
        }
    });

    return DetailDialog;

});

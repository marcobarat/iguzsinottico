sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/model/json/JSONModel',
    'plantvim/controller/GenericDialog'
], function (jQuery, MessageToast, MessageBox, JSONModel, GenericDialog) {
    "use strict";

    var DetailDialog = GenericDialog.extend("plantvim.controller.DetailDialog", {
        model: new JSONModel({detail: null, bom: [], facilities: [], mat: []}),
        shopOrder: null,
        machineselected: null,
        workcenterid: null,
        type: null,
        par: {},
        open: function (oView, arg) {
            this.machineselected = sap.ui.getCore().getModel().getData().machineselected.machine;
            this.workcenterid = sap.ui.getCore().getModel().getData().machineselected.workcenterid;
            this.type = sap.ui.getCore().getModel().getData().machineselected.type;
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
            this.model.setProperty("/mat", []);
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
            var oModel = new JSONModel();
            var transactionName;
            var transactionCall;
            var that = this;
            var site = "iGuzzini";
            if (this.type === 'E') {
                transactionName = "XAC_GetEngelMachineStatus";
                transactionCall = site + "/XACQuery" + "/Engel/" + transactionName;

            } else {
                transactionName = "XAC_GetSiliconatriceMachineStatus";
                transactionCall = site + "/XACQuery" + "/siliconatrice/" + transactionName;

            }

            var input = "&workcenterid=" + this.workcenterid;// + this.workcenterid;
            jQuery.ajax({
                url: "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json",
                method: "GET",
                async: false,
                success: function (oData) {
                    if (that.type === 'E') {
                        oModel.setProperty("/", {
                            "para": JSON.parse(oData.Rowsets.Rowset[0].Row[0].Parameters_json),
                            "workcenter": oData.Rowsets.Rowset[0].Row[0].Workcenter,
                            "status": oData.Rowsets.Rowset[0].Row[0].SDescription
                        });
                    }
                    that.getDetailResourceSuccess(oData);
                },
                error: function (oData) {
                    that.error(oData);
                }
            });
        },
        getDetailResourceSuccess: function (data) {
            sap.ui.core.BusyIndicator.hide();

            var jsonObjStr;
            var jsonObj;

            if (this.type === 'E') {
                jsonObjStr = JSON.parse(data.Rowsets.Rowset[0].Row[0].Parameters_json);
                jsonObj = jsonObjStr.parameters;
            } else {
                jsonObjStr = (data.Rowsets.Rowset[0].Row);
                jsonObj = jsonObjStr;
            }
            var obj = jsonObj;

            if (obj) {
                if (this.type === 'E') {
                    this.shopOrder = obj[23].VAL;
                    obj.cdlName = obj[23].VAL;
                    try {
                        //obj.TIME_TO_END = this.secondsToHms(obj[16].VAL);
                        obj.TIME_TO_END = (obj[16].VAL);
                    } catch (err) {
                        jQuery.sap.log.error(err);
                    }

                    try {
                        //obj.TIME_TOTAL_STOP = this.secondsToHms(obj[25].VAL);
                        obj.TIME_TOTAL_STOP = (obj[22].VAL);
                    } catch (err) {
                        jQuery.sap.log.error(err);
                    }

                    try {
                        //obj.TIME_TOTAL_STOP = this.secondsToHms(obj[25].VAL);
                        obj.TIME_CYCLE = (obj[30].VAL);
                    } catch (err) {
                        jQuery.sap.log.error(err);
                    }

                    try {
                        //obj.TIME_TOTAL_STOP = this.secondsToHms(obj[25].VAL);
                        obj.TIME_LAST_CYCLE = (obj[12].VAL);
                    } catch (err) {
                        jQuery.sap.log.error(err);
                    }


                    try {
                        obj.QTY_TO_BUILD = sap.ui.getCore().getModel().getData().machineselected.qtytobuild;
                        obj.QTY_DONE = obj[8].VAL;
                        obj.QTY_PRODUCE = 0;
                        obj.QTY_REJECTED = obj[9].VAL;
                        //obj.QTY_PRODUCE = obj[8].VAL.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    } catch (err) {
                        jQuery.sap.log.error(err);
                    }

                } else {
                    this.shopOrder = obj[0].num_commessa;
                    obj.cdlName = obj[0].num_commessa;

                    try {
                        //obj.TIME_TO_END = this.secondsToHms(obj[16].VAL);
                        obj.TIME_TO_END = (obj[16].VAL);
                    } catch (err) {
                        jQuery.sap.log.error(err);
                    }

                    try {
                        //obj.TIME_TOTAL_STOP = this.secondsToHms(obj[25].VAL);
                        obj.TIME_TOTAL_STOP = (obj[22].VAL);
                    } catch (err) {
                        jQuery.sap.log.error(err);
                    }

                    try {
                        //obj.TIME_TOTAL_STOP = this.secondsToHms(obj[25].VAL);
                        obj.TIME_CYCLE = (obj[30].VAL);
                    } catch (err) {
                        jQuery.sap.log.error(err);
                    }

                    try {
                        //obj.TIME_TOTAL_STOP = this.secondsToHms(obj[25].VAL);
                        obj.TIME_LAST_CYCLE = (obj[12].VAL);
                    } catch (err) {
                        jQuery.sap.log.error(err);
                    }


                    try {
                        //obj.QTY_TO_BUILD = obj.QTY_TO_BUILD.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        obj.QTY_DONE = obj[8].VAL;
                        obj.QTY_PRODUCE = 0;
                        obj.QTY_REJECTED = obj[9].VAL;
                        //obj.QTY_PRODUCE = obj[8].VAL.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    } catch (err) {
                        jQuery.sap.log.error(err);
                    }
                }



                if ("Warning" === sap.ui.getCore().getModel().getData().machine[this.machineselected].STATUS_MES) {
                    obj.MES_STATUS = "Productive";
                }
                if ("Success" === sap.ui.getCore().getModel().getData().machine[this.machineselected].STATUS_MES) {
                    obj.MES_STATUS = "Ready";
                }
                if ("Error" === sap.ui.getCore().getModel().getData().machine[this.machineselected].STATUS_MES) {
                    obj.MES_STATUS = "Error";
                }

                obj.resName = this.par.resource;
                obj.img = this.par.img;
                var oModel = new JSONModel();

                this.model.setProperty("/detail", obj);
                this.getDetailFacility(this.shopOrder);
                this.getDetailBOM(this.shopOrder);
                this.getDetailMAT(this.shopOrder);
            }



        },
        getDetailResourceError: function (error) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error(error);
        },
        getDetailBOM: function (shopOrder) {

            var oModel = new JSONModel();
            var transactionName = "XAC_GetCurrentBOMComponentForEngel";
            var that = this;
            var site = "iGuzzini";
            var input = "&workcenterid=" + this.workcenterid + "&plantid=1";// + this.workcenterid;
            var transactionCall = site + "/XACQuery" + "/Engel/" + transactionName;

            jQuery.ajax({
                url: "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json",
                method: "GET",
                async: false,
                success: function (oData) {
                    that.getDetailBOMSuccess(oData.Rowsets.Rowset[0].Row);
                },
                error: function (oData) {
                    that.error(oData);
                }
            });

        },
        getDetailBOMSuccess: function (data, response) {
            sap.ui.core.BusyIndicator.hide();

            //var jsonObjStr = jQuery(data).find("Row").text();
            //var jsonObj = eval(jsonObjStr); // jshint ignore:line

            this.model.setProperty("/bom", data);

        },

        getDetailMAT: function (shopOrder) {

            var oModel = new JSONModel();
            var transactionName = "XAC_GetCurrentShoporderMaterialFromEngel";
            var that = this;
            var site = "iGuzzini";
            var input = "&workcenterid=" + this.workcenterid + "&plantid=1";// + this.workcenterid;
            var transactionCall = site + "/XACQuery" + "/Engel/" + transactionName;

            jQuery.ajax({
                url: "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json",
                method: "GET",
                async: false,
                success: function (oData) {
                    that.getDetailMATSuccess(oData.Rowsets.Rowset[0].Row);
                },
                error: function (oData) {
                    that.error(oData);
                }
            });

        },
        getDetailMATSuccess: function (data, response) {
            sap.ui.core.BusyIndicator.hide();

            //var jsonObjStr = jQuery(data).find("Row").text();
            //var jsonObj = eval(jsonObjStr); // jshint ignore:line

            this.model.setProperty("/mat", data);

        },

        getDetailBOMError: function (error) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error(error);
        },
        //   getDetailFacility: function (resource) {
        getDetailFacility: function (shopOrder) {

            var oModel = new JSONModel();
            var transactionName = "XAC_GetCurrentStampoForEngel";
            var that = this;
            var site = "iGuzzini";
            var input = "&workcenterid=" + this.workcenterid + "&plantid=1";// + this.workcenterid;
            var transactionCall = site + "/XACQuery" + "/Engel/" + transactionName;

            jQuery.ajax({
                url: "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json",
                method: "GET",
                async: false,
                success: function (oData) {
                    that.getDetailFacilitySuccess(oData.Rowsets.Rowset[0].Row);
                },
                error: function (oData) {
                    that.error(oData);
                }
            });

        },
        getDetailFacilitySuccess: function (data, response) {
            sap.ui.core.BusyIndicator.hide();


            this.model.setProperty("/facilities", data);


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

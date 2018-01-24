sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/Filter',
    'sap/ui/model/json/JSONModel',
    'plantvim/utils/ResConfigManager',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/routing/History',
    'plantvim/utils/ModelManager',
    'plantvim/controller/DetailDialog',
    'sap/ui/core/mvc/Controller'
], function (jQuery, Filter, JSONModel, ResConfigManager, MessageBox, MessageToast, History, ModelManager, DetailDialog, Controller) {
    "use strict";

    var PlantSController = Controller.extend("plantvim.controller.PlantS", {
        resConfigManager: new ResConfigManager(),
        timer: null,
        callTimer: null,
        detailDialog: new DetailDialog(),
        info: null,
        machines: null,
        onInit: function () {

            var model = new JSONModel({"user": {"name": "", "id": "", "handle": ""}});
            this.info = model;
            this.getView().setModel(model, "info");

            model = new JSONModel({});
            this.machines = model;
            this.getView().setModel(model, "machines");


            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("plantS").attachPatternMatched(this._onObjectMatched, this);


            oRouter.getRoute("main").attachPatternMatched(this.exit, this);

        },

        exit: function () {

            if (null !== this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            if (null !== this.callTimer) {
                clearInterval(this.callTimer);
                this.callTimer = null;
            }

        },
        _onObjectMatched: function (event) {

            if (null !== this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }

            setTimeout(this.startOminoAnim, 2000);
            this.timer = setInterval(this.startOminoAnim, 30000);

            if (null !== this.callTimer) {
                clearInterval(this.callTimer);
                this.callTimer = null;
            }

            this.getResources();
            this.callTimer = setInterval(jQuery.proxy(this.getResources, this), 5000);

        },
        startOminoAnim: function () {


            jQuery(".ilaPressTool")
                    .delay(500)
                    .velocity({rotateX: 360}, 1000)
                    .velocity({rotateX: 0}, 500);

        },
        getResources: function () {


            /*if (jQuery.sap.getUriParameters().get("localMode") === "true") {
                jQuery.ajax({
                    dataType: "xml",
                    url: "model/getResources.xml",
                    success: function (data, response) {
                        that.getResourcesSuccess(data, response);
                    },
                    async: true
                });
                return;
            }*/





            var transactionName = "XAC_GetSinotticoBasicInfo";
            var that = this;
            var site = "iGuzzini";
            var input = "&plantid=1";
            var transactionCall = site + "/XACQuery" + "/" + transactionName;


            jQuery.ajax({
                url: "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json",
                method: "GET",
                async: false,
                success: function (oData) {
                    that.getResourcesSuccess(oData.Rowsets.Rowset[0]);
                },
                error: function (oData) {
                    alert("errore");
                }
            });

       
            



        },
      
        onAfterRendering: function () {

            //this.search();

            //this.timer = setInterval(jQuery.proxy(this.search, this), 5000);

        },
        search: function (event) {
            clearInterval(this.timer);
            this.timer = null;
            this.getResources();

        },
        getResourcesSuccess: function (data, response) {
            sap.ui.core.BusyIndicator.hide();



            var machinesArr = data.Row;

            var machinesMap = {};

            for (var idx = 0, cobj, len = machinesArr.length; idx < len; idx++) {

                cobj = machinesArr[idx];

                try {
                    cobj.value = Number(cobj.YIELD);
                } catch (err) {
                    jQuery.sap.log.error(err);
                }

                switch (cobj.STATUS_TYPE) {
                    case "1":
                        cobj.img = "images/Pressa_verde_3d.png";
                        cobj.gaugeVisible = false;
                        cobj.hasTool = false;
                        break;
                    case "2":
                        cobj.img = "images/Pressa_gialla_3d.png";
                        cobj.gaugeVisible = true;
                        cobj.hasTool = false;
                        break;
                    case "3":
                        cobj.img = "images/Pressa_rossa_3d.png";
                        cobj.gaugeVisible = false;
                        cobj.hasTool = true;
                        break;
                    case "4":
                        cobj.img = "images/siliconatrice_verde.png";
                        cobj.gaugeVisible = false;
                        cobj.hasTool = false;
                        break;
                    case "5":
                        cobj.img = "images/siliconatrice_gialla.png";
                        cobj.gaugeVisible = true;
                        cobj.hasTool = false;
                        break;
                    case "6":
                        cobj.img = "images/siliconatrice_rossa.png";
                        cobj.gaugeVisible = false;
                        cobj.hasTool = true;
                        break;
                    case "68":
                        cobj.img = "images/Pressa_verde_3d.png";
                        cobj.gaugeVisible = true;
                        cobj.hasTool = false;
                        break;
                    case "98":
                        cobj.img = "images/Pressa_grigio_98_3d.png";
                        cobj.gaugeVisible = false;
                        cobj.hasTool = false;
                        break;
                    case "99":
                        cobj.img = "images/Pressa_grigio_99_3d.png";
                        cobj.gaugeVisible = false;
                        cobj.hasTool = false;
                        break;
                }


                machinesMap[cobj.RESOURCE] = cobj;
            }
            this.machines.setProperty("/", machinesMap);

        },
        getResourcesError: function (error) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error(error);
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
        clickDetail: function (event) {
            var res1 = event.getParameter("resource");
            var img1 = event.getParameter("img");
            var type1 = event.getParameter("type");
            this.detailDialog.open(this.getView(), {res: res1, img: img1, type: type1});
        }

    });

    return PlantSController;

});

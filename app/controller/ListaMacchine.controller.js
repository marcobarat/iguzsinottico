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
    'sap/ui/core/mvc/Controller',
    'plantvim/controller/Library'
], function (jQuery, Filter, JSONModel, ResConfigManager, MessageBox, MessageToast, History, ModelManager, DetailDialog, Controller, Library) {
    "use strict";

    var PlantSController = Controller.extend("plantvim.controller.ListaMacchine", {
        resConfigManager: new ResConfigManager(),
        timer: null,
        callTimer: null,
        detailDialog: new DetailDialog(),
        info: null,
        plant: null,
        repartoID: null,
        machines: new JSONModel(),
        onInit: function () {

            var model = new JSONModel({"user": {"name": "", "id": "", "handle": ""}});
            this.info = model;
            this.getView().setModel(model, "info");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("ListaMacchine").attachPatternMatched(this._onObjectMatched, this);


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

            this.repartoID = (jQuery.sap.getUriParameters().get("repartoid")) ? jQuery.sap.getUriParameters().get("repartoid") : "1";
            this.plant = (jQuery.sap.getUriParameters().get("plantid")) ? jQuery.sap.getUriParameters().get("plantid") : "1";

            if (null !== this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }

//            setTimeout(this.startOminoAnim, 2000);
//            this.timer = setInterval(this.startOminoAnim, 30000);

            if (null !== this.callTimer) {
                clearInterval(this.callTimer);
                this.callTimer = null;
            }

            this.getResources();
            this.callTimer = setInterval(jQuery.proxy(this.getResources, this), 15000);

        },
        getResources: function () {
            var transactionName = "XAC_GetAllWorkcenterByTypeAndRepartoID";

            var site = "iGuzzini";
            var input = "&plant=" + this.plant + "&type=I&repartoid=" + this.repartoID;
            var transactionCall = site + "/XACQuery" + "/" + transactionName;
            var link = "/XMII/Illuminator?QueryTemplate=" + transactionCall + input + "&Content-Type=text/json";

            Library.AjaxCallerData(link, this.getResourcesSuccess.bind(this), this.getResourcesError.bind(this));
        },
        getRandom: function () {
            var val = Math.floor(3 * Math.random());
            switch (val) {
                case 0:
                    return "0";
                case 1:
                    return "1";
                default:
                    return "2";
            }
        },
        getResourcesSuccess: function (data, response) {
            sap.ui.core.BusyIndicator.hide();
            for (var i = 0;i < data.Rowsets.Rowset[0].Row.length; i++) {
                data.Rowsets.Rowset[0].Row[i].status = this.getRandom();
            }
            this.machines.setData(data.Rowsets.Rowset[0].Row);
            this.getView().setModel(this.machines);
        },
        getResourcesError: function (error) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error(error);
        },
        search: function (event) {
            clearInterval(this.timer);
            this.timer = null;
            this.getResources();
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
        onNavBack: function () {
            var newModel = new JSONModel();
            this.getView().setModel(newModel);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("machine", true);
        },
        clickDetail: function (event) {
//            var res1 = event.getParameter("resource");
//            var img1 = event.getParameter("img");
//            var type1 = event.getParameter("type");
            
            var res1 = "1";
            var img1 = "images/Pressa_verde_3d.png";
            var type1 = "E";

            var modelz = new JSONModel();

            modelz.setProperty("/machine", this.machines.getData());
            modelz.setProperty("/machineselected",
                    {
                        machine: res1,
                        workcenterid: "1",
                        type: "E",
                        qtytobuild: "1"
                    });

            sap.ui.getCore().setModel(modelz);
            this.detailDialog.open(this.getView(), {res: res1, img: img1, type: type1});
        }

    });

    return PlantSController;

});

sap.ui.define(
    ["./BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/Fragment"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment) {
        "use strict";

        return Controller.extend("derga.ordermanagement.controller.Position", {
            onInit: function () {
                var oJsonModel = new JSONModel({
                    Product: [
                        {
                            name: "Pieces per box",
                            value: 10,
                        },
                        {
                            name: "Year",
                            value: 20,
                        },
                        {
                            name: "Color",
                            value: 50,
                        },
                    ],
                    Product2: [
                        {
                            name: "Rate",
                            value: 10,
                        },
                        {
                            name: "Tone",
                            value: 20,
                        },
                        {
                            name: "Size",
                            value: 50,
                        },
                    ],
                });
                this.getOwnerComponent()
                    .getRouter()
                    .getRoute("SalesOrderMain")
                    .attachPatternMatched(this._onPatternMatched, this);
                this.getView().setModel(oJsonModel, "oOrderData");
            },

            _onPatternMatched: function () {
                const data = this.getItemData();
                const productMod = new JSONModel(data);
                this.getView().setModel(productMod, "productDetails");
            },

            onProductDialog: function () {
                var oView = this.getView();
                if (!this._pValueHelpDialogs) {
                    this._pValueHelpDialogs = Fragment.load({
                        id: oView.getId(),
                        name: "derga.ordermanagement.view.fragments.Product",
                        controller: this,
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                this._pValueHelpDialogs.then(
                    function (oValueHelpDialog) {
                        oValueHelpDialog.open();
                    }.bind(this)
                );
            },

            closeProduct() {
                this.byId("productDialog").close();
            },

            searchProduct: function () {
                const sValue = this.byId("productSearch").getValue();
                this.byId("productTables")
                    .getBinding("rows")
                    .changeParameters({ $search: sValue });
            },
        });
    }
);

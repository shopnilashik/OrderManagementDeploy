sap.ui.define(
    [
        "./BaseController",
        "sap/ui/core/Fragment",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/json/JSONModel",
        "sap/m/Dialog",
        "sap/m/List",
        "sap/m/StandardListItem",
        "sap/m/Button",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        Controller,
        Fragment,
        Filter,
        FilterOperator,
        JSONModel,
        Dialog,
        List,
        StandardListItem,
        Button
    ) {
        let dataAvailable = {};
        let formattedDate = "";
        ("use strict");
        return Controller.extend("derga.ordermanagement.controller.Items", {
            onInit: function () {
                var oData = {
                    items: [
                        {
                            productName: "",
                            Qty: "0",
                            position: 10,
                        },
                    ],
                };
                var oTable1 = new JSONModel({
                    items: [
                        {
                            documentDate: "01.02.2022",
                            outside: "External Reference",
                            choice: "1st Choice",
                            tone: 11,
                            caliber: "A",
                            quantity: 2000,
                        },
                        {
                            documentDate: "01.02.2022",
                            outside: "External Reference",
                            choice: "1st Choice",
                            tone: 11,
                            caliber: "A",
                            quantity: 2000,
                        },
                        {
                            documentDate: "01.02.2022",
                            outside: "External Reference",
                            choice: "1st Choice",
                            tone: 11,
                            caliber: "A",
                            quantity: 2000,
                        },
                        {
                            documentDate: "01.02.2022",
                            outside: "External Reference",
                            choice: "1st Choice",
                            tone: 11,
                            caliber: "A",
                            quantity: 2000,
                        },
                        {
                            documentDate: "01.02.2022",
                            outside: "External Reference",
                            choice: "1st Choice",
                            tone: 11,
                            caliber: "A",
                            quantity: 2000,
                        },
                    ],
                });
                var oTable2 = new JSONModel({
                    items: [
                        {
                            MatchId: "2000000000",
                            choice: "1st Choice",
                            tone: 10,
                            caliber: "A",
                            quantity1: 1000,
                            quantity2: 250,
                            quantity3: 300,
                            attributeMatch1: "Attrib 1",
                            attributeMatch2: "Attrib 2",
                            attributeMatch3: "Attrib 3",
                            division: 2030,
                            warehouse: "M001"
                        },
                        {
                            MatchId: "2000000000",
                            choice: "1st Choice",
                            tone: 10,
                            caliber: "A",
                            quantity1: 1000,
                            quantity2: 250,
                            quantity3: 300,
                            attributeMatch1: "Attrib 1",
                            attributeMatch2: "Attrib 2",
                            attributeMatch3: "Attrib 3",
                            division: 2030,
                            warehouse: "M001"
                        },
                    ],
                });

                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "items");
                this.getView().setModel(oTable1, "oTable1");
                this.getView().setModel(oTable2, "oTable2");
            },

            closeProduct() {
                this.byId("productDialog").close();
            },

            selectProduct: function (oEvent) {
                let selectedProduct = oEvent
                    .getParameter("rowContext")
                    .getObject();
                const model = this.getModel("items");
                const storedProducts = model?.oData?.items || model?.oData;
                let storeNewProduct = [];
                if (dataAvailable.ID) {
                    const productIndex = storedProducts.findIndex(
                        (data) =>
                            data.ID == dataAvailable.ID &&
                            data.position == dataAvailable.position
                    );
                    selectedProduct.Qty = 0;
                    if (productIndex || productIndex == 0) {
                        storedProducts[productIndex] = {
                            position: storedProducts[productIndex].position,
                            ...selectedProduct,
                        };

                        storeNewProduct = storedProducts;
                        dataAvailable = {};
                    } else {
                        storeNewProduct = storedProducts;
                        dataAvailable = {};
                    }
                } else {
                    selectedProduct.Qty = 0;
                    const prodPosition = storedProducts.length * 10;
                    selectedProduct.position = prodPosition;
                    storeNewProduct = [
                        ...storedProducts.slice(0, storedProducts.length - 1),
                        selectedProduct,
                        {
                            position: prodPosition + 10,
                            productName: "Select Product",
                            Qty: "0",
                        },
                    ];
                }
                const oModel = new JSONModel(storeNewProduct);
                this.getView().setModel(oModel, "items");
                this.closeProduct();
            },

            searchProduct: function () {
                const sValue = this.byId("productSearch").getValue();
                this.byId("productTables")
                    .getBinding("rows")
                    .changeParameters({ $search: sValue });
            },

            onDateChange: function (oEvent, fromFunc) {
                let date = fromFunc ? oEvent : oEvent.getParameters().value;
                date = new Date(date);
                const fDate = date.toLocaleString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                });
                formattedDate = fDate;
                return fDate;
            },

            onRowPressed: function (data) {
                try {
                    this.setItemData(data);
                    // let sPath = oEvent.getSource().oBindingContexts.items.sPath;

                    var oModel = new sap.ui.model.json.JSONModel(data);
                    this.setModel(oModel, "testDrive");
                    console.log("data sent");
                    let oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("SalesOrderMain");
                } catch (error) {
                    console.log("error", error);
                }
            },

            dateFormatter: function (date) {
                const formattedDate = date && this.onDateChange(date, true);
                return formattedDate;
            },
            onProductDialog: function (data) {
                if (!Array.isArray(data) && data.hasOwnProperty("ID")) {
                    dataAvailable = data;
                }
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

            onCreateItem(oEvent) {
                let data = {
                    Product: "gergrg",
                    Qty: 12,
                };
                let oTableData = oEvent.getSource().getModel("items").getData();
                oTableData.items = [data, ...oTableData.items];
                this.getView().getModel("items").setData(oTableData);
            },
            onBatchDialog:function(){
                var oView = this.getView();
                if (!this._pValueHelpDialogBatch) {
                    this._pValueHelpDialogBatch = Fragment.load({
                        id: oView.getId(),
                        name: "derga.ordermanagement.view.fragments.Batch",
                        controller: this,
                    }).then(function (oValueHelpDialogBatch) {
                        oView.addDependent(oValueHelpDialogBatch);
                        return oValueHelpDialogBatch;
                    });
                }
                this._pValueHelpDialogBatch.then(
                    function (oValueHelpDialogBatch) {
                        oValueHelpDialogBatch.open();
                    }.bind(this)
                );
            },
            onSaveBatch:function(){
                this._pValueHelpDialogBatch.then(
                    function (oValueHelpDialogBatch) {
                        oValueHelpDialogBatch.close();
                    }.bind(this)
                );
            },
        });
    }
);

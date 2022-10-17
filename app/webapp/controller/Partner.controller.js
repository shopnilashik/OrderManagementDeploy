sap.ui.define(
    ["./BaseController", "sap/ui/model/json/JSONModel"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("derga.ordermanagement.controller.Partner", {
            onInit: function () {
                var oJsonModel = new JSONModel({
                    Partner: [
                        {
                            patnerName: "Giacomo Guilizzonia",
                            partnerRole: "ZA",
                            partner: "Sales rep",
                        },
                        {
                            patnerName: "Marco Botton",
                            partnerRole: "ZB",
                            partner: "Area Manager",
                        },
                        {
                            patnerName: "Mariah Maclachlan",
                            partnerRole: "ZC",
                            partner: "Boss",
                        },

                        {
                            patnerName: "Valerie Liberty",
                            partnerRole: "ZD",
                            partner: "Super Boss",
                        },

                        {
                            patnerName: "Ship-tp",
                            partnerRole: "WE",
                            partner: "Ship to Name",
                        },

                        {
                            patnerName: "Courier",
                            partnerRole: "SP",
                            partner: "Courier Name",
                        },
                    ],
                });
                this.getView().setModel(oJsonModel, "oOrderData");
            },

            filterRegions(countryKey, id) {
                let comboBoxId = this.getView().byId(id);
                comboBoxId.getBinding("items").changeParameters({
                    $filter: `country_ID eq '${countryKey}'`,
                });
            },

            selectCountryOne(oEvent) {
                let key = oEvent.getParameter("selectedItem").getKey();

                this.getView().byId("province1").clearSelection();
                this.filterRegions(key, "province1");
            },

            selectCountryTwo(oEvent) {
                let key = oEvent.getParameter("selectedItem").getKey();

                this.getView().byId("province2").clearSelection();
                this.filterRegions(key, "province2");
            },
        });
    }
);

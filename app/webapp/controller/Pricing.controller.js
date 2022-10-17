sap.ui.define(
    ["./BaseController", "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("derga.ordermanagement.controller.Pricing", {
            onInit:function() {
                var oJsonModel = new JSONModel({
                    Pricing: [
                        {
                            condition: "ZP00",
                            conddescription: "Price List",
                            value: 25,
                            currency:"EUR",
                            price:"1",
                            udm: "PZ",
                            conditionvalue:2.500,
                            currency2:"EUR"
                        },
                        {
                            condition: "ZP01",
                            conddescription: "Discount",
                            value: 50,
                            currency:"%",
                            price:"",
                            udm: "",
                            conditionvalue:150,
                            currency2:"EUR"
                        },
                        {
                            condition: "ZEX1",
                            conddescription: "Extra Cost(pack)",
                            value: 100,
                            currency:"EUR",
                            price:"",
                            udm: "",
                            conditionvalue:"",
                            currency2:""
                        },
                    ],
                  
                });
                this.getView().setModel(oJsonModel, "oOrderData");
            },
           
        });
    }
);
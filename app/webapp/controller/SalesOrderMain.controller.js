sap.ui.define(
    ["./BaseController"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend(
            "derga.ordermanagement.controller.SalesOrderMain",
            {
                onInit: function () {
                    this.getOwnerComponent()
                        .getRouter()
                        .getRoute("SalesOrderMain")
                        .attachPatternMatched(this._onPatternMatched, this);
                },

                _onPatternMatched: function () {
                    // const data = this.getItemData();
                    // console.log("sales data", data);
                    // // let sPath = oEvent.getParameters().arguments.path;
                    // // const sCustomerPath = "/" + sPath;
                    // // this.getView().bindElement(sCustomerPath);
                },
            }
        );
    }
);

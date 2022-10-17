sap.ui.define(
    ["./BaseController",
	"sap/ui/model/json/JSONModel"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("derga.ordermanagement.controller.MainView", {
            onInit:function() {
               
            },
            onFooterEnable:function(){
                var oObjectPage = this.getView().byId("ObjectPageLayout"),
				// @ts-ignore
				bCurrentShowFooterState = oObjectPage.getShowFooter();
			// @ts-ignore
			oObjectPage.setShowFooter(!bCurrentShowFooterState);
            },
            pr(oEvent){console.log(oEvent)},
            onOrderTypeSelect:function(){
                


            }
        });
    }
);

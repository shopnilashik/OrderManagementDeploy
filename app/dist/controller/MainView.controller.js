sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel"],function(e,o){"use strict";return e.extend("derga.ordermanagement.controller.MainView",{onInit:function(){},onFooterEnable:function(){var e=this.getView().byId("ObjectPageLayout"),o=e.getShowFooter();e.setShowFooter(!o)},pr(e){console.log(e)},onOrderTypeSelect:function(){}})});
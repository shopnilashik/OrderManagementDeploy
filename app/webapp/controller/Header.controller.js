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
    "sap/m/TableSelectDialog",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/m/Column",
    "sap/m/ObjectIdentifier",
    'sap/m/MessageToast',
    "sap/base/security/encodeURLParameters",
    "sap/ui/table/Table"
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller, FilterOperator} Controller
   */
  function (Controller, Fragment, Filter, FilterOperator, JSONModel, Dialog, List, StandardListItem, Button, TableSelectDialog, ColumnListItem, Text, Column, ObjectIdentifier, MessageToast, encodeURLParameters, Table) {
    "use strict";

    var isFirstLoad = true;
    

    return Controller.extend("derga.ordermanagement.controller.Header", {
      onInit: function () {
        var oData = {
          lan: this.getLanguge()
        };
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel, "lan");
        this._shiptoEvent();
        this._carrierEvent();
      
      },
     
      updateAllShipDatas(){
        this.getOwnerComponent().getEventBus().publish(
          "PartnerShipToChannel",
          "PartnerShipToEvent",
         
        );
      },
      updateAllCarrierDatas(){
        this.getOwnerComponent().getEventBus().publish(
          "PartnerCarrierChannel",
          "PartnerCarrierEvent",
          
        );
      },
      onCustomerDialog: function () {
        var oView = this.getView();
        if (!this._pValueHelpDialogs) {
          this._pValueHelpDialogs = Fragment.load({
            id: oView.getId(),
            name: "derga.ordermanagement.view.fragments.Customer",
            controller: this
          }).then(function (oValueHelpDialog) {
            oView.addDependent(oValueHelpDialog);
            return oValueHelpDialog;
          });
        }
        this._pValueHelpDialogs.then(function (oValueHelpDialog) {
          oValueHelpDialog.open();
        }.bind(this));
      },
      selectCustomer(oEvent) {
        let selectedCustomer = oEvent.getParameter("rowContext").getObject();
        let oInput = this.byId("customerInput");

        let iCustomerCode = selectedCustomer.businessPartner_ID;
        let sCustomerText = selectedCustomer.name;
        let sCustomerValue = this.bindTextAndCode(sCustomerText, iCustomerCode);
        this.allowShip();


        let sVKORGText = selectedCustomer.salesOrganizationName;
        let iVkorgCode = selectedCustomer.salesOrganization_ID;
        let sVKORGValue = this.bindTextAndCode(sVKORGText, iVkorgCode,);

        let sVTWEGText = selectedCustomer.distributionChannelName;
        let iVTWEGCode = selectedCustomer.distributionChannel_ID;
        let sVTWEGValue = this.bindTextAndCode(sVTWEGText, iVTWEGCode);

        let sSpartText = selectedCustomer.divisionName;
        let iSpartCode = selectedCustomer.division_ID;
        let sSpartValue = this.bindTextAndCode(sSpartText, iSpartCode,);

        this.setCustomerCode(iCustomerCode, iVkorgCode, iVTWEGCode, iSpartCode);
        oInput.setValue(sCustomerValue);
        let customerPaymentTermcode = selectedCustomer.customerPaymentTerm_ID;
				this.getView().byId("provgince").setSelectedKey(customerPaymentTermcode)
        // this._setTextFieldValue(customerPaymentTermtext, "provgince");
        this._setTextFieldValue(sVKORGValue, "selectSheet3");
        this._setTextFieldValue(sVTWEGValue, "selectSheet4");
        this._setTextFieldValue(sSpartValue, "selectSheet6");
        this._onPartnerBinding();
        this.closeCustomer();
      },
      
      closeCustomer() {
        this.byId("customerDialog").close();
      },
      _onPartnerBinding() {
        this.getOwnerComponent().getEventBus().publish(
          "PartnerChannel",
          "PartnerEvent",
        );
      },
      _setTextFieldValue(value, inputId) {
        this.getView().byId(inputId).setValue(value);
      },
      handleSearch: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new Filter({
          filters: [
            new Filter("businessPartner_ID", FilterOperator.Contains, sValue),
            new Filter("businessPartner/name", FilterOperator.Contains, sValue),
          ]
        });
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
      },
			searchCusotmer(){
				var sValue = this.byId("customerSearch").getValue();
				this.byId("customerTables").getBinding("rows").changeParameters({$search:sValue});
			},
      filterRegions(countryKey,id){
                        let comboBoxId = this.getView().byId(id);
                        comboBoxId.getBinding("items").changeParameters({
                          $filter: `country_ID eq '${countryKey}'`
                        });
                      },
       _shiptoEvent(){
          this.getOwnerComponent().getEventBus().subscribe(
           "HeaderShipToChannel",
           "HeaderShipToEvent",
           this._updatingAllShipData,
           this
         );
       },
       _carrierEvent(){
          this.getOwnerComponent().getEventBus().subscribe(
          "HeaderCarrierChannel",
          "HeaderCarrierEvent",
          this._updatingAllCarrierData,
          this
        );
      },
      _updatingAllCarrierData(){
        let oShipObject=this.getCarrierValue();
        this.byId("selectSheet12").setValue(oShipObject.carrier);
        this.setInputIdbySell({ oSelectedItem: oShipObject.strah, inputID: "address2" });
                  this.setInputIdbySell({ oSelectedItem: oShipObject.cap, inputID: "postalCodeText2" });
                  this.setInputIdbySell({ oSelectedItem: oShipObject.city, inputID: "cityText2" });
                  this.setInputIdbySell({ oSelectedItem: oShipObject.province, inputID: "regionid2" });
                  this.setInputIdbySell({ oSelectedItem: oShipObject.country, inputID: "country2" });
                  this.setInputIdbySell({ oSelectedItem: oShipObject.recipientName, inputID: "pname" });
                  this.filterRegions(oShipObject.countryID, "regionid2")
      },
       _updatingAllShipData(){
        let oShipObject=this.getShipToValue();
        this.byId("selectSheet8").setValue(oShipObject.shipto);
        this.setInputIdbySell({ oSelectedItem: oShipObject.strah, inputID: "addressInput" });
                  this.setInputIdbySell({ oSelectedItem: oShipObject.cap, inputID: "postalCodeText" });
                  this.setInputIdbySell({ oSelectedItem: oShipObject.city, inputID: "cityText" });
                  this.setInputIdbySell({ oSelectedItem: oShipObject.province, inputID: "province" });
                  this.setInputIdbySell({ oSelectedItem: oShipObject.country, inputID: "country" });
                  this.setInputIdbySell({ oSelectedItem: oShipObject.recipientName, inputID: "cusName" });
                  this.filterRegions(oShipObject.countryID, "province");
      },
    });
  }
);

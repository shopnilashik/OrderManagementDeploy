sap.ui.define([
	"./BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/ColumnListItem",
    "sap/m/Text",
    
    "sap/m/ObjectIdentifier",
	"sap/m/Button",
	"sap/ui/table/Column"
	
], function(
	BaseController,
	Filter,
	FilterOperator,
	ColumnListItem,
	Text,
	
	ObjectIdentifier,
	Button,
	Column,
) {
	"use strict";

	return BaseController.extend("derga.ordermanagement.controller.Partners", {

		/**
		 * @override
		 */
		onInit() {
			this._customerBinding();
			this._shiptoEvent();
			this._carrierEvent();
		},
		_shiptoEvent(){
			this.getOwnerComponent().getEventBus().subscribe(
				"PartnerShipToChannel",
				"PartnerShipToEvent",
				this._updatingAllShipData,
				this
			);
		},
		_carrierEvent(){
			this.getOwnerComponent().getEventBus().subscribe(
				"PartnerCarrierChannel",
				"PartnerCarrierEvent",
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
                this.filterRegions(oShipObject.countryID, "province")
		},
		_customerBinding(){
			this.getOwnerComponent().getEventBus().subscribe(
				"PartnerChannel",
				"PartnerEvent",
				this._onParternerBInding,
				this
			);
		},
		_onParternerBInding(){
				var cbID = new Filter("businessPartner_ID",FilterOperator.EQ,this.getCustomerCode());
				var divID = new Filter("division_ID",FilterOperator.EQ,this.getDivId());
				var disID = new Filter("distributionChannel_ID",FilterOperator.EQ,this.getDisChannel());
				var sID = new Filter("salesOrganization_ID",FilterOperator.EQ,this.getsalesOrg());
				this.getView().byId("partnerTable").bindRows({path:"/CustomerSalesPartenFunctions",filters:new Filter([cbID,disID,sID,divID],true)});
		  },
		  partnerSearch(oEvent){
			let sValue = oEvent.getParameter("query");
			var cbID = new Filter("businessPartner_ID",FilterOperator.EQ,this.getCustomerCode());
				var divID = new Filter("division_ID",FilterOperator.EQ,this.getDivId());
				var disID = new Filter("distributionChannel_ID",FilterOperator.EQ,this.getDisChannel());
				var sID = new Filter("salesOrganization_ID",FilterOperator.EQ,this.getsalesOrg());
				this.getView().byId("partnerTable").getBinding("rows").changeParameters({filters:new Filter([cbID,disID,sID,divID]),$search:sValue});
		  },
		  filterRegions(countryKey,id){
                        let comboBoxId = this.getView().byId(id);
                        comboBoxId.getBinding("items").changeParameters({
                          $filter: `country_ID eq '${countryKey}'`
                        });
                      },
		  updateAllShipDatas(){
			this.getOwnerComponent().getEventBus().publish(
			  "HeaderShipToChannel",
			  "HeaderShipToEvent",
			  
			);
		  },
		  updateAllCarrierDatas(){
			this.getOwnerComponent().getEventBus().publish(
			  "HeaderCarrierChannel",
			  "HeaderCarrierEvent",
			 
			);
		  },

	});
});
sap.ui.define(["./BaseController","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/ColumnListItem","sap/m/Text","sap/m/ObjectIdentifier","sap/m/Button","sap/ui/table/Column"],function(e,t,n,i,r,s,a,l){"use strict";return e.extend("derga.ordermanagement.controller.Partners",{onInit(){this._customerBinding();this._shiptoEvent();this._carrierEvent()},_shiptoEvent(){this.getOwnerComponent().getEventBus().subscribe("PartnerShipToChannel","PartnerShipToEvent",this._updatingAllShipData,this)},_carrierEvent(){this.getOwnerComponent().getEventBus().subscribe("PartnerCarrierChannel","PartnerCarrierEvent",this._updatingAllCarrierData,this)},_updatingAllCarrierData(){let e=this.getCarrierValue();this.byId("selectSheet12").setValue(e.carrier);this.setInputIdbySell({oSelectedItem:e.strah,inputID:"address2"});this.setInputIdbySell({oSelectedItem:e.cap,inputID:"postalCodeText2"});this.setInputIdbySell({oSelectedItem:e.city,inputID:"cityText2"});this.setInputIdbySell({oSelectedItem:e.province,inputID:"regionid2"});this.setInputIdbySell({oSelectedItem:e.country,inputID:"country2"});this.setInputIdbySell({oSelectedItem:e.recipientName,inputID:"pname"});this.filterRegions(e.countryID,"regionid2")},_updatingAllShipData(){let e=this.getShipToValue();this.byId("selectSheet8").setValue(e.shipto);this.setInputIdbySell({oSelectedItem:e.strah,inputID:"addressInput"});this.setInputIdbySell({oSelectedItem:e.cap,inputID:"postalCodeText"});this.setInputIdbySell({oSelectedItem:e.city,inputID:"cityText"});this.setInputIdbySell({oSelectedItem:e.province,inputID:"province"});this.setInputIdbySell({oSelectedItem:e.country,inputID:"country"});this.setInputIdbySell({oSelectedItem:e.recipientName,inputID:"cusName"});this.filterRegions(e.countryID,"province")},_customerBinding(){this.getOwnerComponent().getEventBus().subscribe("PartnerChannel","PartnerEvent",this._onParternerBInding,this)},_onParternerBInding(){var e=new t("businessPartner_ID",n.EQ,this.getCustomerCode());var i=new t("division_ID",n.EQ,this.getDivId());var r=new t("distributionChannel_ID",n.EQ,this.getDisChannel());var s=new t("salesOrganization_ID",n.EQ,this.getsalesOrg());this.getView().byId("partnerTable").bindRows({path:"/CustomerSalesPartenFunctions",filters:new t([e,r,s,i],true)})},partnerSearch(e){let i=e.getParameter("query");var r=new t("businessPartner_ID",n.EQ,this.getCustomerCode());var s=new t("division_ID",n.EQ,this.getDivId());var a=new t("distributionChannel_ID",n.EQ,this.getDisChannel());var l=new t("salesOrganization_ID",n.EQ,this.getsalesOrg());this.getView().byId("partnerTable").getBinding("rows").changeParameters({filters:new t([r,a,l,s]),$search:i})},filterRegions(e,t){let n=this.getView().byId(t);n.getBinding("items").changeParameters({$filter:`country_ID eq '${e}'`})},updateAllShipDatas(){this.getOwnerComponent().getEventBus().publish("HeaderShipToChannel","HeaderShipToEvent")},updateAllCarrierDatas(){this.getOwnerComponent().getEventBus().publish("HeaderCarrierChannel","HeaderCarrierEvent")}})});
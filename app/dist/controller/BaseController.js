sap.ui.define(["sap/m/MessageToast","sap/ui/core/mvc/Controller","sap/ui/core/routing/History","sap/ui/core/UIComponent","derga/ordermanagement/model/formatter","sap/m/SelectDialog","sap/m/StandardListItem","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/core/Fragment"],function(e,t,i,r,s,a,n,l,o,u){"use strict";var h=false;let d=null,g=null,c=null,p=null;let I="",m="",C="",S="",y="",D="",b="",P="";let v="",w="",f="",V="",_="",A="",N="",x="";let R={};return t.extend("derga.ordermanagement.controller.BaseController",{formatter:s,getCarrierValue(){return{carrier:v,recipientName:w,strah:f,cap:V,city:_,province:A,country:N,countryID:x}},setCarrierValue({sCarrier:e,sRecipientName:t,sRtrah:i,sCap:r,sCity:s,sProvince:a,sPountry:n,sCountryId:l}){v=e||v;w=t==""?"":t||w;f=i==""?"":i||f;V=r==""?"":r||V;_=s==""?"":s||_;A=a==""?"":a||A;N=n==""?"":n||N;x=l==""?"":l||x},setShiptoValue({sShipto:e,sRecipientName:t,sRtrah:i,sCap:r,sCity:s,sProvince:a,sPountry:n,sCountryId:l}){I=e||I;m=t==""?"":t||m;C=i==""?"":i||C;S=r==""?"":r||S;y=s==""?"":s||y;D=a==""?"":a||D;b=n==""?"":n||b;P=l==""?"":l||P},getShipToValue(){return{shipto:I,recipientName:m,strah:C,cap:S,city:y,province:D,country:b,countryID:P}},getAllowShip(){return h},allowShip(){h=true},getDivId(){return p},getsalesOrg(){return g},getDisChannel(){return c},getCustomerCode(){return d},setCustomerCode(e,t,i,r){d=e||"";g=t||"";c=i||"";p=r||""},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},navTo:function(e,t,i){this.getRouter().navTo(e,t,i)},getRouter:function(){return r.getRouterFor(this)},onNavBack:function(){const e=i.getInstance().getPreviousHash();if(e!==undefined){window.history.back()}else{this.getRouter().navTo("appHome",{},true)}},getLanguge(){let e=sap.ui.getCore().getConfiguration().getLanguage();let t=e.slice(0,2).toLowerCase();return"'"+t+"'"},OnSelectDialogOpen:function({sPath:e,sDataPath:t,sTitle:i,sSearchPath:r,sInputId:s,sDes:l}){this.oSelectDialog=new a({growing:true,growingThreshold:10,contentHeight:"41%",title:i,noDataText:"No Data found",search:e=>this._onSearchDialog(e,r),confirm:e=>this._onDialogClose(e,s),showClearButton:true,cancel:e=>this._onDialogClose(e,s),items:{path:e,length:200,template:new n({title:t,description:l}),parameters:{$expand:{texts:{}}}}});this.getView().addDependent(this.oSelectDialog);this.oSelectDialog.open()},_DefaultFilter(){},_onSearchDialog:function(e,t){var i=e.getParameter("value");console.log(t);console.log(i);var r=new l(t,o.Contains,i);var s=e.getParameter("itemsBinding");s.filter([r])},_onDialogClose:function(e,t){var i=e.getParameter("selectedItem"),r=this.byId(t);if(!i){r.resetProperty("value");return}r.setValue(i.getTitle())},bindTextAndCode(e,t){return`${e}(${t})`},_resetSearch(e,t){var i=new l(t,o.Contains,"");var r=e.getSource().getBinding("items");r.filter([i])},setInputIdbySell({oSelectedItem:e,inputID:t}){this.byId(t).setValue(e)},onShipOpen(){if(this.getAllowShip()){var t=this.getView();if(!this._pValueHelpDialogss){this._pValueHelpDialogss=u.load({id:t.getId(),name:"derga.ordermanagement.view.fragments.Ship",controller:this}).then(function(e){t.addDependent(e);return e})}this._pValueHelpDialogss.then(function(e){e.open();this._bindShipRows()}.bind(this))}else{var i=this.getResourceBundle().getText("header.shiptoError");e.show(i)}},_bindShipRows(){let e=this.getView().byId("shipTables").getBinding("rows");var t=new l("businessPartner_ID",o.EQ,this.getCustomerCode());var i=new l("division_ID",o.EQ,this.getDivId());var r=new l("distributionChannel_ID",o.EQ,this.getDisChannel());var s=new l("salesOrganization_ID",o.EQ,this.getsalesOrg());var a=new l("partnerFunction_ID",o.EQ,"CO");e.filter([t,i,r,s,a])},selectShip(e){let t=e.getParameter("rowContext").getObject()||"";let i=this.byId("selectSheet8");let r=t.businessPartner_ID;let s=t.businessPartnerName;let a=this.bindTextAndCode(s,r);let n=t.region_ID;this.byId("province").setSelectedKey(n);let l=t.regionName;let o=this.bindTextAndCode(l,n);let u=t.country_ID;let h=t.countryName;let d=this.bindTextAndCode(h,u);i.setValue(a);this.setInputIdbySell({oSelectedItem:t.businessPartnerStreetName,inputID:"addressInput"});this.setInputIdbySell({oSelectedItem:t.businessPartnerPostalCode,inputID:"postalCodeText"});this.setInputIdbySell({oSelectedItem:t.businessPartnerCityName,inputID:"cityText"});this.setInputIdbySell({oSelectedItem:o,inputID:"province"});this.setInputIdbySell({oSelectedItem:d,inputID:"country"});this.setInputIdbySell({oSelectedItem:t.businessPartnerName,inputID:"cusName"});this.filterRegions(t.country_ID,"province");this.setShiptoValue({sShipto:a,sRecipientName:t.businessPartnerName,sRtrah:t.businessPartnerStreetName,sCap:t.businessPartnerPostalCode,sCity:t.businessPartnerCityName,sProvince:o,sPountry:d,sCountryId:t.country_ID});this.updateAllShipDatas();this.closeShip()},closeShip(){this.byId("shipDialog").close()},searchShip(){var e=this.byId("shipSearchField").getValue();this.byId("shipTables").getBinding("rows").changeParameters({$search:e})},onCarrierOpen(){if(this.getAllowShip()){var t=this.getView();if(!this._pValueHelpDialogsss){this._pValueHelpDialogsss=u.load({id:t.getId(),name:"derga.ordermanagement.view.fragments.Carrier",controller:this}).then(function(e){t.addDependent(e);return e})}this._pValueHelpDialogsss.then(function(e){e.open();this._bindCarrier()}.bind(this))}else{var i=this.getResourceBundle().getText("header.shiptoError");e.show(i)}},_bindCarrier(){let e=this.getView().byId("carrierTables").getBinding("rows");var t=new l("businessPartner_ID",o.EQ,this.getCustomerCode());var i=new l("division_ID",o.EQ,this.getDivId());var r=new l("distributionChannel_ID",o.EQ,this.getDisChannel());var s=new l("salesOrganization_ID",o.EQ,this.getsalesOrg());var a=new l("partnerFunction_ID",o.EQ,"DM");e.filter([t,i,r,s,a])},selectCarrier(e){let t=e.getParameter("rowContext").getObject();let i=this.byId("selectSheet12");let r=t.businessPartner_ID;let s=t.businessPartnerName;let a=this.bindTextAndCode(s,r);let n=t.region_ID;this.byId("regionid2").setSelectedKey(n);let l=t.regionName;let o=this.bindTextAndCode(l,n);let u=t.country_ID;let h=t.countryName;let d=this.bindTextAndCode(h,u);i.setValue(a);this.setInputIdbySell({oSelectedItem:t.businessPartnerStreetName,inputID:"address2"});this.setInputIdbySell({oSelectedItem:t.businessPartnerPostalCode,inputID:"postalCodeText2"});this.setInputIdbySell({oSelectedItem:t.businessPartnerCityName,inputID:"cityText2"});this.setInputIdbySell({oSelectedItem:o,inputID:"regionid2"});this.setInputIdbySell({oSelectedItem:d,inputID:"country2"});this.setInputIdbySell({oSelectedItem:t.businessPartnerName,inputID:"pname"});this.filterRegions(t.country_ID,"regionid2");this.setCarrierValue({sCarrier:a,sRecipientName:t.businessPartnerName,sRtrah:t.businessPartnerStreetName,sCap:t.businessPartnerPostalCode,sCity:t.businessPartnerCityName,sProvince:o,sPountry:d,sCountryId:t.country_ID});this.updateAllCarrierDatas();this.closeCarrier()},closeCarrier(){this.byId("carrierDialog").close()},searchCarrier(){var e=this.byId("carrierField").getValue();this.byId("carrierTables").getBinding("rows").changeParameters({$search:e})},selectCountryOne(e){let t=e.getParameter("selectedItem").getKey();this.getView().byId("province").clearSelection();this.filterRegions(t,"province")},selectCountryTwo(e){let t=e.getParameter("selectedItem").getKey();this.getView().byId("regionid2").clearSelection();this.filterRegions(t,"regionid2")},destionationCountryAfterSelect(){let e=this._onValueChangingComboBox("country");this.setShiptoValue({sPountry:e.text,sCountryId:e.id,sProvince:""});this.updateAllShipDatas();console.log(this.getShipToValue())},destionationRegionAfterSelect(){let e=this._onValueChangingComboBox("province");this.setShiptoValue({sProvince:e.text});this.updateAllShipDatas()},shipmentCountryAfterSelect(){let e=this._onValueChangingComboBox("country2");this.setCarrierValue({sPountry:e.text,sCountryId:e.id,sProvince:""});this.updateAllCarrierDatas()},shipmentRegionAfterSelect(){let e=this._onValueChangingComboBox("regionid2");this.setCarrierValue({sProvince:e.text});this.updateAllCarrierDatas()},_onValueChangingComboBox(e){let t=this.getView().byId(e);let i=t.getSelectedItem().getText();let r=t.getSelectedItem().getKey();t.setValue(`${i}(${r})`);return{text:`${i}(${r})`,id:r}},shipAdressAfterchange(e){let t=e.getParameter("value");this.setShiptoValue({sRtrah:t});this.updateAllShipDatas()},shipReciepentNameAfterSelect(e){let t=e.getParameter("value");this.setShiptoValue({sRecipientName:t});this.updateAllShipDatas()},shipPostalCodeUpdate(e){let t=e.getParameter("value");this.setShiptoValue({sCap:t});this.updateAllShipDatas()},shipCityUpdate(e){let t=e.getParameter("value");this.setShiptoValue({sCity:t});this.updateAllShipDatas()},carrierAdressAfterchange(e){let t=e.getParameter("value");this.setCarrierValue({sRtrah:t});this.updateAllCarrierDatas()},carrierReciepentNameAfterSelect(e){let t=e.getParameter("value");this.setCarrierValue({sRecipientName:t});this.updateAllCarrierDatas()},carrierPostalCodeUpdate(e){let t=e.getParameter("value");this.setCarrierValue({sCap:t});this.updateAllCarrierDatas()},carrierCityUpdate(e){let t=e.getParameter("value");this.setCarrierValue({sCity:t});this.updateAllCarrierDatas()},setItemData(e){R=e},getItemData(){return R}})});
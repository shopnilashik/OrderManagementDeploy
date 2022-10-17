sap.ui.define(
    ['sap/m/MessageToast', "sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/core/UIComponent", "derga/ordermanagement/model/formatter", "sap/m/SelectDialog", "sap/m/StandardListItem", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/Fragment",],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.routing.History} History
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     */
    function (MessageToast, Controller, History, UIComponent, formatter, SelectDialog, StandardListItem, Filter, FilterOperator, Fragment) {
        "use strict";
        var allowShip = false;
        let customerCode = null,
            salesOrg = null, disChannel = null, divsionId = null;
        let sShipShipto = "",
            sShipRecipientName = "",
            sShipStrah = "",
            sShipCap = "",
            sShipCity = "",
            sShipProvince = "",
            sShipCountry = "",
            sShipCountryId = ""
            ;
        let sCarrierCarrier = "",
            sCarrierRecipientName = "",
            sCarrierStrah = "",
            sCarrierCap = "",
            sCarrierCity = "",
            sCarrierProvince = "",
            sCarrierCountry = "",
            sCarrierCountryId = ""
            ;
        let item = {};
        return Controller.extend("derga.ordermanagement.controller.BaseController", {
            formatter: formatter,
            getCarrierValue() {
                return {
                    carrier: sCarrierCarrier,
                    recipientName: sCarrierRecipientName,
                    strah: sCarrierStrah,
                    cap: sCarrierCap,
                    city: sCarrierCity,
                    province: sCarrierProvince,
                    country: sCarrierCountry,
                    countryID: sCarrierCountryId
                };
            },
            setCarrierValue({ sCarrier, sRecipientName, sRtrah, sCap, sCity, sProvince, sPountry, sCountryId }) {
                sCarrierCarrier = sCarrier || sCarrierCarrier;
                sCarrierRecipientName = sRecipientName == "" ? "" : sRecipientName || sCarrierRecipientName;
                sCarrierStrah = sRtrah == "" ? "" : sRtrah || sCarrierStrah;
                sCarrierCap = sCap == "" ? "" : sCap || sCarrierCap;
                sCarrierCity = sCity == "" ? "" : sCity || sCarrierCity;
                sCarrierProvince = sProvince==""?"":sProvince || sCarrierProvince;
                sCarrierCountry = sPountry==""?"":sPountry || sCarrierCountry;
                sCarrierCountryId = sCountryId==""?"":sCountryId || sCarrierCountryId;
            },
            setShiptoValue({ sShipto, sRecipientName, sRtrah, sCap, sCity, sProvince, sPountry, sCountryId }) {
                sShipShipto = sShipto || sShipShipto;
                sShipRecipientName = sRecipientName == "" ? "" : sRecipientName || sShipRecipientName;
                sShipStrah = sRtrah == "" ? "" : sRtrah || sShipStrah;
                sShipCap = sCap == "" ? "" : sCap || sShipCap;
                sShipCity = sCity == "" ? "" : sCity || sShipCity;
                sShipProvince = sProvince==""?"":sProvince || sShipProvince;
                sShipCountry = sPountry==""?"":sPountry || sShipCountry;
                sShipCountryId = sCountryId==""?"":sCountryId || sShipCountryId;
            },
            getShipToValue() {
                return {
                    shipto: sShipShipto,
                    recipientName: sShipRecipientName,
                    strah: sShipStrah,
                    cap: sShipCap,
                    city: sShipCity,
                    province: sShipProvince,
                    country: sShipCountry,
                    countryID: sShipCountryId
                };
            },
            getAllowShip() {
                return allowShip;
            },
            allowShip() {
                allowShip = true
            },
            getDivId() { return divsionId },
            getsalesOrg() {
                return salesOrg
            },
            getDisChannel() {
                return disChannel;
            },
            getCustomerCode() {
                return customerCode;
            },
            setCustomerCode(cCode, sOrg, dChannel, dId) {
                customerCode = cCode || "";
                salesOrg = sOrg || "";
                disChannel = dChannel || "";
                divsionId = dId || "";
            },

            /**
             * Convenience method for getting the view model by name in every controller of the application.
             * @public
             * @param {string} sName the model name
             * @returns {sap.ui.model.Model} the model instance
             */
            getModel: function (sName) {

                return this.getView().getModel(sName);
            },

            /**
             * Convenience method for setting the view model in every controller of the application.
             * @public
             * @param {sap.ui.model.Model} oModel the model instance
             * @param {string} sName the model name
             * @returns {sap.ui.core.mvc.View} the view instance
             */
            setModel: function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },

            /**
             * Convenience method for getting the resource bundle.
             * @public
             * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
             */
            getResourceBundle: function () {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            },

            /**
             * Method for navigation to specific view
             * @public
             * @param {string} psTarget Parameter containing the string for the target navigation
             * @param {Object.<string, string>} pmParameters? Parameters for navigation
             * @param {boolean} pbReplace? Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
             */
            navTo: function (psTarget, pmParameters, pbReplace) {
                this.getRouter().navTo(psTarget, pmParameters, pbReplace);
            },

            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },

            onNavBack: function () {
                const sPreviousHash = History.getInstance().getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.back();
                } else {
                    this.getRouter().navTo("appHome", {}, true /* no history*/);
                }
            },
            getLanguge() {
                let l = sap.ui.getCore().getConfiguration().getLanguage();
                let k = l.slice(0, 2).toLowerCase();
                return "'" + k + "'";
            },
            OnSelectDialogOpen: function ({ sPath, sDataPath, sTitle, sSearchPath, sInputId, sDes }) {
                this.oSelectDialog = new SelectDialog({
                    growing: true,
                    growingThreshold: 10,
                    contentHeight: "41%",
                    title: sTitle,
                    noDataText: "No Data found",
                    search: (oEvent) => this._onSearchDialog(oEvent, sSearchPath),
                    confirm: (oEvent) => this._onDialogClose(oEvent, sInputId),
                    showClearButton: true,
                    cancel: (oEvent) => this._onDialogClose(oEvent, sInputId),
                    items: {
                        path: sPath,
                        length: 200,
                        template: new StandardListItem({
                            title: sDataPath,
                            description: sDes
                        }),
                        parameters: { $expand: { texts: {} } }
                    }
                });
                this.getView().addDependent(this.oSelectDialog);
                this.oSelectDialog.open();
            },
            _DefaultFilter() { },
            _onSearchDialog: function (oEvent, sSearchPath) {
                var sValue = oEvent.getParameter("value");
                console.log(sSearchPath)
                console.log(sValue);
                var oFilter = new Filter(sSearchPath, FilterOperator.Contains, sValue);
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
            _onDialogClose: function (oEvent, sInputId) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    oInput = this.byId(sInputId);

                if (!oSelectedItem) {
                    oInput.resetProperty("value");
                    return;
                }

                oInput.setValue(oSelectedItem.getTitle());
            },
            bindTextAndCode(text, code) {
                return `${text}(${code})`;
            },
            _resetSearch(oEvent, fieldName) {
                var oFilter = new Filter(fieldName, FilterOperator.Contains, "");
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },
            setInputIdbySell({ oSelectedItem, inputID }) {

                this.byId(inputID).setValue(oSelectedItem);
            },
            onShipOpen() {
                if (this.getAllowShip()) {
                    var oView = this.getView();
                    if (!this._pValueHelpDialogss) {
                        this._pValueHelpDialogss = Fragment.load({
                            id: oView.getId(),
                            name: "derga.ordermanagement.view.fragments.Ship",
                            controller: this
                        }).then(function (oValueHelpDialog) {
                            oView.addDependent(oValueHelpDialog);
                            return oValueHelpDialog;
                        });
                    }
                    this._pValueHelpDialogss.then(function (oValueHelpDialog) {
                        oValueHelpDialog.open();
                        this._bindShipRows();


                    }.bind(this));
                } else {
                    var message = this.getResourceBundle().getText("header.shiptoError")
                    MessageToast.show(message);
                }
            },
            _bindShipRows() {
                let binding = this.getView().byId("shipTables").getBinding("rows");
                var cbID = new Filter("businessPartner_ID", FilterOperator.EQ, this.getCustomerCode());
                var divID = new Filter("division_ID", FilterOperator.EQ, this.getDivId());
                var disID = new Filter("distributionChannel_ID", FilterOperator.EQ, this.getDisChannel());
                var sID = new Filter("salesOrganization_ID", FilterOperator.EQ, this.getsalesOrg());
                var pi = new Filter("partnerFunction_ID", FilterOperator.EQ, "CO")
                binding.filter([cbID, divID, disID, sID, pi])
            },
            selectShip(oEvent) {
                let selectedCustomer = oEvent.getParameter("rowContext").getObject() || "";
                let oInput = this.byId("selectSheet8");

                let icustomerCode = selectedCustomer.businessPartner_ID;
                let scustomerName = selectedCustomer.businessPartnerName;
                let sCustomerValue = this.bindTextAndCode(scustomerName, icustomerCode);

                let regionId = selectedCustomer.region_ID;
                this.byId("province").setSelectedKey(regionId)
                let regionText = selectedCustomer.regionName;
                let regionValue = this.bindTextAndCode(regionText, regionId);

                let countryId = selectedCustomer.country_ID;
                let countryText = selectedCustomer.countryName;
                let countryValue = this.bindTextAndCode(countryText, countryId);

                oInput.setValue(sCustomerValue);
                this.setInputIdbySell({ oSelectedItem: selectedCustomer.businessPartnerStreetName, inputID: "addressInput" });
                this.setInputIdbySell({ oSelectedItem: selectedCustomer.businessPartnerPostalCode, inputID: "postalCodeText" });
                this.setInputIdbySell({ oSelectedItem: selectedCustomer.businessPartnerCityName, inputID: "cityText" });
                this.setInputIdbySell({ oSelectedItem: regionValue, inputID: "province" });
                this.setInputIdbySell({ oSelectedItem: countryValue, inputID: "country" });
                this.setInputIdbySell({ oSelectedItem: selectedCustomer.businessPartnerName, inputID: "cusName" });
                this.filterRegions(selectedCustomer.country_ID, "province")
                this.setShiptoValue({ sShipto: sCustomerValue, sRecipientName: selectedCustomer.businessPartnerName, sRtrah: selectedCustomer.businessPartnerStreetName, sCap: selectedCustomer.businessPartnerPostalCode, sCity: selectedCustomer.businessPartnerCityName, sProvince: regionValue, sPountry: countryValue, sCountryId: selectedCustomer.country_ID });
                this.updateAllShipDatas();
                this.closeShip();
            },
            closeShip() {
                this.byId("shipDialog").close();
            },
            searchShip() {
                var sValue = this.byId("shipSearchField").getValue();
                this.byId("shipTables").getBinding("rows").changeParameters({ $search: sValue });
            },
            onCarrierOpen() {
                if (this.getAllowShip()) {
                    var oView = this.getView();
                    if (!this._pValueHelpDialogsss) {
                        this._pValueHelpDialogsss = Fragment.load({
                            id: oView.getId(),
                            name: "derga.ordermanagement.view.fragments.Carrier",
                            controller: this
                        }).then(function (oValueHelpDialog) {
                            oView.addDependent(oValueHelpDialog);
                            return oValueHelpDialog;
                        });
                    }
                    this._pValueHelpDialogsss.then(function (oValueHelpDialog) {
                        oValueHelpDialog.open();
                        this._bindCarrier();


                    }.bind(this));
                } else {
                    var message = this.getResourceBundle().getText("header.shiptoError")
                    MessageToast.show(message);
                }
            },
            _bindCarrier() {
                let binding = this.getView().byId("carrierTables").getBinding("rows");

                var cbID = new Filter("businessPartner_ID", FilterOperator.EQ, this.getCustomerCode());
                var divID = new Filter("division_ID", FilterOperator.EQ, this.getDivId());
                var disID = new Filter("distributionChannel_ID", FilterOperator.EQ, this.getDisChannel());
                var sID = new Filter("salesOrganization_ID", FilterOperator.EQ, this.getsalesOrg());
                var pi = new Filter("partnerFunction_ID", FilterOperator.EQ, "DM")
                binding.filter([cbID, divID, disID, sID, pi])
            },
            selectCarrier(oEvent) {
                let selectedCustomer = oEvent.getParameter("rowContext").getObject();
                let oInput = this.byId("selectSheet12");
                
                let icustomerCode = selectedCustomer.businessPartner_ID;
                let scustomerName = selectedCustomer.businessPartnerName;
                let sCustomerValue = this.bindTextAndCode(scustomerName, icustomerCode);
                
                let regionId = selectedCustomer.region_ID;
                this.byId("regionid2").setSelectedKey(regionId)
                let regionText = selectedCustomer.regionName;
                let regionValue = this.bindTextAndCode(regionText, regionId);
                
                let countryId = selectedCustomer.country_ID;
                let countryText = selectedCustomer.countryName;
                let countryValue = this.bindTextAndCode(countryText, countryId);
                
                oInput.setValue(sCustomerValue);
                this.setInputIdbySell({ oSelectedItem: selectedCustomer.businessPartnerStreetName, inputID: "address2" });
                this.setInputIdbySell({ oSelectedItem: selectedCustomer.businessPartnerPostalCode, inputID: "postalCodeText2" });
                this.setInputIdbySell({ oSelectedItem: selectedCustomer.businessPartnerCityName, inputID: "cityText2" });
                this.setInputIdbySell({ oSelectedItem: regionValue, inputID: "regionid2" });
                this.setInputIdbySell({ oSelectedItem: countryValue, inputID: "country2" });
                this.setInputIdbySell({ oSelectedItem: selectedCustomer.businessPartnerName, inputID: "pname" });
                this.filterRegions(selectedCustomer.country_ID, "regionid2");
                this.setCarrierValue({ sCarrier: sCustomerValue, sRecipientName: selectedCustomer.businessPartnerName, sRtrah: selectedCustomer.businessPartnerStreetName, sCap: selectedCustomer.businessPartnerPostalCode, sCity: selectedCustomer.businessPartnerCityName, sProvince: regionValue, sPountry: countryValue, sCountryId: selectedCustomer.country_ID });
                this.updateAllCarrierDatas();
                this.closeCarrier();
            },
            closeCarrier() {
                this.byId("carrierDialog").close();
            },
            searchCarrier() {
                var sValue = this.byId("carrierField").getValue();
                this.byId("carrierTables").getBinding("rows").changeParameters({ $search: sValue });
            },
            selectCountryOne(oEvent) {
                let key = oEvent.getParameter("selectedItem").getKey();

                this.getView().byId("province").clearSelection();
                this.filterRegions(key, "province");
                
            },

            selectCountryTwo(oEvent) {
                let key = oEvent.getParameter("selectedItem").getKey();

                this.getView().byId("regionid2").clearSelection();
                this.filterRegions(key, "regionid2");
                
            },
            destionationCountryAfterSelect() {
                let sCountryValue = this._onValueChangingComboBox("country");
                this.setShiptoValue({ sPountry: sCountryValue.text, sCountryId: sCountryValue.id ,sProvince:""})
                this.updateAllShipDatas();
                console.log(this.getShipToValue());
            },
            destionationRegionAfterSelect() {
                let sRegionValue = this._onValueChangingComboBox("province");
                this.setShiptoValue({ sProvince: sRegionValue.text, })
                this.updateAllShipDatas();

            },
            shipmentCountryAfterSelect() {
                let sCountryValue = this._onValueChangingComboBox("country2")
                this.setCarrierValue({ sPountry: sCountryValue.text, sCountryId: sCountryValue.id ,sProvince:""})
                this.updateAllCarrierDatas();
            },
            shipmentRegionAfterSelect() {
                let sRegionValue = this._onValueChangingComboBox("regionid2");
                this.setCarrierValue({ sProvince: sRegionValue.text, })
                this.updateAllCarrierDatas();
            },
            _onValueChangingComboBox(idInfo) {
                let id = this.getView().byId(idInfo)
                let text = id.getSelectedItem().getText()
                let code = id.getSelectedItem().getKey()
                id.setValue(`${text}(${code})`)
                return { text: `${text}(${code})`, id: code }
            },
            shipAdressAfterchange(oEvent) {
                let sValue = oEvent.getParameter("value");
                this.setShiptoValue({ sRtrah: sValue, })
                this.updateAllShipDatas();
            },
            shipReciepentNameAfterSelect(oEvent) {
                let sValue = oEvent.getParameter("value");
                this.setShiptoValue({ sRecipientName: sValue, })
                this.updateAllShipDatas();
            },
            shipPostalCodeUpdate(oEvent) {
                let sValue = oEvent.getParameter("value");
                this.setShiptoValue({ sCap: sValue, })
                this.updateAllShipDatas();
            },
            shipCityUpdate(oEvent) {
                let sValue = oEvent.getParameter("value");
                this.setShiptoValue({ sCity: sValue, })
                this.updateAllShipDatas();
            },

            carrierAdressAfterchange(oEvent) {
                let sValue = oEvent.getParameter("value");
                this.setCarrierValue({ sRtrah: sValue, })
                this.updateAllCarrierDatas();
            },
            carrierReciepentNameAfterSelect(oEvent) {
                let sValue = oEvent.getParameter("value");
                this.setCarrierValue({ sRecipientName: sValue, })
                this.updateAllCarrierDatas();
            },
            carrierPostalCodeUpdate(oEvent) {
                let sValue = oEvent.getParameter("value");
                this.setCarrierValue({ sCap: sValue, })
                this.updateAllCarrierDatas();
            },
            carrierCityUpdate(oEvent) {
                let sValue = oEvent.getParameter("value");
                this.setCarrierValue({ sCity: sValue, })
                this.updateAllCarrierDatas();
            },
            setItemData(data){
                item = data;
            },
            getItemData(){
                return item;
            },
        });
    }
);
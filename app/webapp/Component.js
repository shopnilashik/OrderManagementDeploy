sap.ui.define(
    ["sap/ui/core/UIComponent", "sap/ui/Device", "derga/ordermanagement/model/models","sap/ui/model/resource/ResourceModel"
],
    /**
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     * @param {typeof sap.ui.Device} Device
     */
    function (UIComponent, Device, models,ResourceModel) {
        "use strict";

        return UIComponent.extend("derga.ordermanagement.Component", {
            metadata: {
                manifest: "json",
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                var i18nModel = new ResourceModel({
                    bundleName: "derga.ordermanagement.i18n.i18n",
                    bundleUrl: "i18n/i18n.properties"
                 });
                 this.setModel(i18nModel, "i18n");
            },
        });
    }
);

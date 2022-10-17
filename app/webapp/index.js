sap.ui.define([
	"sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
	"use strict";

	new ComponentContainer({
		name: "derga.ordermanagement.",
		settings : {
			id : "derga.ordermanagement"
		},
		async: true
	}).placeAt("content");
});
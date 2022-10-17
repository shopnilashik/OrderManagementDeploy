sap.ui.define([
	"sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/m/MessageBox",
], function(Controller,JSONModel,MessageBox) {
	"use strict";
 	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */  
	return Controller.extend("derga.ordermanagement.controller.Notes", {
		onInit:function() {
			var oData = {
				"items":[
				]};
			this.noteType = this.byId("selectnoteType");
			this.note = this.byId("input_Note");
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel, "oDataNote");
			this.noteTypeFlag = false;
			let oSaveBtn = new JSONModel({
				savemode: false,
			 });
			let oTableRow = new JSONModel({
				row:0
			})
			this.getView().setModel(oSaveBtn, "oSaveBtn");
			this.getView().setModel(oTableRow, "oTableRow");
			this.oSaveBtnModel = this.getView().getModel("oSaveBtn");
			this.oTableRownModel = this.getView().getModel("oTableRow");
			this._rowCounter();
		},
		onNoteSaveBtnPress:function(){
			var oModel = this.getView().getModel("oDataNote").getData();
			var data = {
				"noteType":this.noteType.getValue(),
				"note":this.note.getValue()
			}
			if(data){
				oModel.items.push(data);
				this.getView().getModel("oDataNote").setData(oModel);
				this.noteType.setValue("");
				this.note.setValue("");
				this.counter++;
				this._rowCounter();
				this.oSaveBtnModel.setProperty("/savemode", false);
				this.noteTypeFlag = false;
			}
		},
		onNoteDeleteBtnPress:function(oEvent){
			var index =  oEvent.getSource().getParent().getIndex();			
			var oModel = this.getView().getModel("oDataNote").getData();
			oModel.items.splice(index,1);
			this.getView().getModel("oDataNote").setData(oModel);
			this._rowCounter();
		},
		onNoteTypeSelect:function(){
			this.noteTypeFlag = true;
			this._noteInputValidation();
		},
		onNoteInput:function(){
			this._noteInputValidation();
		},
		_noteInputValidation:function(){
			if(this.noteTypeFlag && this.note.getValue().length > 0){
				this.oSaveBtnModel.setProperty("/savemode", true);
			}
			else if(this.noteTypeFlag && this.note.getValue().length < 1){
				this.oSaveBtnModel.setProperty("/savemode", false);
			}
		},
		_rowCounter:function(){
			var oModel = this.getView().getModel("oDataNote").getData();
			let oRowLenght = oModel.items.length; 
			if(oRowLenght < 21)
			this.oTableRownModel.setProperty("/row", oRowLenght);
			if(oRowLenght > 21)
			this.oTableRownModel.setProperty("/row", 21);
		},
	});
});
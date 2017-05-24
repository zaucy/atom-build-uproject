"use babel";

import EventEmitter from "events";
import path from "path";
import fs from "fs";

import {CompositeDisposable} from "atom";

import UAssetEditor from "./uasset-editor.js";
import UAssetEditorView from "./uasset-editor-view.js";

export provideBuilder from "./builder.js";
export provideLinter from "./linter.js";

export function activate() {
	this.subscriptions = new CompositeDisposable();

	this.subscriptions.add(atom.workspace.addOpener( (uri) => {
		let extname = path.extname(uri);

		switch(extname) {
			case ".uasset":
			case ".umap":
				return new UAssetEditor(uri);
		}

	}));

	this.subscriptions.add(atom.views.addViewProvider(UAssetEditor, (ed) => {
		let uassetEditorElement = new UAssetEditorView();
		uassetEditorElement.initialize(ed);
		return uassetEditorElement;
	}));

	this.subscriptions.add(atom.workspace.observePanes( (pane) => {

	}));
}

"use babel";

import fs from "fs";

class UAssetEditorView extends HTMLElement {

	initialize(editor) {
		this.model = editor;
		return this;
	}

}

export default document.registerElement("uasset-editor", UAssetEditorView);

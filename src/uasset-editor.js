"use babel";

import UAssetEditorView from "./uasset-editor-view.js";
import path from "path";

export default class UAssetEditor {
	constructor(uri) {
		const self = this;

		self.uri = uri;
	}

	getTitle() {
		const self = this;
		return path.basename(self.uri);
	}
}

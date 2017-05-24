"use babel";

export default function() {
	return {
		name: 'Example',
		scope: 'file', // or 'project'
		lintsOnChange: false, // or true
		grammarScopes: ['source.cpp'],
		lint(textEditor) {

			if(!atom.packages.isPackageLoaded("build-uproject")) {
				throw `Couldn't find build-uproject`;
				return;
			}

			const editorPath = textEditor.getPath()

			// Note, a Promise may be returned as well!
			return [{
				type: 'Error',
				text: 'Something went wrong',
				range: [[0,0], [0,1]],
				filePath: editorPath
			}]
		}
	}
};

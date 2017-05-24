"use babel";

import EventEmitter from "events";
import fs from "fs";
import path from "path";

import uproject from "uproject";

export default function() {
	return UProjectBuildProviderClass;
}

class UProjectBuildProviderClass extends EventEmitter {

	constructor(cwd) {
		super();
		const self = this;

		self.cwd = cwd;
		self.uproject = uproject.findConfigSync(cwd);
	}

	///////////////////////////////////////////////
	// Build Provider functions below this point //

	getNiceName() {
		const self = this;
		return `Builds Unreal Projects`;
	}

	settings() {
		const self = this;

		return Promise.all([
			self.uproject.getEngineDirectory()
		]).then(
			function(args) {
				let engineDir = args[0];

				var buildExec = path.resolve(
					engineDir,
					"Engine/Binaries/DotNET/UnrealBuildTool"
				);

				function makeBuildAargs(name) {
					return [
						name,
						"Win64",
						"Development",
						self.uproject.path,
						"-waitmutex",
						"-deploy"
					];
				}

				let buildTargets = [];

				self.uproject.getAvailableTargets().forEach(target => {
					let displayName = target.name;

					if(target.configuration !== "Development") {
						displayName += " " + target.configuration;
					}

					buildTargets.push({
						exec: buildExec,
						name: displayName,
						args: [
							target.name,
							target.platform,
							target.configuration,
							self.uproject.path,
							"-waitmutex",
							"-deploy"
						]
					});
				});

				// Sort by display name alphabetically
				buildTargets = buildTargets.sort((a, b) => {
					if(a.name > b.name) return 1;
					if(b.name > a.name) return -1;
					return 0;
				});

				return buildTargets;
			},

			function(errors) {

				if(Array.isArray(errors)) {
					errors = errors.join("\n");
				}

				let panel;
				let div = document.createElement("div");
				div.innerHTML = `
					<h1>Build UProject Errors</h1>
					<pre class="
						white-space: pre-wrap;
						word-break: break-word;
					">${errors}</pre>
					<div style="display:flex; padding-top:8px">
						<div style="flex:auto"></div>
						<button class="btn btn-default icon icon-alert">OK</button>
					</div>
				`;

				let button = div.querySelector("button");

				button.addEventListener("click", () => {
					panel.hide();
					panel.destroy();
				});

				panel = atom.workspace.addModalPanel({
					item: div,
					visible: true
				});

				return new Promise((resolve, reject) => {
					panel.onDidDestroy(() => {
						resolve();
					});
				});
			}
		);
	}

	isEligible() {
		const self = this;

		var entries = fs.readdirSync(self.cwd);
		for(let entry of entries) {
			let extname = path.extname(entry);

			if(extname === ".uproject") {
				return true;
			}
		}

		return false;
	}
};

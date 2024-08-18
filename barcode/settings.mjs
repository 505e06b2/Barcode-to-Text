class Settings {
	#storage_key = "settings";

	symbology = "auto";
	font_size = "large";
	font = "noto-sans";
	theme = "light";

	constructor() {
		this.load();
	}

	load() {
		const settings_string = window.localStorage.getItem(this.#storage_key);
		if(settings_string === null) return;

		let settings_json = {};
		try {
			settings_json = JSON.parse(settings_string);
		} catch {
			console.warn("Unable to parse settings as JSON");
		}

		Object.assign(this, settings_json);
	}

	save(dry_run=false) {
		const settings_string = JSON.stringify(this);
		if(dry_run === false) {
			window.localStorage.setItem(this.#storage_key, settings_string);
		}
		return settings_string;
	}

	toString() {
		return this.save(true);
	}
}

export default new Settings();

import Settings from "./settings.mjs";
import Log from "./log.mjs";
import Barcode from "./barcode.mjs";

const demo_itf_text = "056055"
const problematic_themes = ["dark"];

const elements = {
	"container": document.querySelector('#container'),
	"input": document.querySelector('#data-input'),
	"barcode_container": document.querySelector('#barcode-container'),
	"barcode": document.querySelector('#barcode'),
	"settings": Object.assign({}, ...Array.from(document.querySelectorAll('#settings-container > *[id]'), (x, i) => ({[x.id]: x}))),
	"log_container": document.querySelector('#log-container'),
	"log": document.querySelector('#log'),
	"problematic_theme_warning": document.querySelector('#problematic-theme.warning')
};

window.elements = elements;

elements.container.reset();
window.settings = Settings;
Log.attachToContainer(elements.log);

function generateBarcode(input_string="") {
	Log.clear();

	if(input_string.length === 0) {
		Log.appendWarning("Creating demo barcode as input is empty");
		elements.barcode.innerText = Barcode.itf(demo_itf_text);
	} else {
		try {
			elements.barcode.innerText = Barcode[window.settings.symbology](input_string);
		} catch(e) {
			elements.barcode.innerText = "Error :[";
			Log.appendError(e);
		}
	}

	elements.log_container.scrollTop = elements.log_container.scrollHeight;
}

function setBarcodeClassName(settings) {
	elements.barcode.className = `font-size-${settings.font_size} font-${settings.font} theme-${settings.theme}`;
}

elements.input.oninput = (event) => generateBarcode(event.target.value);
elements.barcode_container.onclick = (event) => {
	const range = document.createRange();
	range.selectNode(event.target);

	window.getSelection().empty();
	window.getSelection().addRange(range);
	const selection_text = window.getSelection()?.toString().trim();
	if(selection_text) navigator.clipboard.writeText(selection_text);
};
elements.settings.symbology.onchange = (event) => window.setTimeout(() => generateBarcode(elements.input.value), 1);
elements.settings.theme.onchange = (event) => {
	if(problematic_themes.includes(event.target.value)) {
		elements.problematic_theme_warning.classList.add("visible");
	} else {
		elements.problematic_theme_warning.classList.remove("visible");
	}
}

for(const key of Object.keys(window.settings)) {
	if(elements.settings[key] === undefined) continue;

	elements.settings[key].addEventListener("change", (event) => {
		window.settings[key] = event.target.value;
		window.settings.save();

		setBarcodeClassName(window.settings);
	});

	elements.settings[key].value = window.settings[key];
	elements.settings[key].dispatchEvent(new Event("change"));
}

generateBarcode();

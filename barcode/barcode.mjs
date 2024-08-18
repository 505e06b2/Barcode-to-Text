import ITF from "./symbologies/itf.mjs";
import Code128 from "./symbologies/code128.mjs";

import Log from "./log.mjs";

const symbologies = [ITF, Code128]; //order of preference

const render_table = {
	"00": "▁",
	"01": "▐",
	"10": "▌",
	"11": "█",
};

function determineOptimalSymbology(input_string) {
	for(const sym of symbologies) {
		if(sym.validate(input_string) === null) { //no errors
			return sym;
		}
	}

	return null;
}

function Barcode(symbology = null) {
	const _render = (base2_string) => {
		if(base2_string.length & 1 !== 0) {
			base2_string += "0";
		}

		const chunk_size = 2;
		const chunks = [];

		for(let i = 0; i < base2_string.length; i += chunk_size) {
			chunks.push(base2_string.slice(i, i + chunk_size));
		}

		const render_buffer = [];
		for(const x of chunks) {
			render_buffer.push(render_table[x]);
		}

		Log.append(`Barcode is ${render_buffer.length} characters long`)

		return render_buffer.join("");
	};

	return (input_string, validate=true) => {
		if(symbology === null) {
			validate = false;

			symbology = determineOptimalSymbology(input_string);
			if(symbology === null) {
				throw `Unable to find a suitable encoder for "${input_string}", select a specific symbology for more details`
			}
		}

		Log.append(`Using ${symbology.name} symbology`);

		return _render(symbology.encode(input_string, validate));
	}
}

export default Object.assign({
	"auto": (input_string) => Barcode()(input_string, false),
	"custom": (enc, input_string) => Barcode(enc)(input_string)
}, Object.fromEntries(symbologies.map(x => [x.name, Barcode(x)])));

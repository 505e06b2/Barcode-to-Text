import Export from "./_export.mjs";
import Log from "../../log.mjs";

//https://en.wikipedia.org/wiki/Interleaved_2_of_5

const interleave_table = [ // 0 = narrow; 1 = wide
	"00110", //0
	"10001", //1
	"01001", //2
	"11000", //3
	"00101", //4
	"10100", //5
	"01100", //6
	"00011", //7
	"10010", //8
	"01010"  //9
];

export function validateITF(input_string) {
	if(typeof(input_string) !== "string") {
		return `Input is not a string`;
	}

	if(input_string.length & 1 !== 0) {
		return `Input length must be a multiple of 2 (got ${input_string.length})`;
	}

	if(input_string.search(/^\d*$/) === -1) {
		return `Input must only contain digits 0-9`;
	}

	return null;
}

export function encodeITF(input_string, validate=true) {
	if(validate) {
		const validation_failure = validateITF(input_string);
		if(validation_failure) {
			throw validation_failure;
		}
	}

	if(input_string.length < 6) {
		Log.appendWarning(`Some scanners are unable to detect itf barcodes with less than 6 characters of data`);
	}

	const chunks = [];

	for(let i = 0; i < input_string.length; i += 2) {
		const current_chunk = {
			"bar": +input_string[i],
			"space": +input_string[i + 1]
		};

		chunks.push(current_chunk);
	}

	const binary_buffer = [];
	for(const chunk of chunks) {
		const bar_pattern = interleave_table[chunk.bar];
		const space_pattern = interleave_table[chunk.space];

		for(let i = 0; i < 5; i++) {
			const bar = bar_pattern[i] === "0" ? ["1"] : ["1", "1"];
			const space = space_pattern[i] === "0" ? ["0"] : ["0", "0"];

			binary_buffer.push(...bar, ...space);
		}
	}

	return "1010" + binary_buffer.join("") + "1101";
}

export default new Export("itf", validateITF, encodeITF);

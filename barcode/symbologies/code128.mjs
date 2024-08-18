import Export from "./_export.mjs";

//https://en.wikipedia.org/wiki/Code_128

const binary_table = [
	"11011001100", //0
	"11001101100", //1
	"11001100110", //2
	"10010011000", //3
	"10010001100", //4
	"10001001100", //5
	"10011001000", //6
	"10011000100", //7
	"10001100100", //8
	"11001001000", //9
	"11001000100", //10
	"11000100100", //11
	"10110011100", //12
	"10011011100", //13
	"10011001110", //14
	"10111001100", //15
	"10011101100", //16
	"10011100110", //17
	"11001110010", //18
	"11001011100", //19
	"11001001110", //20
	"11011100100", //21
	"11001110100", //22
	"11101101110", //23
	"11101001100", //24
	"11100101100", //25
	"11100100110", //26
	"11101100100", //27
	"11100110100", //28
	"11100110010", //29
	"11011011000", //30
	"11011000110", //31
	"11000110110", //32
	"10100011000", //33
	"10001011000", //34
	"10001000110", //35
	"10110001000", //36
	"10001101000", //37
	"10001100010", //38
	"11010001000", //39
	"11000101000", //40
	"11000100010", //41
	"10110111000", //42
	"10110001110", //43
	"10001101110", //44
	"10111011000", //45
	"10111000110", //46
	"10001110110", //47
	"11101110110", //48
	"11010001110", //49
	"11000101110", //50
	"11011101000", //51
	"11011100010", //52
	"11011101110", //53
	"11101011000", //54
	"11101000110", //55
	"11100010110", //56
	"11101101000", //57
	"11101100010", //58
	"11100011010", //59
	"11101111010", //60
	"11001000010", //61
	"11110001010", //62
	"10100110000", //63
	"10100001100", //64
	"10010110000", //65
	"10010000110", //66
	"10000101100", //67
	"10000100110", //68
	"10110010000", //69
	"10110000100", //70
	"10011010000", //71
	"10011000010", //72
	"10000110100", //73
	"10000110010", //74
	"11000010010", //75
	"11001010000", //76
	"11110111010", //77
	"11000010100", //78
	"10001111010", //79
	"10100111100", //80
	"10010111100", //81
	"10010011110", //82
	"10111100100", //83
	"10011110100", //84
	"10011110010", //85
	"11110100100", //86
	"11110010100", //87
	"11110010010", //88
	"11011011110", //89
	"11011110110", //90
	"11110110110", //91
	"10101111000", //92
	"10100011110", //93
	"10001011110", //94
	"10111101000", //95
	"10111100010", //96
	"11110101000", //97
	"11110100010", //98
	"10111011110", //99
	"10111101110", //100
	"11101011110", //101
	"11110101110", //102
	"11010000100", //103 - Start Code A
	"11010010000", //104 - Start Code B
	"11010011100", //105 - Start Code C
	"11000111010", //106 - Stop - Reserved
	"11010111000", //107 - Reverse Stop - Reserved
	"1100011101011" //108 - Stop Pattern
];

export function validateCode128(input_string) {
	if(typeof(input_string) !== "string") {
		return `Input is not a string`;
	}

	for(let i = 0; i < input_string.length; i++) {
		const code = input_string.charCodeAt(i);
		if(code < 32 || code > 126) {
			return `Input must be in printable ASCII`;
		}
	}

	return null;
}

function encodeB(input_string, current_code=null) {
	const start_code = (() => {
		switch(current_code) {
			case "b": return [];
			case "c": return [100]; //swap to B
			default: return [104]; //start code B
		}
	})();
	return start_code.concat(Array.from(input_string).map(x => x.charCodeAt(0) - 32));
}

function encodeC(input_string, current_code=null) {
	if(input_string.length & 1 !== 0) {
		throw `Input length for 128C must be a multiple of 2 (${input_string.length})`;
	}

	const start_code = (() => {
		switch(current_code) {
			case "b": return [99]; //swap to C
			case "c": return [];
			default: return [105]; //start code C
		}
	})();

	const chunk_size = 2;
	const chunks = [];

	for(let i = 0; i < input_string.length; i += chunk_size) {
		chunks.push(parseInt(input_string.slice(i, i + chunk_size), 10));
	}

	return start_code.concat(chunks);
}

function finaliseEncode(int_array) {
	//checksum
	let sum = int_array[0]; //start code has a weight of 1
	for(let i = 1; i < int_array.length; i++) sum += int_array[i] * i;
	int_array.push(sum % 103); //103 is also start code A

	int_array.push(108); //add stop pattern

	return int_array.map(x => binary_table[x]).join("");
}

export function encodeCode128(input_string, validate=true) {
	if(validate) {
		const validation_failure = validateCode128(input_string);
		if(validation_failure) {
			throw validation_failure;
		}
	}

	//special case for when the entire string is 2 digits (code pattern regex doesn't catch it)
	if(input_string.length === 2 && input_string.search(/^\d*$/) === 0) {
		return finaliseEncode(encodeC(input_string));
	}

	const subencoders = {
		"b": encodeB,
		"c": encodeC
	};

	const find_code_patterns_regex = /(?<c>^(?:\d{4}(?:\d{2})*)|(?:\d{4}(?:\d{2})*)(?=$|\D))|(?<b>.)/g;

	let previous_code = null;
	const encoded = [];

	for(const x of input_string.matchAll(find_code_patterns_regex)) {
		const code = x.groups.c ? "c" : "b";

		encoded.push(...subencoders[code](x.groups[code], previous_code));
		previous_code = code;
	}

	return finaliseEncode(encoded);
}

export default new Export("code128", validateCode128, encodeCode128);

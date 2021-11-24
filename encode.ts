import { MAX_STRING_LEN, string2byte, numberTo2Byte } from "./utils";

export function huffman_encode(buffer: ArrayBuffer) {
	const date1 = new Date().getTime();
	let freq = new Array(256).fill(0).map((v, i) => { return { c: [i], v: 0 } });
	const codes = new Array(256).fill(0).map(() => { return "" });
	const bytes = new Uint8Array(buffer);
	for (let i = 0; i < buffer.byteLength; i++) {
		const byte = bytes[i];
		freq[byte].v++
	}

	freq = freq.filter(r => r.v !== 0);
	freq.sort((r1, r2) => { return r2.v - r1.v })

	for (; freq.length > 1;) {
		const smallOne = freq.pop()!;
		const smallTwo = freq.pop()!;
		for (let k = 0; k < smallOne.c.length; k++) {
			codes[smallOne.c[k]] = `0${codes[smallOne.c[k]]}`;
		}
		for (let k = 0; k < smallTwo.c.length; k++) {
			codes[smallTwo.c[k]] = `1${codes[smallTwo.c[k]]}`;
		}

		const mergedSmall = { c: [...smallTwo.c, ...smallOne.c], v: smallTwo.v + smallOne.v }
		const insertIndex = findInsertIndex(freq, mergedSmall);
		freq.splice(insertIndex, 0, mergedSmall);

	}

	const resBytes: number[] = [];
	let bits: string = '';

	function bitsToByte() {
		const byteCount = ((bits.length - (bits.length % 8)) / 8);
		for (let i = 0; i < byteCount; i++) {
			resBytes.push(parseInt(bits.substring((i * 8), (i + 1) * 8), 2));
		}
		bits = bits.substring(byteCount * 8, bits.length)
	}

	function appendLastByte() {
		if (bits.length === 0) {
			resBytes.push(0);
		} else {
			const appended0Count = 8 - bits.length;
			resBytes.push(parseInt(bits, 2));
			resBytes.push(appended0Count);
		}
	}

	for (let i = 0; i < bytes.length; i++) {
		bits = `${bits}${codes[bytes[i]]}`;
		if (bits.length > MAX_STRING_LEN) bitsToByte();
	}

	bitsToByte();
	appendLastByte();
	const header = codes.join(",");
	const bytes4headerLenght = numberTo2Byte(header.length);
	const headerBytes = string2byte(header);

	return [...bytes4headerLenght, ...headerBytes, ...resBytes];

}

function findInsertIndex(arr: any[], row: any) {
	for (let i = arr.length; i > 0; i--) {
		if (arr[i - 1].v >= row.v) {
			return i;
		}
	}
	return 0;
}
export function downloadFile(bytes: number[], filename: string) {
	const blob = new Blob([Uint8Array.from(bytes)], { type: "application/octet-stream" });
	const url = window.URL.createObjectURL(blob)

	const a = document.createElement("a");
	a.style.display = "none";
	a.setAttribute("href", url)
	a.setAttribute("download", filename);
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => { window.URL.revokeObjectURL(url) }, 1000)
}


export function numberTo2Byte(num: number) {
	return [(num - (num % 0xFF)) / 0xFF, num % 0xFF];
}

export function twoByteToNumber(bytes: number[]) {
	return bytes[0] * 0xFF + bytes[1];
}

export function string2byte(str: string) {
	const bytes: number[] = [];
	for (let i = 0; i < str.length; i++) {
		bytes.push(str.charCodeAt(i));
	}
	return bytes;
}

export function byte2string(bytes: Uint8Array) {
	let str = "";
	for (let i = 0; i < bytes.length; i++) {
		str = `${str}${String.fromCharCode(bytes[i])}`;
	}
	return str;
}

export const MAX_STRING_LEN = 1024 * 1024 * 10;
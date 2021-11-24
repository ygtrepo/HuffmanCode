import { MAX_STRING_LEN, byte2string, twoByteToNumber } from "./utils";

export function huffman_decode(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const { mappedCodes, headerLength } = decodeHeader(bytes);

  const resBytes: number[] = [];
  let bits = "";

  function bits2Bytes() {
    let startIndex = 0;
    for (let i = 1; i < (bits.length + 1); i++) {
      const decodedByte = mappedCodes[bits.slice(startIndex, i)]
      if (decodedByte !== undefined) {
        resBytes.push(decodedByte);
        startIndex = i;
      }
    }
    bits = bits.slice(startIndex, bits.length);
  }

  for (let i = headerLength + 2; i < bytes.length - 2; i++) {
    bits = `${bits}${byteto8bitString(bytes[i])}`;
    if (bits.length > MAX_STRING_LEN) bits2Bytes();
  }
  bits = `${bits}${decodeLast2Byte(bytes)}`;
  bits2Bytes();
  return resBytes;
}

function decodeHeader(bytes: Uint8Array) {
  const headerLength = twoByteToNumber([bytes[0], bytes[1]]);
  const headerBytes = bytes.slice(2, headerLength + 2);
  const headerStr = byte2string(headerBytes);
  const codes = headerStr.split(",");
  const mappedCodes: { [key: string]: number } = {};
  for (let i = 0; i < codes.length; i++) {
    mappedCodes[codes[i]] = i
  }
  return { mappedCodes, headerLength };
}

function byteto8bitString(num: number) {
  return num.toString(2).padStart(8, "0");
}

function decodeLast2Byte(bytes: Uint8Array) {
  const lastByte = bytes[bytes.length - 2];
  const infoByte = bytes[bytes.length - 1];
  const lastBits = byteto8bitString(lastByte);
  return lastBits.substring(infoByte, 8)
}
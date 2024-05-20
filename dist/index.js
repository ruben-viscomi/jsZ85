"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Z85 = void 0;
const Z85_ENCODER = Object.freeze([
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D',
    'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', '.', '-', ':', '+', '=', '^', '!', '/',
    '*', '?', '&', '<', '>', '(', ')', '[', ']', '{',
    '}', '@', '%', '$', '#'
]);
class Z85 {
    static encode(data) {
        const sizeRemainder = data.length % 4;
        const requiresPadding = sizeRemainder != 0;
        const padSize = requiresPadding ? 4 - sizeRemainder : 0;
        const normalizedData = requiresPadding
            ? new Uint8Array(data, padSize)
            : data;
        const encodedSize = normalizedData.length * 5 / 4;
        let encoded = "";
        for (let byteCount = 0; byteCount < encodedSize; byteCount += 4) {
            let value = 0;
            value = value * 256 + normalizedData[byteCount];
            value = value * 256 + normalizedData[byteCount + 1];
            value = value * 256 + normalizedData[byteCount + 2];
            value = value * 256 + normalizedData[byteCount + 3];
            encoded += Z85_ENCODER[value / 52200625 % 85];
            encoded += Z85_ENCODER[value / 614125 % 85];
            encoded += Z85_ENCODER[value / 7225 % 85];
            encoded += Z85_ENCODER[value / 85 % 85];
            encoded += Z85_ENCODER[value % 85];
        }
        return encoded.substring(0, encoded.length - padSize);
    }
}
exports.Z85 = Z85;

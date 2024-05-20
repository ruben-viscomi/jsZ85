"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Z85 = void 0;
const Z85_ENCODER = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#";
const Z85_DECODER = Object.freeze([
    0x00, 0x44, 0x00, 0x54, 0x53, 0x52, 0x48, 0x00,
    0x4B, 0x4C, 0x46, 0x41, 0x00, 0x3F, 0x3E, 0x45,
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x40, 0x00, 0x49, 0x42, 0x4A, 0x47,
    0x51, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A,
    0x2B, 0x2C, 0x2D, 0x2E, 0x2F, 0x30, 0x31, 0x32,
    0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A,
    0x3B, 0x3C, 0x3D, 0x4D, 0x00, 0x4E, 0x43, 0x00,
    0x00, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
    0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20,
    0x21, 0x22, 0x23, 0x4F, 0x00, 0x50, 0x00, 0x00,
]);
class Z85 {
    static encode(data) {
        const sizeRemainder = data.length % 4;
        const requiresPadding = sizeRemainder != 0;
        const padSize = requiresPadding ? 4 - sizeRemainder : 0;
        const normalizedData = requiresPadding
            ? allocBytes(data.length + padSize, data)
            : data;
        let encoded = "";
        for (let byteCount = 0; byteCount < normalizedData.length; byteCount += 4) {
            let value = 0;
            value = value * 256 + normalizedData[byteCount];
            value = value * 256 + normalizedData[byteCount + 1];
            value = value * 256 + normalizedData[byteCount + 2];
            value = value * 256 + normalizedData[byteCount + 3];
            encoded += Z85_ENCODER.charAt(value / 52200625 % 85);
            encoded += Z85_ENCODER.charAt(value / 614125 % 85);
            encoded += Z85_ENCODER.charAt(value / 7225 % 85);
            encoded += Z85_ENCODER.charAt(value / 85 % 85);
            encoded += Z85_ENCODER.charAt(value % 85);
        }
        return encoded.substring(0, encoded.length - padSize);
    }
    static decode(data) {
        const lengthRemainder = data.length % 5;
        const requiresPadding = lengthRemainder != 0;
        const padSize = requiresPadding ? 5 - lengthRemainder : 0;
        const decoded = []; // byte[]
        for (let charCount = 0; charCount < data.length; charCount += 5) {
            let value = 0;
            value = value * 85 + Z85_DECODER[data.charCodeAt(charCount) - 32];
            value = value * 85 + Z85_DECODER[data.charCodeAt(charCount + 1) - 32];
            value = value * 85 + (Number.isNaN(data.charCodeAt(charCount + 2)) ? 84 : Z85_DECODER[data.charCodeAt(charCount + 2) - 32]);
            value = value * 85 + (Number.isNaN(data.charCodeAt(charCount + 3)) ? 84 : Z85_DECODER[data.charCodeAt(charCount + 3) - 32]);
            value = value * 85 + (Number.isNaN(data.charCodeAt(charCount + 4)) ? 84 : Z85_DECODER[data.charCodeAt(charCount + 4) - 32]);
            decoded.push(Math.trunc(value / 16777216 % 256), Math.trunc(value / 65536 % 256), Math.trunc(value / 256 % 256), Math.trunc(value % 256));
        }
        for (let idx = 0; idx < padSize; idx++) {
            decoded.pop();
        }
        return new Uint8Array(decoded);
    }
}
exports.Z85 = Z85;
function allocBytes(size, data) {
    const allocated = new Uint8Array(size);
    if (data)
        allocated.set(data);
    return allocated;
}

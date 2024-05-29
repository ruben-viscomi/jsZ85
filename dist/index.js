"use strict";
//  --------------------------------------------------------------------------
//  Reference implementation for rfc.zeromq.org/spec:32/Z85
//
//  This implementation provides a Z85 codec as an easy-to-reuse TypeScript
//  static class.
//  --------------------------------------------------------------------------
//  Copyright (c) 2024 Ruben Viscomi
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//  --------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.Z85 = void 0;
const Z85_ENCODER = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#";
const Z85_DECODER = new Uint8Array([
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
    /**
     * Encode bytes to Z85 (base85) string.
     * @param data the bytes to encode.
     * @returns the encoded data in base85 string (Z85) variant.
     */
    static encode(data) {
        var _a, _b, _c, _d;
        if (data.length < 1)
            return "";
        const sizeRemainder = data.length % 4;
        const padSize = sizeRemainder != 0 ? 4 - sizeRemainder : 0;
        const encodedSize = ((data.length + padSize) * 5 / 4) - padSize;
        let encoded = "";
        let byteCount = 0;
        let charCount = 0;
        const safeUnrolledSize = data.length - 4;
        while (byteCount < safeUnrolledSize) {
            // Accumulate value in base 256 (binary)
            const value = ((data[byteCount] << 24)
                + (data[byteCount + 1] << 16)
                + (data[byteCount + 2] << 8)
                + (data[byteCount + 3])) >>> 0;
            byteCount += 4;
            encoded += Z85_ENCODER.charAt(Math.trunc(value / 52200625));
            encoded += Z85_ENCODER.charAt(Math.trunc(value / 614125) % 85);
            encoded += Z85_ENCODER.charAt(Math.trunc(value / 7225) % 85);
            encoded += Z85_ENCODER.charAt(Math.trunc(value / 85) % 85);
            encoded += Z85_ENCODER.charAt(value % 85);
            charCount += 5;
        }
        const value = ((((_a = data[byteCount]) !== null && _a !== void 0 ? _a : 0) << 24)
            + (((_b = data[byteCount + 1]) !== null && _b !== void 0 ? _b : 0) << 16)
            + (((_c = data[byteCount + 2]) !== null && _c !== void 0 ? _c : 0) << 8)
            + ((_d = data[byteCount + 3]) !== null && _d !== void 0 ? _d : 0)) >>> 0;
        encoded += Z85_ENCODER.charAt(Math.trunc(value / 52200625));
        encoded += Z85_ENCODER.charAt(Math.trunc(value / 614125) % 85);
        if (charCount + 2 < encodedSize) {
            encoded += Z85_ENCODER.charAt(Math.trunc(value / 7225) % 85);
            if (charCount + 3 < encodedSize) {
                encoded += Z85_ENCODER.charAt(Math.trunc(value / 85) % 85);
                if (charCount + 4 < encodedSize)
                    encoded += Z85_ENCODER.charAt(value % 85);
            }
        }
        return encoded;
    }
    /**
     * Decode Z85 (base85) string to bytes.
     * @param data the string to decode.
     * @returns the decoded bytes.
     */
    static decode(data) {
        if (data.length < 1)
            return new Uint8Array(0);
        const lengthRemainder = data.length % 5;
        const padSize = lengthRemainder !== 0 ? 5 - lengthRemainder : 0;
        let charCount = 0;
        let byteCount = 0;
        const decodedSize = ((data.length + padSize) * 4 / 5) - padSize;
        const decoded = new Uint8Array(decodedSize);
        const safeUnrolledSize = data.length - 5;
        while (charCount < safeUnrolledSize) {
            // Accumulate value in base85
            const value = (Z85_DECODER[data.charCodeAt(charCount) - 32] * 52200625)
                + (Z85_DECODER[data.charCodeAt(charCount + 1) - 32] * 614125)
                + (Z85_DECODER[data.charCodeAt(charCount + 2) - 32] * 7225)
                + (Z85_DECODER[data.charCodeAt(charCount + 3) - 32] * 85)
                + Z85_DECODER[data.charCodeAt(charCount + 4) - 32];
            charCount += 5;
            decoded[byteCount] = Math.trunc(value / 16777216) % 256;
            decoded[byteCount + 1] = Math.trunc(value / 65536) % 256;
            decoded[byteCount + 2] = Math.trunc(value / 256) % 256;
            decoded[byteCount + 3] = value % 256;
            byteCount += 4;
        }
        const value = (Z85_DECODER[data.charCodeAt(charCount) - 32] * 52200625)
            + (Z85_DECODER[data.charCodeAt(charCount + 1) - 32] * 614125)
            + ((Number.isNaN(data.charCodeAt(charCount + 2)) ? 84 : Z85_DECODER[data.charCodeAt(charCount + 2) - 32]) * 7225)
            + ((Number.isNaN(data.charCodeAt(charCount + 3)) ? 84 : Z85_DECODER[data.charCodeAt(charCount + 3) - 32]) * 85)
            + (Number.isNaN(data.charCodeAt(charCount + 4)) ? 84 : Z85_DECODER[data.charCodeAt(charCount + 4) - 32]);
        charCount += 5;
        decoded[byteCount] = Math.trunc(value / 16777216) % 256;
        if (byteCount + 1 < decodedSize) {
            decoded[byteCount + 1] = Math.trunc(value / 65536) % 256;
            if (byteCount + 2 < decodedSize) {
                decoded[byteCount + 2] = Math.trunc(value / 256) % 256;
                if (byteCount + 3 < decodedSize)
                    decoded[byteCount + 3] = value % 256;
            }
        }
        return decoded;
    }
}
exports.Z85 = Z85;

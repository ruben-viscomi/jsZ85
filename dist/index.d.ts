export declare class Z85 {
    /**
     * Encode bytes to Z85 (base85) string.
     * @param data the bytes to encode.
     * @returns the encoded data in base85 string (Z85) variant.
     */
    static encode(data: Uint8Array): string;
    /**
     * Decode Z85 (base85) string to bytes.
     * @param data the string to decode.
     * @returns the decoded bytes.
     */
    static decode(data: string): Uint8Array;
}

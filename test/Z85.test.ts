import { describe, it, expect } from "vitest";
import { Z85 } from "../lib";

const ENCODER = new TextEncoder()

function getBytes(str: string): Uint8Array {
    return ENCODER.encode(str)
}

const TESTS: [Uint8Array, string][] = [
    [getBytes("Hello"), "nm=QNzV"],
    [getBytes("Hell"), "nm=QN"],
    [getBytes("Hel"), "nm=P"],
    [getBytes("He"), "nm."],
    [getBytes("H"), "nb"],
    [getBytes(""), ""],
    [getBytes("Hello, World!"), "nm=QNz.92jz/PV8aP"],
    [getBytes("The quick brown 🦊 jumps over 13 lazy 🐶."), "ra]?=ADL#9yAN8bz*c7w[sMOnazM4oAc0duC4CXpf/6}*vs0hw[sL/Je="],
]

describe("Test encoding", () => {
    TESTS.forEach(([bytes, result]) => {
        it(`should encode "${String.fromCharCode(...bytes)}" to "${result}"`, () => {
            expect(Z85.encode(bytes)).toBe(result);
        })
    })
})

describe("Test decoding", () => {
    TESTS.forEach(([result, encoded]) => {
        it(`should decode "${encoded}" to "${String.fromCharCode(...result)}"`, () => {
            expect(String.fromCharCode(...Z85.decode(encoded))).toBe(String.fromCharCode(...result));
        })
    })
})
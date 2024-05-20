"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const lib_1 = require("../lib");
const ENCODER = new TextEncoder();
function getBytes(str) {
    return ENCODER.encode(str);
}
const TESTS = [
    [getBytes("Hello"), "nm=QNzV"],
    [getBytes("Hell"), "nm=QN"],
    [getBytes("Hel"), "nm=P"],
    [getBytes("He"), "nm."],
    [getBytes("H"), "nb"],
    [getBytes(""), ""],
    [getBytes("Hello, World!"), "nm=QNz.92jz/PV8aP"],
    [getBytes("The quick brown 🦊 jumps over 13 lazy 🐶."), "ra]?=ADL#9yAN8bz*c7w[sMOnazM4oAc0duC4CXpf/6}*vs0hw[sL/Je="],
];
(0, vitest_1.describe)("Test encoding", () => {
    TESTS.forEach(([bytes, result]) => {
        (0, vitest_1.it)(`should encode "${String.fromCharCode(...bytes)}" to "${result}"`, () => {
            (0, vitest_1.expect)(lib_1.Z85.encode(bytes)).toBe(result);
        });
    });
});

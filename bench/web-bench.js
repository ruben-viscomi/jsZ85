const BENCH_ID_ENCODING = 0x0;
const BENCH_ID_DECODING = 0x1;
const BENCH_CODEC_NAME_MAP = Object.freeze(["base64", "Z85"]);
const DATA_SIZE_MULTIPLIER = Object.freeze({
    "MB": 1_000_000,
    "KiB": 1_024,
    "KB": 1_000,
    "B": 1,
    "b": 0.125,
});
const TIME_MULTIPLIER = Object.freeze({
    "ns": 0.000001,
    "µs": 0.001,
    "ms": 1,
    "s": 1_000,
    "m": 60_000,
});

function formatTime(millis, precision = 3) {
    const reversedTimeMap = Object.entries(TIME_MULTIPLIER)
        .reduce((map, [unit, mul]) => {
            map[mul] = unit;
            return map;
        }, {});

    const orderedUnitMultipliers = Object.values(TIME_MULTIPLIER).sort().reverse();
    for (const unitMul of orderedUnitMultipliers) {
        const label = reversedTimeMap[unitMul];
        if (!label) continue;
        const convertedSize = millis / unitMul;
        if (convertedSize < 1) continue;
        return convertedSize.toFixed(precision) + label;
    }
    return millis + "ms";
}

function formatDataSize(byteSize, precision = 2) {
    const reversedSizeMap = Object.entries(DATA_SIZE_MULTIPLIER)
        .filter(([unit, mul]) => mul % 10 === 0)
        .reduce((map, [unit, mul]) => {
            map[mul] = unit;
            return map;
        }, {});
    const orderedUnitMultipliers = Object.values(DATA_SIZE_MULTIPLIER).sort().reverse();
    for (const unitMul of orderedUnitMultipliers) {
        const label = reversedSizeMap[unitMul];
        if (!label) continue;
        const convertedSize = byteSize / unitMul;
        if (convertedSize < 1) continue;
        return convertedSize.toFixed(precision) + label;
    }
    return byteSize + "b";
}

async function encodeAndDecodeB64(bytes) {
    const res = new Array(2);
    let start = performance.now();
    let encoded = btoa(bytes);
    res[0] = performance.now() - start;
    start = performance.now();
    atob(encoded);
    res[1] = performance.now() - start;
    return res;
}

async function encodeAndDecodeZ85(bytes) {
    const res = new Array(2);
    let start = performance.now();
    let encoded = Z85.encode(bytes);
    res[0] = performance.now() - start;
    start = performance.now();
    Z85.decode(encoded);
    res[1] = performance.now() - start;
    return res;
}

function printBenchResults(benches, precision = 5) {
    const table = new Array(2);
    for (let i = 0; i < benches.length; i++) {
        const bench = benches[i];
        const codec = BENCH_CODEC_NAME_MAP[i];
        const { bytes } = bench;
        const [encTotal, decTotal] = bench.benches.reduce(
            (sum, curr) => {
                sum[BENCH_ID_ENCODING] += curr[BENCH_ID_ENCODING];
                sum[BENCH_ID_DECODING] += curr[BENCH_ID_DECODING];
                return sum;
            }, [0, 0]);

        const numberOfBenchRuns = bench.benches.length;
        const timeElapsedToEncodeAllRuns = formatTime(encTotal.toFixed(precision));
        const timeElapsedToDecodeAllRuns = formatTime(decTotal.toFixed(precision));
        const averageTimeElapsedToEncode = formatTime((encTotal / numberOfBenchRuns).toFixed(precision));
        const averageTimeElapsedToDecode = formatTime((decTotal / numberOfBenchRuns).toFixed(precision));
        const inputSize = formatDataSize(bytes);

        table[i] = {
            codec,
            numberOfBenchRuns,
            inputSize,
            averageTimeElapsedToEncode,
            averageTimeElapsedToDecode,
            timeElapsedToEncodeAllRuns,
            timeElapsedToDecodeAllRuns,
        }
    }
    const tableEl = document.createElement("table");
    const headerRow = document.createElement("tr");
    const cols = [
        "codec",
        "numberOfBenchRuns",
        "inputSize",
        "averageTimeElapsedToEncode",
        "averageTimeElapsedToDecode",
        "timeElapsedToEncodeAllRuns",
        "timeElapsedToDecodeAllRuns",
    ];
    for (const col of cols) {
        const thEl = document.createElement("th");
        thEl.textContent = col;
        headerRow.appendChild(thEl);
    }
    tableEl.appendChild(headerRow);

    for (const row of table) {
        const tRow = document.createElement("tr");
        for (const col of cols) {
            const colData = row[col];
            const tData = document.createElement("td");
            tData.textContent = colData;
            tRow.appendChild(tData);
        }
        tableEl.appendChild(tRow);
    }
    document.body.appendChild(tableEl);
}

async function sequentialStringEncodeDecode(str, n) {
    const bytes = Uint8Array.from(str);
    const b64Results = new Array(n);
    const z85Results = new Array(n);
    for (let i = 0; i < n; i++) {
        b64Results[i] = encodeAndDecodeB64(bytes);
        z85Results[i] = encodeAndDecodeZ85(bytes);
    }
    return [
        {
            name: sequentialStringEncodeDecode.name,
            bytes: bytes.length,
            benches: await Promise.all(b64Results),
        },
        {
            name: sequentialStringEncodeDecode.name,
            bytes: bytes.length,
            benches: await Promise.all(z85Results),
        }
    ];
}

async function dataChunkEncodeDecode(sizeInfo, n) {
    const { unit, amount } = sizeInfo;
    const unitMultiplier = DATA_SIZE_MULTIPLIER[unit];
    if (!unitMultiplier)
        throw Error(`The size unit "${unit}" is not supported. Please use one amongst: ${Object.keys(DATA_SIZE_MULTIPLIER).join(", ")}`);
    const byteSize = amount * unitMultiplier;
    if (byteSize > 300 * DATA_SIZE_MULTIPLIER["MB"])
        throw TypeError("The encoded string will potentially be greater than 512MB, the maximum allowed size by the strictest EcmaScript engine.");

    const bytes = new Uint8Array(byteSize).fill("a".codePointAt(0));
    const b64Results = new Array(n);
    const z85Results = new Array(n);
    for (let i = 0; i < n; i++) {
        b64Results[i] = encodeAndDecodeB64(bytes);
        z85Results[i] = encodeAndDecodeZ85(bytes);
    }
    return [
        {
            name: dataChunkEncodeDecode.name,
            bytes: bytes.length,
            benches: await Promise.all(b64Results),
        },
        {
            name: dataChunkEncodeDecode.name,
            bytes: bytes.length,
            benches: await Promise.all(z85Results),
        }
    ];
}

sequentialStringEncodeDecode("The quick brown 🦊 jumps over 13 lazy 🐶.", 5).then(printBenchResults);
dataChunkEncodeDecode({ amount: 1, unit: "KB" }, 5).then(printBenchResults);
dataChunkEncodeDecode({ amount: 10, unit: "KB" }, 5).then(printBenchResults);
dataChunkEncodeDecode({ amount: 100, unit: "KB" }, 5).then(printBenchResults);
dataChunkEncodeDecode({ amount: 500, unit: "KB" }, 5).then(printBenchResults);
dataChunkEncodeDecode({ amount: 1, unit: "MB" }, 5).then(printBenchResults);
dataChunkEncodeDecode({ amount: 10, unit: "MB" }, 5).then(printBenchResults);
dataChunkEncodeDecode({ amount: 100, unit: "MB" }, 5).then(printBenchResults);
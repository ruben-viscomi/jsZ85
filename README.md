# jsZ85
jsZ85 provides an implementation of the Z85 codec following the [zeromq rfc](https://rfc.zeromq.org/spec/32/).

## Performance
This implementation of the Z85 codec has been measured against [Node's buffer API](https://nodejs.org/api/buffer.html)
and Web API's [btoa](https://developer.mozilla.org/en-US/docs/Web/API/btoa) and [atob](https://developer.mozilla.org/en-US/docs/Web/API/atob).

The performance have been measured through `performance.now()` and scaled to nanoseconds.
The benchmark consisted into taking the total time to encode 1.000.000 times the string "The quick brown 🦊 jumps over 13 lazy 🐶." for both Z85 and Base64.
The same has been done for decoding.

### Node runtime
#### encoding
~85% slower than the node native solution [`data.toString("base64")`](https://nodejs.org/api/buffer.html#buftostringencoding-start-end).
#### decoding
~4% faster than the node native solution [`Buffer.from(data, "base64")`](https://nodejs.org/api/buffer.html#static-method-bufferfromstring-encoding).

### Browser benchmark
#### encoding
- firefox (SpiderMonkey): ~15% faster than `btoa(data)`.\n
- chrome (v8): ~0.9% slower than `btoa(data)`.
#### decoding:
- firefox (SpiderMonkey): ~4% slower than `atob(data)`.\n
- chrome (v8): ~80% slower than `atob(data)`.

### Remarks on the results
It is worth noticing, however, that the time has been measured in nano-seconds and for real world applications, such delta for both encoding and decoding is kind of negligible.\
For both codecs, in fact, roughly 78MB worth of data have been digested in roughly 2s for the worst case (which is slow, but considering JavaScript architecture, it can actually be considered pretty fast).

Performance-wise such operations in JavaScript are limited due to the internal implementation of "strings", which are actually ropes (potentially faster insertions, but slower reads).\
In certain occasions, the native algorithms are actually C++ bindings, so very hard to compete with by using plain JavaScript.

Please note that even though base 85 allows saving more space than base 64, it might not be the best choice for certain use cases (i.e. url encoding).

## Examples
```typescript
function getBytes(str: string): Uint8Array {
    return new TextEncoder().encode(str)
}

const toEncode = "Hello, World!";

// ENCODING EXAMPLE
const encoded = Z85.encode(getBytes(toEncode));
console.log(encoded); // Outputs: nm=QNz.92jz/PV8aP

// DECODING EXAMPLE
const decoded = Z85.decode(encoded);
console.log(String.fromCharCode(...decoded)); // Outputs: Hello, World!
```

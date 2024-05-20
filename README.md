# jsZ85
jsZ85 provides an implementation of the Z85 codec following the [zeromq rfc](https://rfc.zeromq.org/spec/32/).

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

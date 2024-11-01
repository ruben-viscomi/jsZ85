# jsZ85

jsZ85 provides an implementation of the Z85 codec following the [zeromq rfc](https://rfc.zeromq.org/spec/32/).

## Examples

```typescript
function getBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

const toEncode = "Hello, World!";

// ENCODING EXAMPLE
const encoded = Z85.encode(getBytes(toEncode));
console.log(encoded); // Outputs: nm=QNz.92jz/PV8aP

// DECODING EXAMPLE
const decoded = Z85.decode(encoded);
console.log(String.fromCharCode(...decoded)); // Outputs: Hello, World!
```

## Benchmarks

Following the results on my machine of the benchmarks found in the `bench` folder.

### Node.js (Buffer base64 vs. Z85)

```bash
┌─────────┬──────────┬───────────────────┬───────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┐
│ (index) │ codec    │ numberOfBenchRuns │ inputSize │ averageTimeElapsedToEncode │ averageTimeElapsedToDecode │ timeElapsedToEncodeAllRuns │ timeElapsedToDecodeAllRuns │
├─────────┼──────────┼───────────────────┼───────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┤
│ 0       │ 'base64' │ 5                 │ '39b'     │ '43.480µs'                 │ '13.560µs'                 │ '217.400µs'                │ '67.800µs'                 │
│ 1       │ 'Z85'    │ 5                 │ '39b'     │ '35.640µs'                 │ '44.540µs'                 │ '178.200µs'                │ '222.700µs'                │
└─────────┴──────────┴───────────────────┴───────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┘
┌─────────┬──────────┬───────────────────┬───────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┐
│ (index) │ codec    │ numberOfBenchRuns │ inputSize │ averageTimeElapsedToEncode │ averageTimeElapsedToDecode │ timeElapsedToEncodeAllRuns │ timeElapsedToDecodeAllRuns │
├─────────┼──────────┼───────────────────┼───────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┤
│ 0       │ 'base64' │ 5                 │ '1.00KB'  │ '3.960µs'                  │ '5.700µs'                  │ '19.800µs'                 │ '28.500µs'                 │
│ 1       │ 'Z85'    │ 5                 │ '1.00KB'  │ '64.580µs'                 │ '59.800µs'                 │ '322.900µs'                │ '299.000µs'                │
└─────────┴──────────┴───────────────────┴───────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┘
┌─────────┬──────────┬───────────────────┬───────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┐
│ (index) │ codec    │ numberOfBenchRuns │ inputSize │ averageTimeElapsedToEncode │ averageTimeElapsedToDecode │ timeElapsedToEncodeAllRuns │ timeElapsedToDecodeAllRuns │
├─────────┼──────────┼───────────────────┼───────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┤
│ 0       │ 'base64' │ 5                 │ '10.00KB' │ '32.600µs'                 │ '36.560µs'                 │ '163.000µs'                │ '182.800µs'                │
│ 1       │ 'Z85'    │ 5                 │ '10.00KB' │ '1.377ms'                  │ '1.210ms'                  │ '6.886ms'                  │ '6.049ms'                  │
└─────────┴──────────┴───────────────────┴───────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┘
┌─────────┬──────────┬───────────────────┬────────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┐
│ (index) │ codec    │ numberOfBenchRuns │ inputSize  │ averageTimeElapsedToEncode │ averageTimeElapsedToDecode │ timeElapsedToEncodeAllRuns │ timeElapsedToDecodeAllRuns │
├─────────┼──────────┼───────────────────┼────────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┤
│ 0       │ 'base64' │ 5                 │ '100.00KB' │ '182.080µs'                │ '243.120µs'                │ '910.400µs'                │ '1.216ms'                  │
│ 1       │ 'Z85'    │ 5                 │ '100.00KB' │ '4.706ms'                  │ '668.220µs'                │ '23.528ms'                 │ '3.341ms'                  │
└─────────┴──────────┴───────────────────┴────────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┘
┌─────────┬──────────┬───────────────────┬────────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┐
│ (index) │ codec    │ numberOfBenchRuns │ inputSize  │ averageTimeElapsedToEncode │ averageTimeElapsedToDecode │ timeElapsedToEncodeAllRuns │ timeElapsedToDecodeAllRuns │
├─────────┼──────────┼───────────────────┼────────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┤
│ 0       │ 'base64' │ 5                 │ '500.00KB' │ '517.120µs'                │ '1.340ms'                  │ '2.586ms'                  │ '6.702ms'                  │
│ 1       │ 'Z85'    │ 5                 │ '500.00KB' │ '15.727ms'                 │ '3.849ms'                  │ '78.637ms'                 │ '19.247ms'                 │
└─────────┴──────────┴───────────────────┴────────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┘
┌─────────┬──────────┬───────────────────┬───────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┐
│ (index) │ codec    │ numberOfBenchRuns │ inputSize │ averageTimeElapsedToEncode │ averageTimeElapsedToDecode │ timeElapsedToEncodeAllRuns │ timeElapsedToDecodeAllRuns │
├─────────┼──────────┼───────────────────┼───────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┤
│ 0       │ 'base64' │ 5                 │ '1.00MB'  │ '295.800µs'                │ '1.587ms'                  │ '1.479ms'                  │ '7.937ms'                  │
│ 1       │ 'Z85'    │ 5                 │ '1.00MB'  │ '36.169ms'                 │ '6.690ms'                  │ '180.846ms'                │ '33.448ms'                 │
└─────────┴──────────┴───────────────────┴───────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┘
┌─────────┬──────────┬───────────────────┬───────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┐
│ (index) │ codec    │ numberOfBenchRuns │ inputSize │ averageTimeElapsedToEncode │ averageTimeElapsedToDecode │ timeElapsedToEncodeAllRuns │ timeElapsedToDecodeAllRuns │
├─────────┼──────────┼───────────────────┼───────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┤
│ 0       │ 'base64' │ 5                 │ '10.00MB' │ '3.596ms'                  │ '18.039ms'                 │ '17.978ms'                 │ '90.196ms'                 │
│ 1       │ 'Z85'    │ 5                 │ '10.00MB' │ '619.946ms'                │ '81.798ms'                 │ '3.100s'                   │ '408.990ms'                │
└─────────┴──────────┴───────────────────┴───────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┘
┌─────────┬──────────┬───────────────────┬────────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┬────────────────────────────┐
│ (index) │ codec    │ numberOfBenchRuns │ inputSize  │ averageTimeElapsedToEncode │ averageTimeElapsedToDecode │ timeElapsedToEncodeAllRuns │ timeElapsedToDecodeAllRuns │
├─────────┼──────────┼───────────────────┼────────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┤
│ 0       │ 'base64' │ 5                 │ '100.00MB' │ '81.588ms'                 │ '218.865ms'                │ '407.941ms'                │ '1.094s'                   │
│ 1       │ 'Z85'    │ 5                 │ '100.00MB' │ '7.420s'                   │ '836.813ms'                │ '37.098s'                  │ '4.184s'                   │
└─────────┴──────────┴───────────────────┴────────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┴────────────────────────────┘
```

### Chrome - V8 engine (btoa/atob base64 vs. Z85)

<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>39b</td>
        <td>20.000µs</td>
        <td>20.000µs</td>
        <td>100.000µs</td>
        <td>100.000µs</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>39b</td>
        <td>80.000µs</td>
        <td>40.000µs</td>
        <td>400.000µs</td>
        <td>200.000µs</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>1.00KB</td>
        <td>60.000µs</td>
        <td>0.00000ms</td>
        <td>300.000µs</td>
        <td>0.00000ms</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>1.00KB</td>
        <td>120.000µs</td>
        <td>100.000µs</td>
        <td>600.000µs</td>
        <td>500.000µs</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>10.00KB</td>
        <td>200.000µs</td>
        <td>40.000µs</td>
        <td>1.000ms</td>
        <td>200.000µs</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>10.00KB</td>
        <td>800.000µs</td>
        <td>260.000µs</td>
        <td>4.000ms</td>
        <td>1.300ms</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>100.00KB</td>
        <td>2.060ms</td>
        <td>540.000µs</td>
        <td>10.300ms</td>
        <td>2.700ms</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>100.00KB</td>
        <td>6.140ms</td>
        <td>1.680ms</td>
        <td>30.700ms</td>
        <td>8.400ms</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>500.00KB</td>
        <td>7.480ms</td>
        <td>2.000ms</td>
        <td>37.400ms</td>
        <td>10.000ms</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>500.00KB</td>
        <td>12.960ms</td>
        <td>3.980ms</td>
        <td>64.800ms</td>
        <td>19.900ms</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>1.00MB</td>
        <td>13.580ms</td>
        <td>3.820ms</td>
        <td>67.900ms</td>
        <td>19.100ms</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>1.00MB</td>
        <td>30.020ms</td>
        <td>7.440ms</td>
        <td>150.100ms</td>
        <td>37.200ms</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>10.00MB</td>
        <td>306.140ms</td>
        <td>94.060ms</td>
        <td>1.531s</td>
        <td>470.300ms</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>10.00MB</td>
        <td>911.360ms</td>
        <td>181.060ms</td>
        <td>4.557s</td>
        <td>905.300ms</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>100.00MB</td>
        <td>3.495s</td>
        <td>1.057s</td>
        <td>17.477s</td>
        <td>5.284s</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>100.00MB</td>
        <td>9.482s</td>
        <td>1.796s</td>
        <td>47.413s</td>
        <td>8.979s</td>
    </tr>
</table>

### Firefox - SpiderMonkey engine (btoa/atob base64 vs. Z85)

<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>39b</td>
        <td>0.00000ms</td>
        <td>0.00000ms</td>
        <td>0.00000ms</td>
        <td>0.00000ms</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>39b</td>
        <td>0.00000ms</td>
        <td>0.00000ms</td>
        <td>0.00000ms</td>
        <td>0.00000ms</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>1.00KB</td>
        <td>0.00000ms</td>
        <td>200.000µs</td>
        <td>0.00000ms</td>
        <td>1.000ms</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>1.00KB</td>
        <td>0.00000ms</td>
        <td>200.000µs</td>
        <td>0.00000ms</td>
        <td>1.000ms</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>10.00KB</td>
        <td>1.000ms</td>
        <td>0.00000ms</td>
        <td>5.000ms</td>
        <td>0.00000ms</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>10.00KB</td>
        <td>400.000µs</td>
        <td>0.00000ms</td>
        <td>2.000ms</td>
        <td>0.00000ms</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>100.00KB</td>
        <td>7.400ms</td>
        <td>1.400ms</td>
        <td>37.000ms</td>
        <td>7.000ms</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>100.00KB</td>
        <td>3.200ms</td>
        <td>2.600ms</td>
        <td>16.000ms</td>
        <td>13.000ms</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>500.00KB</td>
        <td>34.200ms</td>
        <td>3.200ms</td>
        <td>171.000ms</td>
        <td>16.000ms</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>500.00KB</td>
        <td>11.200ms</td>
        <td>8.000ms</td>
        <td>56.000ms</td>
        <td>40.000ms</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>1.00MB</td>
        <td>52.400ms</td>
        <td>5.600ms</td>
        <td>262.000ms</td>
        <td>28.000ms</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>1.00MB</td>
        <td>16.000ms</td>
        <td>15.000ms</td>
        <td>80.000ms</td>
        <td>75.000ms</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>10.00MB</td>
        <td>850.400ms</td>
        <td>74.600ms</td>
        <td>4.252s</td>
        <td>373.000ms</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>10.00MB</td>
        <td>258.800ms</td>
        <td>132.600ms</td>
        <td>1.294s</td>
        <td>663.000ms</td>
    </tr>
</table>
<table>
    <tr>
        <th>codec</th>
        <th>numberOfBenchRuns</th>
        <th>inputSize</th>
        <th>averageTimeElapsedToEncode</th>
        <th>averageTimeElapsedToDecode</th>
        <th>timeElapsedToEncodeAllRuns</th>
        <th>timeElapsedToDecodeAllRuns</th>
    </tr>
    <tr>
        <td>base64</td>
        <td>5</td>
        <td>100.00MB</td>
        <td>8.463s</td>
        <td>759.800ms</td>
        <td>42.316s</td>
        <td>3.799s</td>
    </tr>
    <tr>
        <td>Z85</td>
        <td>5</td>
        <td>100.00MB</td>
        <td>2.762s</td>
        <td>1.194s</td>
        <td>13.809s</td>
        <td>5.971s</td>
    </tr>
</table>

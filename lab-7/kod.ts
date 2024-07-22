const encodeHamming74 = (data: string): string => {
    if (data.length !== 4) throw new Error('Input data must be 4 bits long');
    let d = data.split('').map(Number);
    let p1 = d[0] ^ d[1] ^ d[3];
    let p2 = d[0] ^ d[2] ^ d[3];
    let p3 = d[1] ^ d[2] ^ d[3];
    return [p1, p2, d[0], p3, d[1], d[2], d[3]].join('');
}

let encoded = encodeHamming74('1011');
console.log('Encoded:', encoded);

const decodeHamming74 = (data: string) => {
    if (data.length !== 7) throw new Error('Encoded data must be 7 bits long');
    let d = data.split('').map(Number);
    let p1 = d[0] ^ d[2] ^ d[4] ^ d[6];
    let p2 = d[1] ^ d[2] ^ d[5] ^ d[6];
    let p3 = d[3] ^ d[4] ^ d[5] ^ d[6];
    let errorPosition = p1 + (p2 << 1) + (p3 << 2);
    if (errorPosition !== 0) {
        d[errorPosition - 1] = d[errorPosition - 1] ^ 1;
    }
    let originalData = [d[2], d[4], d[5], d[6]].join('');
    return { correctedData: d.join(''), originalData };
}

let decoded = decodeHamming74('1110110'); 
console.log('Decoded:', decoded);

const generateGMatrix = (): number[][] => {
    let I = [...Array(11)].map((_, i) => [...Array(11)].map((_, j) => (i === j ? 1 : 0)));
    let P = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
        [1, 1, 0, 0],
        [1, 0, 1, 0],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [0, 1, 0, 1],
        [0, 0, 1, 1],
        [1, 1, 1, 0]
    ];
    return I.map((row, i) => row.concat(P[i]));
}

const generateHMatrix = (): number[][] => {
    let I = [...Array(4)].map((_, i) => [...Array(4)].map((_, j) => (i === j ? 1 : 0)));
    let P = [
        [1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0],
        [0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1],
        [0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1]
    ];
    return P.concat(I);
}

const modulate = (data: string, type: string): number[] => {
    if (type === 'ASK') {
        return data.split('').map(bit => bit === '1' ? 1 : 0);
    } else if (type === 'FSK') {
        return data.split('').map(bit => bit === '1' ? 1 : 0);
    } else if (type === 'PSK') {
        return data.split('').map(bit => bit === '1' ? 1 : 0);
    } else return [];
}

const demodulate = (signal: number[], type: string): string[] => {
    if (type === 'ASK') {
        return signal.map(level => level >= 0.75 ? '1' : '0');
    } else if (type === 'FSK') {
        return signal.map(freq => freq >= 1.5 ? '1' : '0');
    } else if (type === 'PSK') {
        return signal.map(phase => phase >= Math.PI / 2 ? '1' : '0');
    } else return [];
}

const transmit = (encodedSignal: string, errorRate: number = 0.01): string => {
    return encodedSignal.split('').map(bit => {
        if (Math.random() < errorRate) {
            return bit === '1' ? '0' : '1';
        }
        return bit;
    }).join('');
}

const simulateTransmission = (inputData: string, modulationType: string, errorRate: number = 0.1): string => {
    let encodedData: string | undefined, decodedData: string | undefined;
    encodedData = encodeHamming74(inputData);

    console.log('Encoded Data:', encodedData);

    const modulatedSignal = modulate(encodedData!, modulationType);
    console.log('Modulated Signal:', modulatedSignal);

    const transmittedSignal = transmit(modulatedSignal.map(String).join(''), errorRate).split('').map(Number);
    console.log('Transmitted Signal:', transmittedSignal);

    const demodulatedData = demodulate(transmittedSignal, modulationType).join('');
    console.log('Demodulated Data:', demodulatedData);

    decodedData = decodeHamming74(demodulatedData).originalData;
   

    return decodedData;
}

const inputData = '1011';
const modulationType = 'ASK';
const outputData = simulateTransmission(inputData, modulationType);

console.log('Input Data:', inputData);
console.log('Output Data:', outputData);

const modulationTypes = ['ASK', 'FSK', 'PSK'];
modulationTypes.forEach(modType => {
    const output = simulateTransmission(inputData, modType);
    console.log(`Output Data with ${modType}:`, output);
});

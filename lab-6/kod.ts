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

const decodeHamming74 = (data: string): { correctedData: string, originalData: string } => {
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

const encodeHamming1511 = (data: string): string => {
    if (data.length !== 11) throw new Error('Input data must be 11 bits long');

    let G = generateGMatrix();

    let d = data.split('').map(Number);

    let encoded = new Array(15).fill(0);

    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 15; j++) {
            encoded[j] ^= d[i] * G[i][j];
        }
    }

    return encoded.join('');
}

let encoded1511 = encodeHamming1511('10111011100');
console.log('Encoded (15,11):', encoded1511);

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

const decodeHamming1511 = (data: string): { correctedData: string, originalData: string } => {
    if (data.length !== 15) throw new Error('Encoded data must be 15 bits long');

    let H = generateHMatrix();

    let d = data.split('').map(Number);

    let syndrome = new Array(4).fill(0);

    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 4; j++) {
            syndrome[j] ^= d[i] * H[j][i];
        }
    }

    let errorPosition = parseInt(syndrome.join(''), 2);

    if (errorPosition !== 0) {
        d[errorPosition - 1] ^= 1;
    }

    let originalData = d.slice(0, 11).join('');
    return { correctedData: d.join(''), originalData };
}

let decoded1511 = decodeHamming1511('110111001011110');
console.log('Decoded (15,11):', decoded1511);

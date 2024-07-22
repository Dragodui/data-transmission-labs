let ctx = document.getElementById('canvas');

const generateBinaryStream = (length: number): number[] => {
  return [0, 0, 1, 1, 0, 1, 0, 0, 0, 1];
};

// Generate ASK modulated signal
const generateAskModulatedSignal = (
  binaryStream: number[],
  A1: number,
  A2: number,
  fn: number,
  Tb: number,
  fs = 2000,
): { t: number[]; modulatedSignal: number[] } => {
  const duration = binaryStream.length * Tb;
  const N = Math.floor(duration * fs);
  const M = Math.floor(N / 10);

  const t = Array.from({ length: N }, (_, i) => (i * duration) / N);
  const modulatedSignal = new Array(N).fill(0);

  for (let m = 0; m < M; m++) {
    const bitIndex = Math.floor((m * binaryStream.length) / M);
    const bit = binaryStream[bitIndex];
    const startIndex = Math.floor((m * N) / M);
    const endIndex = Math.floor(((m + 1) * N) / M);

    for (let i = startIndex; i < endIndex; i++) {
      modulatedSignal[i] =
        bit === 0
          ? A1 * Math.sin(2 * Math.PI * fn * t[i])
          : A2 * Math.sin(2 * Math.PI * fn * t[i]);
    }
  }

  return { t, modulatedSignal };
};

// Generate PSK modulated signal
const generatePskModulatedSignal = (
  binaryStream: number[],
  fn: number,
  Tb: number,
  fs = 2000,
): { t: number[]; modulatedSignal: number[] } => {
  const duration = binaryStream.length * Tb;
  const N = Math.floor(duration * fs);
  const M = Math.floor(N / 10);

  const t = Array.from({ length: N }, (_, i) => (i * duration) / N);
  const modulatedSignal = new Array(N).fill(0);

  for (let m = 0; m < M; m++) {
    const bitIndex = Math.floor((m * binaryStream.length) / M);
    const bit = binaryStream[bitIndex];
    const startIndex = Math.floor((m * N) / M);
    const endIndex = Math.floor(((m + 1) * N) / M);

    for (let i = startIndex; i < endIndex; i++) {
      modulatedSignal[i] =
        bit === 0
          ? Math.sin(2 * Math.PI * fn * t[i])
          : Math.sin(2 * Math.PI * fn * t[i] + Math.PI);
    }
  }

  return { t, modulatedSignal };
};

// Apply amplitude modulation
const applyAmplitudeModulation = (
  modulatedSignal: number[],
  A: number,
  fn: number,
  Tb: number,
  fs = 2000,
): number[] => {
  const N = modulatedSignal.length;
  const modulatedSignalAmplitudeModulated = new Array(N).fill(0);

  for (let m = 0; m < N; m++) {
    const t = m / fs;
    modulatedSignalAmplitudeModulated[m] =
      modulatedSignal[m] * (A * Math.sin(2 * Math.PI * fn * t));
  }

  return modulatedSignalAmplitudeModulated;
};

// Calculate p(t) for ASK
const pOdTAsk = (x: number[], Tb: number, fs = 2000): number[] => {
  const samplesPerBit = Math.floor(fs * Tb);
  const p = new Array(x.length).fill(0);

  for (let i = 0; i < x.length; i++) {
    const bitIndex = Math.floor(i / samplesPerBit);
    const startIndex = bitIndex * samplesPerBit;

    for (let j = startIndex; j <= i; j++) {
      p[i] += x[j] / fs;
    }
  }

  return p;
};

// Calculate c(t) for ASK
const ctAsk = (p: number[], h: number): number[] => {
  return p.map((value) => (value > h ? 0.1 : 0.0));
};

// Calculate threshold for ASK
const calculateThresholdAsk = (
  x: number[],
  Tb: number,
  fs: number,
  margin = 0.05,
): number => {
  const samplesPerBit = Math.floor(fs * Tb);
  const endValueFirstBit = x[samplesPerBit - 1];
  return endValueFirstBit + margin;
};

// Decode ASK signal
const decodeAsk = (c: number[], samplesPerBit: number): number[] => {
  const decodedBits = [];
  const sampleIndex = samplesPerBit - 1;

  for (let i = sampleIndex; i < c.length; i += samplesPerBit) {
    decodedBits.push(c[i] > 0.05 ? 1.0 : 0.0);
  }

  return decodedBits;
};

// Calculate c(t) for PSK
const ctPsk = (p: number[], h: number): number[] => {
  return p.map((value) => (value < h ? 0.1 : 0.0));
};

// Generate FSK modulated signal
const generateFskModulatedSignal = (
  binaryStream: number[],
  fn1: number,
  fn2: number,
  Tb: number,
  fs = 2000,
): { t: number[]; modulatedSignal: number[] } => {
  const duration = binaryStream.length * Tb;
  const N = Math.floor(duration * fs);
  const M = Math.floor(N / 10);

  const t = Array.from({ length: N }, (_, i) => (i * duration) / N);
  const modulatedSignal = new Array(N).fill(0);

  for (let m = 0; m < M; m++) {
    const bitIndex = Math.floor((m * binaryStream.length) / M);
    const bit = binaryStream[bitIndex];
    const startIndex = Math.floor((m * N) / M);
    const endIndex = Math.floor(((m + 1) * N) / M);

    for (let i = startIndex; i < endIndex; i++) {
      modulatedSignal[i] =
        bit === 0
          ? Math.sin(2 * Math.PI * fn1 * t[i])
          : Math.sin(2 * Math.PI * fn2 * t[i]);
    }
  }

  return { t, modulatedSignal };
};

// Apply x1 PSK modulation
const x1Psk = (
  modulatedSignal: number[],
  A: number,
  fn1: number,
  Tb: number,
  fs = 2000,
): number[] => {
  const N = modulatedSignal.length;
  const modulatedSignalAmplitudeModulated = new Array(N).fill(0);

  for (let m = 0; m < N; m++) {
    const t = m / fs;
    modulatedSignalAmplitudeModulated[m] =
      modulatedSignal[m] * (A * Math.sin(2 * Math.PI * fn1 * t));
  }

  return modulatedSignalAmplitudeModulated;
};

// Apply x2 PSK modulation
const x2Psk = (
  modulatedSignal: number[],
  A: number,
  fn2: number,
  Tb: number,
  fs = 2000,
): number[] => {
  const N = modulatedSignal.length;
  const modulatedSignalAmplitudeModulated = new Array(N).fill(0);

  for (let m = 0; m < N; m++) {
    const t = m / fs;
    modulatedSignalAmplitudeModulated[m] =
      modulatedSignal[m] * (A * Math.sin(2 * Math.PI * fn2 * t));
  }

  return modulatedSignalAmplitudeModulated;
};

// Calculate p(t) for FSK
const ptFsk = (p1Fsk: number[], p2Fsk: number[]): number[] => {
  return p1Fsk.map((value, i) => -value + p2Fsk[i]);
};

// Calculate c(t) for FSK
const ctFsk = (p: number[], h: number): number[] => {
  return p.map((value) => (value > h ? 0.0 : 0.1));
};

// Decode FSK signal
const decodeFsk = (c: number[], samplesPerBit: number): number[] => {
  const decodedBits = [];
  const sampleIndex = samplesPerBit - 1;

  for (let i = sampleIndex; i < c.length; i += samplesPerBit) {
    decodedBits.push(c[i] > 0.05 ? 0.0 : 1.0);
  }

  return decodedBits;
};

const plotAmplitudeSpectrum = (samples: number[]): void => {
  let xArray: number[] = [];
  let yArray: number[] = [];
  for (let i = 0; i < samples.length; i++) {
    xArray[i] = (i * 900) / samples.length;
    yArray[i] = 300 - samples[i] * 15;
  }
  Plotly.newPlot(
    ctx as HTMLElement,
    [
      {
        x: xArray,
        y: yArray,
      },
    ],
    {
      margin: { t: 0 },
    },
  );
};

const main = (): void => {
  const B = 10;
  const Tc = 1.0;
  const Tb = Tc / B;
  const A = 1;
  const A1 = 1.0;
  const A2 = 2.0;
  const W = 2;
  const fn = 2 / Tb;
  const fs = 2 * fn;
  const N = Tc * fs;
  const M = 200;
  const fn1 = (W + 1) / Tb;
  const fn2 = (W + 2) / Tb;

  const binaryStream = generateBinaryStream(B);

  const { t: tAsk, modulatedSignal: modulatedAsk } = generateAskModulatedSignal(
    binaryStream,
    A1,
    A2,
    fn,
    Tb,
  );
  const { t: tPsk, modulatedSignal: modulatedPsk } = generatePskModulatedSignal(
    binaryStream,
    fn,
    Tb,
  );
  const { t: tFsk, modulatedSignal: modulatedFsk } = generateFskModulatedSignal(
    binaryStream,
    fn1,
    fn2,
    Tb,
  );

  const modulatedAskXt = applyAmplitudeModulation(modulatedAsk, A, fn, Tb);
  const modulatedAskPt = pOdTAsk(modulatedAskXt, Tb);
  const h = calculateThresholdAsk(modulatedAskPt, Tb, fs);
  const modulatedAskCt = ctAsk(modulatedAskPt, h);
  console.log(decodeAsk(modulatedAskCt, M));

  const modulatedPskXt = applyAmplitudeModulation(modulatedPsk, A, fn, Tb);
  const modulatedPskPt = pOdTAsk(modulatedPskXt, Tb);
  const modulatedPskCt = ctPsk(modulatedPskPt, 0.001);
  console.log(decodeAsk(modulatedPskCt, M));

  const modulatedFskXt1 = x1Psk(modulatedFsk, A, fn1, Tb);
  const modulatedFskXt2 = x2Psk(modulatedFsk, A, fn2, Tb);
  const modulatedFskPt1 = pOdTAsk(modulatedFskXt1, Tb);
  const modulatedFskPt2 = pOdTAsk(modulatedFskXt2, Tb);
  const modulatedFskPt = ptFsk(modulatedFskPt1, modulatedFskPt2);
  const modulatedFskCt = ctFsk(modulatedFskPt, h);
  console.log(decodeFsk(modulatedFskCt, M));

  plotAmplitudeSpectrum(modulatedFskCt);
};

main();

const { Complex } = window as any;
let ctx = document.getElementById('canvas') as HTMLElement;

const PI = Math.PI;

interface ComplexNumber {
  real: number;
  imag: number;
}

const absComplex = (x: ComplexNumber): number => {
  const result = Math.sqrt(x.real * x.real + x.imag * x.imag);
  console.log(result);
  return result;
};

const plotAmplitudeSpectrumComplex = (X: ComplexNumber[]): void => {
  let maxAmplitude = 0;
  for (let i of X) {
    let amplitude = absComplex(i);
    if (amplitude > maxAmplitude) {
      maxAmplitude = amplitude;
    }
  }
  let xArray: number[] = [];
  let yArray: number[] = [];
  for (let i = 0; i < X.length; i++) {
    xArray[i] = (i * 700) / X.length;
    const decibel = 10 * Math.log10(absComplex(X[i]) + 1);
    yArray[i] = 400 - decibel * 20;
  }
  Plotly.newPlot(
    ctx,
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

const plotAmplitudeSpectrum = (samples: number[]): void => {
  let xArray: number[] = [];
  let yArray: number[] = [];
  for (let i = 0; i < samples.length; i++) {
    xArray[i] = (i * 900) / samples.length;
    yArray[i] = 300 - samples[i] * 15;
  }
  Plotly.newPlot(
    ctx,
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

const DFT = (x: number[]): ComplexNumber[] => {
  let X: ComplexNumber[] = [];
  const N = x.length;
  for (let i = 0; i < N / 2; i++) {
    let real = 0;
    let imag = 0;
    for (let j = 0; j < N; j++) {
      const phi = (2 * Math.PI * i * j) / N;
      real += x[j] * Math.cos(phi);
      imag -= x[j] * Math.sin(phi);
    }
    X[i] = { real, imag };
  }
  return X;
};

function generateASK(
  bits: number[],
  fn: number,
  Tb: number,
  fs: number,
  A1: number,
  A2: number,
): number[] {
  let modulatedSignal: number[] = [];
  for (let bit of bits) {
    let A = bit === 0 ? A1 : A2;
    for (let t = 0; t < Tb; t += 1.0 / fs) {
      let signal = A * Math.sin(2 * PI * fn * t);
      modulatedSignal.push(signal);
    }
  }
  return modulatedSignal;
}

function generatePSK(
  bits: number[],
  fn: number,
  Tb: number,
  fs: number,
  phi1: number,
  phi2: number,
): number[] {
  let modulatedSignal: number[] = [];
  for (let bit of bits) {
    let phi = bit === 0 ? phi1 : phi2;
    for (let t = 0; t < Tb; t += 1.0 / fs) {
      let signal = Math.sin(2 * PI * fn * t + phi);
      modulatedSignal.push(signal);
    }
  }
  return modulatedSignal;
}

function generateFSK(
  bits: number[],
  Tb: number,
  fs: number,
  fn1: number,
  fn2: number,
): number[] {
  let modulatedSignal: number[] = [];
  for (let bit of bits) {
    let fn = bit === 0 ? fn1 : fn2;
    for (let t = 0; t < Tb; t += 1.0 / fs) {
      let signal = Math.sin(2 * PI * fn * t);
      modulatedSignal.push(signal);
    }
  }
  return modulatedSignal;
}

// Main function
function main(): void {
  let fs = 500;
  let M = 8;
  let Tc = 1.0;
  let N = Tc * fs;
  let Tb = Tc / M;
  let W = 2.0;
  let fn = W * (1 / Tb);
  let fn1 = (W + 1) / Tb;
  let fn2 = (W + 5) / Tb;

  let bits = [0, 1, 0, 1, 0, 1, 0, 1];

  let modulatedSignalASK = generateASK(bits, fn, Tb, fs, 1.0, 2.0);
  let modulatedSignalPSK = generatePSK(bits, fn, Tb, fs, 0, PI);
  let modulatedSignalFSK = generateFSK(bits, Tb, fs, fn1, fn2);

  let spectrumASK = DFT(modulatedSignalASK);
  let spectrumPSK = DFT(modulatedSignalPSK);
  let spectrumFSK = DFT(modulatedSignalFSK);

  plotAmplitudeSpectrum(modulatedSignalASK);
}

main();

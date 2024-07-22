interface ComplexNumber {
  real: number;
  imag: number;
}

const ctx: HTMLElement = document.getElementById('canvas')!;
const N: number = 100;
const Xn: number[] = [3, -3, 0, 1];
const fs: number = 1000;

const getTabForChosen = (chosenTable: number): number[] => {
  const Tc: number = 5;
  let t: number = 0;
  const fs: number = 1000;
  const N1: number = fs * Tc;
  const fi: number = 2 * Math.PI;
  const f: number = 5;
  const Hs: number[] = [5, 20, 50];

  const customFunctionForX = (t: number): number =>
    Math.sin(2 * Math.PI * f * t * Math.cos(3 * Math.PI * t) + t * fi);
  const customFunctionForY = (t: number): number =>
    (customFunctionForX(t) * t) / 3 + Math.cos(20 * Math.PI * t);
  const customFunctionForZ = (t: number): number =>
    1.92 *
    (Math.cos((3 * Math.PI * t) / 2) +
      Math.cos(
        (customFunctionForY(t) * customFunctionForY(t)) /
          (8 * customFunctionForX(t) + 3),
      ) *
        t);
  const customFunctionForV = (t: number): number =>
    ((customFunctionForY(t) * customFunctionForZ(t)) /
      (customFunctionForX(t) + 2)) *
      Math.cos(7.2 * Math.PI * t) +
    Math.sin(Math.PI * t * t);
  const customFunctionForU = (t: number): number => {
    if (t >= 0 && t < 0.1)
      return Math.sin(6 * Math.PI * t) * Math.cos(5 * Math.PI * t);
    else if (t >= 0.1 && t < 0.4)
      return -1.1 * t * Math.cos(41 * Math.PI * t * t);
    else if (t >= 0.4 && t < 0.72) return t * Math.sin(20 * t * t * t * t);
    else if (t >= 0.72 && t < 1)
      return 3.3 * (t - 0.72) * Math.cos(27 * t + 1.3);
    else return 0;
  };
  const customFunctionForBk = (t: number, H: number): number => {
    let result: number = 0;
    for (let h = 0; h < H; h++) {
      const a: number = (Math.pow(-1, h) / h) * Math.sin(h * Math.PI * 2 * t);
      if (!isNaN(a)) result += a;
    }
    return (result * 2) / Math.PI;
  };

  const makeArrayFull = (
    array: number[],
    customFunc: (t: number) => number,
  ): void => {
    for (let n = 0; n < N1; n++) {
      t = n / fs;
      const a: number = customFunc(t);
      array[n] = a;
    }
  };

  switch (chosenTable) {
    case 0: //x
      const tabForX: number[] = [];
      makeArrayFull(tabForX, customFunctionForX);
      return tabForX;
    case 1: //y
      const tabForY: number[] = [];
      makeArrayFull(tabForY, customFunctionForY);
      return tabForY;
    case 2: //z
      const tabForZ: number[] = [];
      makeArrayFull(tabForZ, customFunctionForZ);
      return tabForZ;
    case 3: //v
      const tabForV: number[] = [];
      makeArrayFull(tabForV, customFunctionForV);
      return tabForV;
    case 4: //u
      const tabForU: number[] = [];
      makeArrayFull(tabForU, customFunctionForU);
      return tabForU;
    case 5: //bk
      const tabForBk: number[] = [];
      for (let n = 0; n < N1; n++) {
        t = n / fs;
        const bk: number = customFunctionForBk(t, Hs[0]); // Chose the H value
        tabForBk[n] = bk;
      }
      return tabForBk;
    default:
      throw new Error('Incorrect input');
  }
};

const customExp = (z: ComplexNumber): ComplexNumber => {
  const real: number = Math.exp(z.real) * Math.cos(z.imag);
  const imag: number = Math.exp(z.real) * Math.sin(z.imag);
  return { real: real, imag: imag };
};

const customMinus = (n1: ComplexNumber, n2: ComplexNumber): ComplexNumber => {
  return { real: n1.real - n2.real, imag: n1.imag - n2.imag };
};

const customMultiplyComplexNumbers = (
  a: ComplexNumber,
  b: ComplexNumber,
): ComplexNumber => {
  const realPart: number = a.real * b.real - a.imag * b.imag;
  const imaginaryPart: number = a.real * b.imag + a.imag * b.real;
  return { real: realPart, imag: imaginaryPart };
};

const customMultiply = (n1: ComplexNumber, n2: number): ComplexNumber => {
  return { real: n1.real * n2, imag: n1.imag * n2 };
};

const customPlus = (n1: ComplexNumber, n2: ComplexNumber): ComplexNumber => {
  return { real: n1.real + n2.real, imag: n1.imag + n2.imag };
};

const customFunction = (): ComplexNumber => {
  let result: ComplexNumber = { real: 0, imag: 0 };
  for (let n = 0; n < N; n++) {
    let k: number = 0;
    if (n <= N / 2 - 1) k = n;
    else k = N / 2 - 1;
    const exp: ComplexNumber = customExp({
      real: 0,
      imag: (-2 * Math.PI * k * n) / N,
    });
    result = customPlus(result, exp);
    result = customMultiply(result, Xn[0]);
  }
  return result;
};
function fft(input: ComplexNumber[]): ComplexNumber[] {
  const N = input.length;

  if (N <= 1) {
      return input;
  }

  // Divide the input into even and odd indices
  const even: ComplexNumber[] = [];
  const odd: ComplexNumber[] = [];
  for (let i = 0; i < N; i++) {
      if (i % 2 === 0) {
          even.push(input[i]);
      } else {
          odd.push(input[i]);
      }
  }

  // Recursively compute FFT for even and odd indices
  const evenFFT = fft(even);
  const oddFFT = fft(odd);

  // Compute twiddle factors
  const twiddleFactors: ComplexNumber[] = Array.from({ length: N }, (_, k) => {
      const exponent = -2 * Math.PI * k / N;
      return { real: Math.cos(exponent), imag: Math.sin(exponent) };
  });

  // Combine the results
  const output: ComplexNumber[] = new Array(N);
  for (let k = 0; k < N / 2; k++) {
      const twiddle = twiddleFactors[k];
      const oddPart = customMultiplyComplexNumbers(oddFFT[k], twiddle);
      output[k] = customPlus(evenFFT[k], oddPart);
      output[k + N / 2] = customMinus(evenFFT[k], oddPart);
  }

  return output;
}
const DFT = (x: number[]): number[] => {
  const N: number = x.length;
  const X: number[] = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    for (let n = 0; n < N; n++) {
      const real: number = Math.cos((2 * Math.PI * k * n) / N);
      const imag: number = -Math.sin((2 * Math.PI * k * n) / N);
      X[k] += x[n] * (real + imag);
    }
  }
  return X;
};

const calculateAmplitudeSpectrum = (signal: number[]): number[] => {
  const N: number = signal.length;
  const spectrum: number[] = new Array(N).fill(0);

  for (let k = 0; k < N; k++) {
    let realPart: number = 0;
    let imaginaryPart: number = 0;

    for (let n = 0; n < N; n++) {
      const angle: number = (2 * Math.PI * k * n) / N;
      realPart += signal[n] * Math.cos(angle);
      imaginaryPart -= signal[n] * Math.sin(angle);
    }

    spectrum[k] = Math.sqrt(
      realPart * realPart + imaginaryPart * imaginaryPart,
    );
  }

  return spectrum;
};

const plotAmplitudeSpectrum = (A: number[], fs: number): void => {
  const freqs: number[] = [];
  const is: number[] = [];
  for (let i = 0; i < A.length; i++) {
    is.push(i);
    freqs.push((i * fs) / A.length);
  }
  Plotly.newPlot(ctx, [{ x: is, y: A }], { margin: { t: 0 } });
};

const main = (): void => {
  const tArray: number[] = [];
  for (let i = 0; i < 100; i++) {
    tArray.push(i);
  }
  const t: number[] = tArray.map((i) => i / fs);
  const x: number[] = t.map(
    (tVal) =>
      Math.sin(2 * Math.PI * 10 * tVal) +
      0.5 * Math.sin(2 * Math.PI * 20 * tVal),
  );

  const tab: number[] = getTabForChosen(0);
  const X: number[] = DFT(tab);
  const A: number[] = calculateAmplitudeSpectrum(X);
  console.log(A);
  plotAmplitudeSpectrum(A, fs);
};

main();

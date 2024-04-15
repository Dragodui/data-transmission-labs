import { Chart } from 'chart.js';

const ctx = document.getElementById('canvas') as HTMLCanvasElement;

const N: number = 100;
const Xn: number[] = [3, -3, 0, 1];
const fs: number = 1000;

// work with complex numbers
interface ComplexNumber {
  real: number;
  imag: number;
}

const customExp = (z: ComplexNumber): ComplexNumber => {
  const real = Math.exp(z.real) * Math.cos(z.imag);
  const imag = Math.exp(z.real) * Math.sin(z.imag);
  return { real, imag };
};

function customMultiplyComplexNumbers(
  a: ComplexNumber,
  b: ComplexNumber,
): ComplexNumber {
  const realPart = a.real * b.real - a.imag * b.imag;
  const imaginaryPart = a.real * b.imag + a.imag * b.real;
  return { real: realPart, imag: imaginaryPart };
}

const customMultiply = (n1: ComplexNumber, n2: number): ComplexNumber => {
  return { real: n1.real * n2, imag: n1.imag * n2 };
};

const customPlus = (n1: ComplexNumber, n2: ComplexNumber): ComplexNumber => {
  return { real: n1.real + n2.real, imag: n1.imag + n2.imag };
};

// function from 1 task
const customFunction = (): ComplexNumber => {
  let result: ComplexNumber = { real: 0, imag: 0 };
  for (let n: number = 0; n < N; n++) {
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

// output all the values needed
const printValues = (): void => {
  const Xk: ComplexNumber = customFunction();

  const XkString: string = `${Xk.real}${Xk.imag >= 0 ? '+' : ''}${Xk.imag}i`;
  console.log(`Xk: ${XkString}`);

  const Mk: number = Math.sqrt(Xk.real * Xk.real + Xk.imag * Xk.imag);
  console.log(Mk.toString());

  const DerivedMk: number = 10 * Math.log(Mk);
  console.log(DerivedMk.toString());
};

// DTF function
const DFT = (x: number[]): ComplexNumber[] => {
  const N = x.length;
  const X: ComplexNumber[] = new Array(N >> 1);
  const twoPI = Math.PI * 2;

  for (let k = 0; k < N >> 1; k++) {
    X[k] = {
      real: 0,
      imag: 0,
    };
    for (let n = 0; n < N; n++) {
      const angle = (-twoPI * k * n) / N;
      const minusTwoI: ComplexNumber = {
        real: 0,
        imag: -2,
      };
      const multiplyResult: ComplexNumber = customMultiply(minusTwoI, angle);
      X[k] = customMultiplyComplexNumbers(X[k], customExp(multiplyResult));
    }
  }

  return X;
};

// function for calculating the amplitude spectrum
const calculateAmplitudeSpectrum = (X: ComplexNumber[]): number[] => {
  const M = X.map((value) =>
    Math.sqrt(Math.pow(value.real, 2) + Math.pow(value.imag, 2)),
  );
  const A = M.map((magnitude) => 20 * Math.log(magnitude));
  return A;
};

//draw the plot
const plotAmplitudeSpectrum = (A: number[], fs: number): void => {
  const freqs: number[] = [];
  for (let i = 0; i < A.length; i++) {
    freqs.push((i * fs) / A.length);
  }

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: [freqs.map((f) => freqs.indexOf(f) + 1)],
      datasets: [
        {
          label: 'Generated Signal',
          data: freqs,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    },
  });
};

//main function
const main = (): void => {
  const tArray: number[] = [];

  for (let i = 0; i < 1000; i++) {
    tArray.push(i);
  }
  const t: number[] = tArray.map((i) => i / fs);

  const x = t.map(
    (tVal) =>
      Math.sin(2 * Math.PI * 10 * tVal) +
      0.5 * Math.sin(2 * Math.PI * 20 * tVal),
  );

  const X = DFT(x);
  const A = calculateAmplitudeSpectrum(X);

  printValues();
  plotAmplitudeSpectrum(A, fs);
};

main();

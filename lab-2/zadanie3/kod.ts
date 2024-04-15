import { Chart } from 'chartjs';

const ctx = document.getElementById('canvas') as HTMLCanvasElement;

const N: number = 100;
const Xn: number[] = [3, -3, 0, 1];
const fs: number = 1000;

const getTabForChosen = (chosenTable: number): number[] => {
  const Tc: number = 5; //Tc
  let t: number = 0; // czas
  const fs: number = 22050; // częstotliwosc probkowania
  let x: number; // x
  const N1: number = fs * Tc; // N
  const fi: number = 2 * Math.PI;
  const f: number = 5;
  const Hs: number[] = [5, 20, 50];

  const customFunctionForX = (t: number): number => {
    return Math.sin(2 * Math.PI * f * t * Math.cos(3 * Math.PI * t) + t * fi); // funkcja 5 z tabeli
  };

  const customFunctionForY = (t: number): number => {
    return (customFunctionForX(t) * t) / 3 + Math.cos(20 * Math.PI * t);
  };

  const customFunctionForZ = (t: number): number => {
    return (
      1.92 *
      (Math.cos((3 * Math.PI * t) / 2) +
        Math.cos(
          ((customFunctionForY(t) * customFunctionForY(t)) /
            (8 * customFunctionForX(t) + 3)) *
            t,
        ))
    );
  };

  const customFunctionForV = (t: number): number => {
    return (
      ((customFunctionForY(t) * customFunctionForZ(t)) /
        (customFunctionForX(t) + 2)) *
        Math.cos(7.2 * Math.PI * t) +
      Math.sin(Math.PI * t * t)
    );
  };
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
    for (let h: number = 0; h < H; h++) {
      const a: number = (Math.pow(-1, h) / h) * Math.sin(h * Math.PI * 2 * t);
      if (!isNaN(a)) result += a;
    }
    return (result * 2) / Math.PI;
  };

  const tabForX: number[] = [];
  const tabForY: number[] = [];
  const tabForZ: number[] = [];
  const tabForV: number[] = [];
  const tabForU: number[] = [];
  const tabForBk: number[] = [];

  const makeArrayFull = (array: number[], customFunc: (number) => number) => {
    for (var n = 0; n < N1; n++) {
      t = n / fs;
      var a = customFunc(t);
      array[n] = a;
    }
  };

  switch (chosenTable) {
    case 0: //x
      makeArrayFull(tabForX, customFunctionForX);
      return tabForX;
    case 1: //y
      makeArrayFull(tabForY, customFunctionForY);
      return tabForY;
    case 2: //z
      makeArrayFull(tabForZ, customFunctionForZ);
      return tabForZ;
    case 3: //v
      makeArrayFull(tabForV, customFunctionForV);
      return tabForV;
    case 4: //u
      makeArrayFull(tabForU, customFunctionForU);
      return tabForU;
    case 5: //bk
      for (var n = 0; n < N1; n++) {
        t = n / fs;
        const bk = customFunctionForBk(t, Hs[0]); // Chose the H value
        tabForBk[n] = bk;
      };
      return tabForBk;
    default:
      throw new Error('Incorrect input');
  }
};

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

// DFT function
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
      X[k] = customPlus(X[k], customExp(multiplyResult));
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

  for (let i = 0; i < 100; i++) {
    tArray.push(i);
  }
  const t: number[] = tArray.map((i) => i / fs);

  const x = t.map(
    (tVal) =>
      Math.sin(2 * Math.PI * 10 * tVal) +
      0.5 * Math.sin(2 * Math.PI * 20 * tVal),
  );

  const X = DFT(getTabForChosen(0));
  const A = calculateAmplitudeSpectrum(X);

  plotAmplitudeSpectrum(A, fs);
};

main();

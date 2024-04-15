interface ComplexNumber {
  real: number;
  imag: number;
}

const N: number = 100;
const Xn: number[] = [3, -3, 0, 1];

const customExp = (z: ComplexNumber): ComplexNumber => {
  const real = Math.exp(z.real) * Math.cos(z.imag);
  const imag = Math.exp(z.real) * Math.sin(z.imag);
  return { real, imag };
};

const customPlus = (n1: ComplexNumber, n2: ComplexNumber): ComplexNumber => {
  return { real: n1.real + n2.real, imag: n1.imag + n2.imag };
};

const customMultiply = (n1: ComplexNumber, n2: number): ComplexNumber => {
  return { real: n1.real * n2, imag: n1.imag * n2 };
};

const customFunction = (): ComplexNumber => {
  let result: ComplexNumber = { real: 0, imag: 0 };
  const k = N / 2;
  for (let n: number = 0; n < N; n++) {
    const exp: ComplexNumber = customExp({
      real: 0,
      imag: (-2 * Math.PI * k * n) / N,
    });
    result = customPlus(result, exp);
    result = customMultiply(result, Xn[0]);
  };
  return result;
};

// Xk output
const Xk: ComplexNumber = customFunction();
const XkString: string = `${Xk.real}${Xk.imag >= 0 ? '+' : ''}${Xk.imag}i`;
console.log(XkString);

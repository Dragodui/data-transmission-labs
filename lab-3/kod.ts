  const ctx = document.getElementById('canvas') as HTMLCanvasElement;

  const mt = (fm: number, t: number): number => {
    return Math.sin(2 * Math.PI * fm * t);
  };

  type Complex = {
    real: number;
    imag: number;
  };

  function absComplex(x: Complex): number {
    const result = Math.sqrt(x.real * x.real + x.imag * x.imag);
    console.log(result);
    return result;
  }

  const generateSamplesAmplitude = (
    ka: number,
    fn: number,
    fm: number,
    N: number,
    fs: number,
  ): number[] => {
    const samples: number[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / fs;
      const m = mt(fm, t);
      const x = Math.abs(ka * m + 1) * Math.cos(2 * Math.PI * fn * t);
      samples.push(x);
    }
    return samples;
  };

  const generateSamplesFase = (
    fase: number,
    fn: number,
    fm: number,
    N: number,
    fs: number,
  ): number[] => {
    const samples: number[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / fs;
      const m = mt(fm, t);
      const x = Math.cos(Math.abs(2 * Math.PI * fn * t + fase * m));
      samples.push(x);
    }
    return samples;
  };

  const generateSamplesFrequency = (
    kf: number,
    fn: number,
    fm: number,
    N: number,
    fs: number,
  ): number[] => {
    const samples: number[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / fs;
      const m = mt(fm, t);
      const x = Math.cos(2 * Math.PI * fn * t + (kf / fm) * m);
      samples.push(x);
    }
    return samples;
  };

  const DFT = (x: number[]): Complex[] => {
    const X: Complex[] = [];
    const N = x.length;
    for (let i = 0; i < N / 2; i++) {
      let sumReal = 0;
      let sumImag = 0;
      for (let j = 0; j < N; j++) {
        const phi = (2 * Math.PI * i * j) / N;
        sumReal += x[j] * Math.cos(phi);
        sumImag -= x[j] * Math.sin(phi);
      }
      X[i] = { real: sumReal, imag: sumImag };
    }
    return X;
  };

  const rangeWidth = (X: Complex[], fs: number): void => {
    let maxAmplitude = 0;
    for (const val of X) {
      const amplitude = absComplex(val);
      if (amplitude > maxAmplitude) maxAmplitude = amplitude;
    }

    const threshold_3dB = maxAmplitude / Math.sqrt(2);
    const threshold_6dB = maxAmplitude / Math.sqrt(10);
    const threshold_12dB = maxAmplitude / Math.sqrt(100);

    const frequencies_3dB: number[] = [];
    const frequencies_6dB: number[] = [];
    const frequencies_12dB: number[] = [];

    for (let i = 0; i < X.length; ++i) {
      const amplitude = absComplex(X[i]);
      if (amplitude >= threshold_3dB) frequencies_3dB.push(i);
      if (amplitude >= threshold_6dB) frequencies_6dB.push(i);
      if (amplitude >= threshold_12dB) frequencies_12dB.push(i);
    }

    frequencies_3dB.sort();
    frequencies_6dB.sort();
    frequencies_12dB.sort();

    const bandwidth_3dB =
      ((frequencies_3dB[frequencies_3dB.length - 1] - frequencies_3dB[0]) * fs) /
      X.length;
    const bandwidth_6dB =
      ((frequencies_6dB[frequencies_6dB.length - 1] - frequencies_6dB[0]) * fs) /
      X.length;
    const bandwidth_12dB =
      ((frequencies_12dB[frequencies_12dB.length - 1] - frequencies_12dB[0]) *
        fs) /
      X.length;

    console.log('Bandwidth for -3 dB: ' + bandwidth_3dB + ' Hz');
    console.log('Bandwidth for -6 dB: ' + bandwidth_6dB + ' Hz');
    console.log('Bandwidth for -12 dB: ' + bandwidth_12dB + ' Hz');
  };

  const plotAmplitudeSpectrum = (samples: number[]): void => {
    const xArray: number[] = [];
    const yArray: number[] = [];
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

  const plotAmplitudeSpectrumComplex = (X: Complex[]): void => {
    let maxAmplitude = 0;
    for (const val of X) {
      const amplitude = absComplex(val);
      if (amplitude > maxAmplitude) {
        maxAmplitude = amplitude;
      }
    }
    const xArray: number[] = [];
    const yArray: number[] = [];
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

  const main = (): void => {
    const fs = 2000;
    const fn = 500;
    const fm = 5;
    const Tc = 1;
    const N = Tc * fs;

    const x = generateSamplesAmplitude(0.5, fn, fm, N, fs);
    const y = generateSamplesAmplitude(2, fn, fm, N, fs);
    const z = generateSamplesAmplitude(25, fn, fm, N, fs);

    const q = generateSamplesFase(0.5, fn, fm, N, fs);
    const w = generateSamplesFase(2, fn, fm, N, fs);
    const e = generateSamplesFase(10, fn, fm, N, fs);

    const a = generateSamplesFrequency(0.5, fn, fm, N, fs);
    const s = generateSamplesFrequency(2, fn, fm, N, fs);
    const d = generateSamplesFrequency(10, fn, fm, N, fs);

    const X = DFT(x);
    rangeWidth(X, fs);
    const Y = DFT(y);
    const Z = DFT(z);

    const Q = DFT(q);
    rangeWidth(Q, fs);
    const W = DFT(w);
    const E = DFT(e);

    const A = DFT(a);
    const S = DFT(s);
    const D = DFT(d);

    plotAmplitudeSpectrumComplex(D);
  };

  main();

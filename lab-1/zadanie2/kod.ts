// Tc - czas trwania sygnalu (sekundy)
// fs - częstotliwosc probkowania (hz)
// N = Tc*fs - liczba probek przydadajacych na caly signal
// Ts = 1/fs - okres probkowania (sekundy)

//from 0 to Tc with step fs

import { Chart } from 'chart.js';

const ctxY = document.getElementById('canvasY') as HTMLCanvasElement;
const ctxZ = document.getElementById('canvasZ') as HTMLCanvasElement;
const ctxV = document.getElementById('canvasV') as HTMLCanvasElement;

const Tc: number = 5; //Tc
let t: number = 0; // czas
const fs: number = 22050; // częstotliwosc probkowania
let x: number; // x
const N: number = fs * Tc; // N
const fi: number = 2 * Math.PI;
const f: number = 5;

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

const tabForY: number[] = [];
const tabForZ: number[] = [];
const tabForV: number[] = [];

for (let n: number = 0; n < N; n++) {
  t = n / fs;
  const y = customFunctionForY(t);
  const z = customFunctionForY(t);
  const v = customFunctionForY(t);

  tabForY[n] = y;
  tabForZ[n] = z;
  tabForV[n] = v;
};

new Chart(ctxY, {
  type: 'line',
  data: {
    labels: [...Array(tabForY.length).keys()],
    datasets: [
      {
        label: 'Generated Signal For Y',
        data: tabForY,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  },
});

new Chart(ctxZ, {
  type: 'line',
  data: {
    labels: [...Array(tabForZ.length).keys()],
    datasets: [
      {
        label: 'Generated Signal For Z',
        data: tabForZ,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  },
});

new Chart(ctxV, {
  type: 'line',
  data: {
    labels: [...Array(tabForV.length).keys()],
    datasets: [
      {
        label: 'Generated Signal For V',
        data: tabForV,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  },
});


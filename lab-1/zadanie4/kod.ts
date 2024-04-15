// Tc - czas trwania sygnalu (sekundy)
// fs - częstotliwosc probkowania (hz)
// N = Tc*fs - liczba probek przydadajacych na caly signal
// Ts = 1/fs - okres probkowania (sekundy)

//from 0 to Tc with step fs

import { Chart } from 'chart.js';

const ctx = document.getElementById('canvas') as HTMLCanvasElement;

const Tc: number = 1; //Tc
let t: number = 0; // czas
const fs: number = 22050; // częstotliwosc probkowania
let x: number; // x
const N: number = fs * Tc; // N
const fi: number = 2 * Math.PI;
const f: number = 5;
const Hs: number[] = [5,20,50];

const customFunctionForBk = (t: number, H: number): number => {
  let result: number = 0;
 for (let h: number = 0; h < H; h++) {
  const a: number = Math.pow(-1, h) / h * Math.sin(h * Math.PI * 2 * t);
  if (!Number.isNaN(a)) result += a;
};
return result * 2/Math.PI;
};


const tabForBk: number[] = [];

for (let n: number = 0; n < N; n++) {
  t = n / fs;
  const bk = customFunctionForBk(t, Hs[0]);

  tabForBk[n] = bk;
};

new Chart(ctx, {
  type: 'line',
  data: {
    labels: [...Array(tabForBk.length).keys()],
    datasets: [
      {
        label: 'Generated Signal For Bk (H = 5)',
        data: tabForBk,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  },
});




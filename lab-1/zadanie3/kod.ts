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

const customFunctionForU = (t: number): number => {
  if (t >= 0 && t<0.1) return Math.sin(6*Math.PI*t) * Math.cos(5*Math.PI*t);
  else if (t>=0.1 && t<0.4) return -1.1*t*Math.cos(41*Math.PI*t*t);
  else if (t>=0.4 && t<0.72) return t*Math.sin(20*t*t*t*t);
  else if (t>=0.72 && t<1) return 3.3*(t-0.72)*Math.cos(27*t+1.3);
  else return 0; 
};


const tabForU: number[] = [];

for (let n: number = 0; n < N; n++) {
  t = n / fs;
  const u = customFunctionForU(t);

  tabForU[n] = u;
};

new Chart(ctx, {
  type: 'line',
  data: {
    labels: [...Array(tabForU.length).keys()],
    datasets: [
      {
        label: 'Generated Signal For U',
        data: tabForU,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  },
});




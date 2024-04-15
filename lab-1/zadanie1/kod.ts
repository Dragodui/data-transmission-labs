// Tc - czas trwania sygnalu (sekundy)
// fs - częstotliwosc probkowania (hz)
// N = Tc*fs - liczba probek przydadajacych na caly signal
// Ts = 1/fs - okres probkowania (sekundy)

//from 0 to Tc with step fs

import { Chart } from 'chartjs';

const ctx = document.getElementById('canvas') as HTMLCanvasElement;

const Tc: number = 5; //Tc
let t: number = 0; // czas
const fs: number = 22050; // częstotliwosc probkowania
let x: number; // x
const N: number = fs*Tc; // N
let tab: number[] = [];
const fi: number = 2 * Math.PI;

const customFunction = (
  f: number,
  t: number,
  fi: number,
): number => {
  return Math.sin(2 * Math.PI * f * t * Math.cos(3 * Math.PI * t) + t * fi); // funkcja 5 z tabeli
};

for (let n: number = 0; n < N; n++) {
  t = n / fs;
  x = customFunction(5, t, fi);
  tab[n] = x;
};


new Chart(ctx, {
  type: 'line',
  data: {
    labels: [...Array(tab.length).keys()], 
    datasets: [{
      label: 'Generated Signal',
      data: tab,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    }]
  }
});

const canvas: HTMLCanvasElement = document.getElementById('canvas');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

const customFunction = (x: number): number => {
  return x * x * x;
};

const drawAxis = () => {
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.strokeStyle = 'black';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height * 2);
  ctx.strokeStyle = 'black';
  ctx.stroke();
};

const minX: number = -10;
const maxX: number = 10;
const step: number = 0.1;

drawAxis();

for (let x: number = minX; x <= maxX; x += step) {
  const y: number = customFunction(x);

  const xCoord = canvas.width / 2 + x * 5;
  const yCoord = canvas.height / 2 - y;

  ctx.beginPath();
  ctx.arc(xCoord, yCoord, 1, 0, 1 * Math.PI);
  ctx.fillStyle = 'red';
  ctx.fill();
}

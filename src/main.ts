import './style.css';
import p5 from 'p5';
import { CirclePacker } from './CirclePacker';
import { SKETCH_HEIGHT, SKETCH_WIDTH } from './constants';
import { Eye } from './Eye';
import { packShapes } from './packShapes';
import type { GridCircle } from './types';

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(SKETCH_WIDTH, SKETCH_HEIGHT);

    const circlePacker = new CirclePacker(p, 200, 16);

    const spawn = (x: number, y: number, d: number, rotation: number) =>
      new Eye(p, x, y, d, rotation);

    const { eyes, allCircles } = packShapes(p, circlePacker, spawn);

    p.background(255);

    // drawCircles(p, allCircles);

    eyes.forEach((eye) => {
      eye.draw();
    });

    p.noLoop();
  };
  /*
  p.draw = () => {
    p.background(255);

    eyes.forEach((eye) => {
      eye.draw();
    });
  };
  */
};

const appDiv = document.querySelector('#app');
if (appDiv) {
  new p5(sketch, appDiv as HTMLElement);
}

function drawCircles(p: p5, circles: GridCircle[]) {
  for (let n = 0; n < circles.length; n++) {
    const i = circles[n];
    p.push();
    p.noFill();
    p.stroke(0, 200, 100);
    p.ellipse(i.x, i.y, i.r * 2);
    p.pop();
  }
}

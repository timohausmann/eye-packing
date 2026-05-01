import './style.css';
import p5 from 'p5';
import { Eye } from './Eye';
import { CirclePacker } from './CirclePacker';
import { SKETCH_HEIGHT, SKETCH_PADDING, SKETCH_WIDTH } from './constants';
import { packShapes } from './packShapes';
import type { GridCircle } from './types';

const eyes: Eye[] = [];

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(SKETCH_WIDTH, SKETCH_HEIGHT);

    const circlePacker = new CirclePacker(p, SKETCH_PADDING, 200, 5);

    const spawn = () =>
      new Eye(p, p.createVector(p.width / 2, p.height / 2), 50);

    const { eyes, allCircles } = packShapes(p, circlePacker, spawn);
    console.log(allCircles);

    p.background(255);
    p.translate(SKETCH_PADDING, SKETCH_PADDING);

    drawCircles(p, allCircles);

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
    let i = circles[n];
    p.push();
    p.noFill();
    p.stroke(0, 200, 100);
    p.ellipse(i.x, i.y, i.r * 2);
    p.pop();
  }
}

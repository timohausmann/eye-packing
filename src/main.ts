import './style.css';
import p5 from 'p5';
import { Eye } from './Eye';

const eyes: Eye[] = [];

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400);
    eyes.push(new Eye(p, p.createVector(p.width / 2, p.height / 2), 50));
  };

  p.draw = () => {
    p.background(255);

    eyes.forEach((eye) => {
      eye.draw();
    });
  };
};

const appDiv = document.querySelector('#app');
if (appDiv) {
  new p5(sketch, appDiv as HTMLElement);
}

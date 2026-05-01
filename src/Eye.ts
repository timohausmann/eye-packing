import p5 from 'p5';
import type { GridCircle } from './types';

export class Eye {
  p: p5;
  w: number; // half eye width
  d: number; // eye height (base diameter)

  position: p5.Vector;
  scale: number;
  rotation: number; // radians

  eyeBallRadius: number;
  pupilOffset: p5.Vector;
  pupilRadius: number;

  blueprint: GridCircle[] = [];
  circles: GridCircle[] = [];

  constructor(p: p5, position: p5.Vector, d: number) {
    this.p = p;
    this.d = d;
    this.w = d * 1.1682;

    this.position = position;
    this.scale = 1;
    this.rotation = 0;

    this.eyeBallRadius = this.w * 4 * p.random(0.94, 0.96);
    this.pupilOffset = p5.Vector.random2D().mult(p.random(4, 28));
    this.pupilRadius = d * p.random(0.66, 0.99);

    this.createBlueprint();
  }

  draw = () => {
    const { w, d, p } = this;
    p.push();
    p.translate(this.position.x, this.position.y);

    p.noFill();
    p.stroke(0);

    // clipping mask
    p.push();
    p.clip(this.drawEyeLines);

    // eye ball
    p.push();
    //p.translate(w);
    p.circle(-w, -12, this.eyeBallRadius);
    p.pop();

    // draw actual pupil
    p.push();
    p.translate(this.pupilOffset.x, this.pupilOffset.y);
    p.circle(0, 0, this.pupilRadius);
    p.pop();

    // end mask
    p.pop();

    // draw eye shape
    this.drawEyeLines();

    p.pop();
  };

  drawEyeLines = () => {
    const { w, d, p } = this;

    p.bezier(-w, 0, -w / 2, -d * 0.67, w / 2, -d * 0.67, w, 0);
    p.bezier(-w, 0, -w / 2, d * 0.67, w / 2, d * 0.67, w, 0);
  };

  createBlueprint = () => {
    const { d, p, w } = this;
    const resolution = 1;

    this.blueprint = new Array(resolution).fill(0).map((_, i) => ({
      x: 0, //p.map(i, 0, resolution, -w, w),
      y: 0,
      r: d / 2,
    }));
  };

  scaleRotateTranslate = (
    scale: number,
    rotateRadians: number,
    translateX: number,
    translateY: number,
  ) => {
    this.scale = scale;
    this.rotation = this.rotation;
    this.position = this.p.createVector(translateX, translateY);

    this.circles = this.blueprint.map((c) => {
      const x_ = c.x * scale;
      const y_ = c.y * scale;
      const r = c.r * scale;
      // rotate and translate each x and y
      const x =
        x_ * Math.cos(rotateRadians) -
        y_ * Math.sin(rotateRadians) +
        translateX;
      const y =
        x_ * Math.sin(rotateRadians) +
        y_ * Math.cos(rotateRadians) +
        translateY;

      return {
        x,
        y,
        r,
      };
    });
  };
}

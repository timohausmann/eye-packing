import p5 from 'p5';

export class Eye {
  p: p5;
  w: number; // half eye width
  d: number; // eye height (base diameter)

  position: p5.Vector;

  eyeBallRadius: number;
  pupilOffset: p5.Vector;
  pupilRadius: number;

  constructor(p: p5, position: p5.Vector, d: number) {
    this.p = p;

    this.position = position;
    this.d = d;
    this.w = d * 1.1682;

    this.eyeBallRadius = this.w * 4 * p.random(0.94, 0.96);
    this.pupilOffset = p5.Vector.random2D().mult(p.random(4, 28));
    this.pupilRadius = d * p.random(0.66, 0.99);
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
}

/**
 * Based on
 * https://www.gorillasun.de/blog/a-simple-solution-for-shape-packing-in-2d/#proposed-solution
 */

import type p5 from 'p5';
import type { CirclePacker } from './CirclePacker';
import { SKETCH_PADDING } from './constants';
import type { Eye } from './Eye';
import type { GridCircle } from './types';

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_INCREMENT = 0.1;
const NUM_ITEM_PLACE_TRIES = 1000;

export function packShapes(
  p: p5,
  circlePacker: CirclePacker,
  spawn: (x: number, y: number, r: number, rotation: number) => Eye,
) {
  const allCircles: GridCircle[] = [];
  const eyes: Eye[] = [];

  for (let i = 0; i < NUM_ITEM_PLACE_TRIES; i++) {
    let currentScale = MIN_SCALE;
    const x = p.random(SKETCH_PADDING, p.width - SKETCH_PADDING);
    const y = p.random(SKETCH_PADDING, p.height - SKETCH_PADDING);
    const rotateRadians = p.noise(x * 0.001, y * 0.0005) * p.TAU;
    const randRadius = p.random(16, 32);
    let lastAddedCircles: GridCircle[] | null = null;
    let lastAddedEye: Eye | null = null;
    let placed = false;

    // get a shape to draw
    // let currentShape = new makeEmptyCircle(randRadius);
    const currentShape = spawn(x, y, randRadius, rotateRadians);

    while (currentScale < MAX_SCALE) {
      currentShape.scaleRotateTranslate(currentScale, rotateRadians, x, y);
      const addedCircles = circlePacker.tryToAddShape(
        currentShape.circles,
        false,
      );
      // shape can't be placed
      if (!addedCircles && !lastAddedCircles) {
        console.log('cannot be placed', currentShape.circles);
        break;
      }

      // shape can't grow anymore, add the previous version
      if (!addedCircles && lastAddedCircles) {
        console.log('placing!');
        lastAddedCircles.forEach((c) => {
          allCircles.push({
            x: c.x,
            y: c.y,
            r: c.r,
          });
        });

        lastAddedCircles.forEach((c) => circlePacker.addCircle(c));
        if (lastAddedEye) {
          console.log('growing!');
          eyes.push(lastAddedEye);
        }
        placed = true;
        break;

        // shape grew, update
      } else if (addedCircles) {
        lastAddedCircles = [...addedCircles];
        lastAddedEye = currentShape;
      }
      currentScale += SCALE_INCREMENT;
    }

    if (!placed && lastAddedCircles) {
      lastAddedCircles.forEach((c) => {
        allCircles.push({
          x: c.x,
          y: c.y,
          r: c.r,
        });
      });

      lastAddedCircles.forEach((c) => circlePacker.addCircle(c));
      if (lastAddedEye) {
        eyes.push(lastAddedEye);
      }
    }
  }

  return { eyes, allCircles };
}

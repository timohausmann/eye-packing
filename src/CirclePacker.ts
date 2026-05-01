/**
 * Based on
 * https://www.gorillasun.de/blog/a-simple-solution-for-shape-packing-in-2d/#proposed-solution
 */

import type p5 from 'p5';
import type { GridCircle, GridItem } from './types';

export class CirclePacker {
  p: p5;

  width: number;
  height: number;

  gridDivs: number;
  pad: number;

  gridSizeX: number;
  gridSizeY: number;

  grid: GridItem[][] = [];
  items: GridCircle[] = [];

  constructor(
    p: p5,
    canvasPadding: number,
    gridDivs: number,
    minDistance: number,
  ) {
    this.p = p;

    this.width = p.width - canvasPadding * 2;
    this.height = p.height - canvasPadding * 2;

    this.gridDivs = gridDivs;
    this.pad = minDistance;

    this.gridSizeX = this.width / this.gridDivs;
    this.gridSizeY = this.height / this.gridDivs;

    this.generateGrid();
  }

  generateGrid = () => {
    this.grid = [];

    for (let x = 0; x < this.gridDivs; x++) {
      this.grid[x] = [];

      for (let y = 0; y < this.gridDivs; y++) {
        this.grid[x][y] = {
          x,
          y,
          c: [],
        };
      }
    }
  };

  /**
   * Returns:
   *
   * < 0 => overlap
   * = 0 => touching
   * > 0 => separated
   */
  circleDistance = (c1: GridCircle, c2: GridCircle) => {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    //const rr = c1.r + c2.r;
    const rr = c1.r + c2.r + this.pad;

    return dx * dx + dy * dy - rr * rr;
  };

  // given an x and y coordinate, returns the grid cell it falls into
  getTile = (x: number, y: number): GridItem => {
    const gx = this.p.constrain(
      Math.floor(x / this.gridSizeX),
      0,
      this.gridDivs - 1,
    );

    const gy = this.p.constrain(
      Math.floor(y / this.gridSizeY),
      0,
      this.gridDivs - 1,
    );

    return this.grid[gx][gy];
  };

  // get all circles which collide with the current position
  getCircles = (x: number, y: number): GridCircle[] => {
    const tile = this.getTile(x, y);

    const circles: GridCircle[] = [];

    tile.c.forEach((c) => {
      const hit = this.circleDistance(c, {
        x,
        y,
        r: 0,
      });

      if (hit < 0) {
        circles.push(c);
      }
    });

    return circles;
  };

  // gets tiles that are touched by a certain circle
  getGridTilesAround = (x: number, y: number, r: number): GridItem[] => {
    const tl = [
      Math.floor((x - r - this.pad) / this.gridSizeX),
      Math.floor((y - r - this.pad) / this.gridSizeY),
    ];

    const br = [
      Math.floor((x + r + this.pad) / this.gridSizeX),
      Math.floor((y + r + this.pad) / this.gridSizeY),
    ];

    const tiles: GridItem[] = [];

    for (let i = tl[0]; i <= br[0]; i++) {
      for (let j = tl[1]; j <= br[1]; j++) {
        if (i < 0 || j < 0 || i >= this.gridDivs || j >= this.gridDivs) {
          continue;
        }

        tiles.push(this.grid[i][j]);
      }
    }

    return tiles;
  };

  addCircle = (c: GridCircle): GridCircle | null => {
    // break early if out of grid
    if (
      c.x - c.r < 0 ||
      c.x + c.r > this.width ||
      c.y - c.r < 0 ||
      c.y + c.r > this.height
    ) {
      return null;
    }

    // get grid items it could intersect
    const gridTiles = this.getGridTilesAround(c.x, c.y, c.r);

    gridTiles.forEach((t) => {
      this.grid[t.x][t.y].c.push(c);

      if (!c.t) {
        c.t = [];
      }

      c.t.push(`${t.x},${t.y}`);
    });

    this.items.push(c);

    return c;
  };

  tryToAddCircle = (
    x: number,
    y: number,
    minRadius = 3,
    maxRadius = 200,
    actuallyAdd = true,
  ): GridCircle | null => {
    const c1: GridCircle = {
      x,
      y,
      r: minRadius,
      t: [],
    };

    while (true) {
      // break early if out of grid
      if (
        c1.x - c1.r < 0 ||
        c1.x + c1.r > this.width ||
        c1.y - c1.r < 0 ||
        c1.y + c1.r > this.height
      ) {
        return null;
      }

      // get grid items it could intersect
      const gridTiles = this.getGridTilesAround(x, y, c1.r);

      // check against all circles
      for (const tile of gridTiles) {
        for (const c2 of tile.c) {
          const d = this.circleDistance(c1, c2);

          if (d < 0) {
            if (c1.r === minRadius) {
              return null;
            }

            if (actuallyAdd) {
              gridTiles.forEach((t) => {
                this.grid[t.x][t.y].c.push(c1);
                c1.t?.push(`${t.x},${t.y}`);
              });

              this.items.push(c1);
            }

            return c1;
          }
        }
      }

      c1.r += 1;

      if (c1.r > maxRadius) {
        if (actuallyAdd) {
          gridTiles.forEach((t) => {
            this.grid[t.x][t.y].c.push(c1);
            c1.t?.push(`${t.x},${t.y}`);
          });

          this.items.push(c1);
        }

        return c1;
      }
    }
  };

  tryToAddShape = (
    circles: GridCircle[],
    actuallyAdd = true,
  ): GridCircle[] | null => {
    for (const c of circles) {
      if (!this.tryToAddCircle(c.x, c.y, c.r, c.r, false)) {
        return null;
      }
    }

    if (actuallyAdd) {
      circles.forEach((c) => this.addCircle(c));
    }

    return circles;
  };
}

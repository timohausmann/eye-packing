export interface GridCircle {
  x: number;
  y: number;
  r: number;
  t?: string[];
}

export interface GridItem {
  x: number;
  y: number;
  c: GridCircle[];
}

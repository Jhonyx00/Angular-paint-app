import { Cord } from './cord.interface';

export interface Shape {
  shapeType: string;
  color: string;
}

export interface Line extends Shape {
  points: Cord[];
}

export interface Rectangle extends Shape {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Ellipse extends Shape {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  startAngle: number;
  endAngle: number;
}

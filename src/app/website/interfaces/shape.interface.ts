export interface Shape {
  shapeType: string;
  x: number;
  y: number;
  color: string;
}

export interface Line extends Shape {
  x2: number;
  y2: number;
}

export interface Rectangle extends Shape {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Ellipse extends Shape {
  radiusX: number;
  radiusY: number;
  rotation: number;
  startAngle: number;
  endAngle: number;
}

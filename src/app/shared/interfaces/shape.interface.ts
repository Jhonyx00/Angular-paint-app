import { Cord } from './cord.interface';

export interface Shape {
  shapeType: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

///CREAR INTERFACE Box QUE VA A TENER X,Y,W y H PARA CADA FIGURA,
//Cada vez que se dibuje una figura, se establece la caja
//si va a funcionar porque para repintar las figuras existentes solo se deben acceder a ciertas propiedades, no a todas

export interface Line extends Shape {
  points: Cord[];
}

export interface Rectangle extends Shape {
  // w: number;
  // h: number;
}

export interface Ellipse extends Shape {
  radiusX: number;
  radiusY: number;
  rotation: number;
  startAngle: number;
  endAngle: number;
}

// import { Cord } from './cord.interface';

// export interface Shape {
//   shapeType: string;
//   color: string;
//   x: number;
//   y: number;
// }

// // export interface IrregularShape {
// //   shapeType: string;
// //   color: string;
// // }

// export interface Rectangle extends Shape {
//   w: number;
//   h: number;
// }

// export interface Ellipse extends Shape {
//   radiusX: number;
//   radiusY: number;
//   rotation: number;
//   startAngle: number;
//   endAngle: number;
// }

// export interface Line extends Shape {
//   points: Cord[];
// }

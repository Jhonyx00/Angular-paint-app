import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cord } from '../interfaces/cord.interface';
import { Size } from '../interfaces/size.interface';
import { Rectangle } from '../interfaces/shape.interface';
import { Ellipse } from '../interfaces/shape.interface';
import { Line } from '../interfaces/shape.interface';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  constructor() {}

  //puedo usar solo un subject que tenga todos los cambios como un objeto de tipo properties
  //(crear la interface Properties)

  private XY = new BehaviorSubject<Cord>({ x: 0, y: 0 });
  private isOutsideCanvas = new BehaviorSubject<boolean>(false);

  private sizeX = new BehaviorSubject<Size>({ width: 0, height: 0 });
  private shapeList = new BehaviorSubject<(Rectangle | Ellipse | Line)[]>([]);

  posXY = this.XY.asObservable();
  //chek if it is outside canvas
  isOutside = this.isOutsideCanvas.asObservable();

  //canvas size
  canvasSizeValue = this.sizeX.asObservable();
  //Action
  shapeListValue = this.shapeList.asObservable();

  positionXY(posXY: Cord) {
    this.XY.next(posXY);
  }

  outsideCanvas(isOutside: boolean) {
    this.isOutsideCanvas.next(isOutside);
  }

  canvasSize(size: Size) {
    this.sizeX.next(size);
  }

  setShapeList(shapeList: (Rectangle | Ellipse | Line)[]) {
    this.shapeList.next(shapeList);
  }

  private imagesList = new BehaviorSubject<string[]>([]);

  imagesListObservable = this.imagesList.asObservable();

  setImagesList(imageArray: string[]) {
    this.imagesList.next(imageArray);
  }
}

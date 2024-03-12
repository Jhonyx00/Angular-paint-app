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
  private strokeStyle = new BehaviorSubject<string>('#000000');
  private XY = new BehaviorSubject<Cord>({ x: 0, y: 0 });
  private isOutsideCanvas = new BehaviorSubject<boolean>(false);
  private selectedShape = new BehaviorSubject<string>('Line');
  private selectedOption = new BehaviorSubject<string>('');
  private sizeX = new BehaviorSubject<Size>({ width: 0, height: 0 });
  private shapeList = new BehaviorSubject<(Rectangle | Ellipse | Line)[]>([]);

  private cursorStyle = new BehaviorSubject<string>('normal');

  cursor = this.cursorStyle.asObservable();
  color = this.strokeStyle.asObservable();
  posXY = this.XY.asObservable();
  //chek if it is outside canvas
  isOutside = this.isOutsideCanvas.asObservable();
  //selected shape
  selectedShapeValue = this.selectedShape.asObservable();
  selectedOptionValue = this.selectedOption.asObservable();
  //canvas size
  canvasSizeValue = this.sizeX.asObservable();
  //Action
  shapeListValue = this.shapeList.asObservable();

  changeColor(data: string) {
    this.strokeStyle.next(data);
  }

  positionXY(posXY: Cord) {
    this.XY.next(posXY);
  }

  outsideCanvas(isOutside: boolean) {
    this.isOutsideCanvas.next(isOutside);
  }

  setSelectedShape(selectedShape: string) {
    this.selectedShape.next(selectedShape);
  }

  setSelectedOption(selectedOption: string) {
    this.selectedOption.next(selectedOption);
  }

  canvasSize(size: Size) {
    this.sizeX.next(size);
  }

  setShapeList(shapeList: (Rectangle | Ellipse | Line)[]) {
    this.shapeList.next(shapeList);
  }

  setCursor(cursor: string) {
    this.cursorStyle.next(cursor);
  }
}

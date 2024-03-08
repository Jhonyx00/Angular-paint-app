import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cord } from '../interfaces/cord.interface';
import { Size } from '../interfaces/size.interface';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  constructor() {}

  private strokeStyle = new BehaviorSubject<string>('#000000');
  private XY = new BehaviorSubject<Cord>({ x: 0, y: 0 });
  private isOutsideCanvas = new BehaviorSubject<boolean>(false);
  private selectedShape = new BehaviorSubject<number>(0);
  private selectedOption = new BehaviorSubject<number>(0);
  private sizeX = new BehaviorSubject<Size>({ width: 0, height: 0 });

  color = this.strokeStyle.asObservable();
  posXY = this.XY.asObservable();
  //chek if it is outside canvas
  isOutside = this.isOutsideCanvas.asObservable();

  //selected shape
  selectedShapeValue = this.selectedShape.asObservable();
  selectedOptionValue = this.selectedOption.asObservable();

  //canvas size

  canvasSizeValue = this.sizeX.asObservable();

  changeColor(data: string) {
    this.strokeStyle.next(data);
  }

  positionXY(posXY: Cord) {
    this.XY.next(posXY);
  }

  outsideCanvas(isOutside: boolean) {
    this.isOutsideCanvas.next(isOutside);
  }

  setSelectedShape(selectedShape: number) {
    this.selectedShape.next(selectedShape);
  }

  setSelectedOption(selectedOption: number) {
    this.selectedOption.next(selectedOption);
  }

  canvasSize(size: Size) {
    this.sizeX.next(size);
  }
}

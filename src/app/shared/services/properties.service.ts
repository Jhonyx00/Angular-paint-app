import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cord } from '../interfaces/cord.interface';
import { CanvasDimensions } from '../interfaces/canvas-dimensions.interface';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  constructor() {}

  //puedo usar solo un subject que tenga todos los cambios como un objeto de tipo properties
  //(crear la interface Properties)

  private XY = new BehaviorSubject<Cord>({ x: 0, y: 0 });
  private isOutsideCanvas = new BehaviorSubject<boolean>(false);
  private sizeX = new BehaviorSubject<CanvasDimensions>({
    CanvasWidth: 0,
    CanvasHeight: 0,
  });

  posXY = this.XY.asObservable();
  //chek if it is outside canvas
  isOutside = this.isOutsideCanvas.asObservable();
  //canvas size
  canvasSizeValue = this.sizeX.asObservable();

  positionXY(posXY: Cord) {
    this.XY.next(posXY);
  }

  outsideCanvas(isOutside: boolean) {
    this.isOutsideCanvas.next(isOutside);
  }

  canvasSize(size: CanvasDimensions) {
    this.sizeX.next(size);
  }
}

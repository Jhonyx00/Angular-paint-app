import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Point } from '../../shared/interfaces/point.interface';
import { Dimension } from '../interfaces/dimension.interface';

@Injectable({
  providedIn: 'root',
})
export class StatusBarService {
  constructor() {}

  private cursorPosition = new BehaviorSubject<Point>({ x: 0, y: 0 });

  private shapeContainerDimension = new BehaviorSubject<Dimension>({
    width: 0,
    height: 0,
  });
  private isOutsideCanvas = new BehaviorSubject<boolean>(false);
  private canvasDimensions = new BehaviorSubject<Dimension>({
    width: 0,
    height: 0,
  });

  setCursorPosition(posXY: Point) {
    this.cursorPosition.next(posXY);
  }

  setOutsideCanvas(isOutside: boolean) {
    this.isOutsideCanvas.next(isOutside);
  }

  setCanvasDimensions(size: Dimension) {
    this.canvasDimensions.next(size);
  }

  setshapeContainerDimension(dimension: Dimension) {
    this.shapeContainerDimension.next(dimension);
  }

  public getCursorPosition(): Observable<Point> {
    return this.cursorPosition.asObservable();
  }

  public getOutsideCanvas(): Observable<boolean> {
    return this.isOutsideCanvas.asObservable();
  }

  public getCanvasDimensions(): Observable<Dimension> {
    return this.canvasDimensions.asObservable();
  }

  public getshapeContainerDimension(): Observable<Dimension> {
    return this.shapeContainerDimension.asObservable();
  }
}

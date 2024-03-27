import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Point } from '../interfaces/cursor-position.interface';
import { CanvasDimensions } from '../interfaces/canvas-dimensions.interface';

@Injectable({
  providedIn: 'root',
})
export class StatusBarService {
  constructor() {}

  private cursorPosition = new BehaviorSubject<Point>({ x: 0, y: 0 });
  private isOutsideCanvas = new BehaviorSubject<boolean>(false);
  private canvasDimensions = new BehaviorSubject<CanvasDimensions>({
    width: 0,
    height: 0,
  });

  setCursorPosition(posXY: Point) {
    this.cursorPosition.next(posXY);
  }

  setOutsideCanvas(isOutside: boolean) {
    this.isOutsideCanvas.next(isOutside);
  }

  setCanvasDimensions(size: CanvasDimensions) {
    this.canvasDimensions.next(size);
  }

  public getCursorPosition(): Observable<Point> {
    return this.cursorPosition.asObservable();
  }

  public getOutsideCanvas(): Observable<boolean> {
    return this.isOutsideCanvas.asObservable();
  }

  public getCanvasDimensions(): Observable<CanvasDimensions> {
    return this.canvasDimensions.asObservable();
  }
}

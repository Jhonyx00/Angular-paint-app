import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CursorPosition } from '../interfaces/cursor-position.interface';
import { CanvasDimensions } from '../interfaces/canvas-dimensions.interface';
import { StatusbarProperties } from '../interfaces/statusbar-properties.interface';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  constructor() {}

  private cursorPosition = new BehaviorSubject<CursorPosition>({ x: 0, y: 0 });
  private isOutsideCanvas = new BehaviorSubject<boolean>(false);
  private canvasDimensions = new BehaviorSubject<CanvasDimensions>({
    width: 0,
    height: 0,
  });

  setCursorPosition(posXY: CursorPosition) {
    this.cursorPosition.next(posXY);
  }

  setOutsideCanvas(isOutside: boolean) {
    this.isOutsideCanvas.next(isOutside);
  }

  setCanvasDimensions(size: CanvasDimensions) {
    this.canvasDimensions.next(size);
  }

  public getCursorPosition(): Observable<CursorPosition> {
    return this.cursorPosition.asObservable();
  }

  public getOutsideCanvas(): Observable<boolean> {
    return this.isOutsideCanvas.asObservable();
  }
  public getCanvasDimensions(): Observable<CanvasDimensions> {
    return this.canvasDimensions.asObservable();
  }
}

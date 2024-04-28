import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Point } from '../interfaces/point.interface';

@Injectable({
  providedIn: 'root',
})
export class MouseEventService {
  constructor() {}

  private mouseDownPosition = new BehaviorSubject<Point>({ x: 0, y: 0 });
  private mouseMovePosition = new BehaviorSubject<Point>({ x: 0, y: 0 });

  public setMouseDownPosition(mouseDownPosition: Point) {
    this.mouseDownPosition.next(mouseDownPosition);
  }

  public setMouseMovePosition(mouseMovePosition: Point) {
    this.mouseMovePosition.next(mouseMovePosition);
  }

  public getMouseMovePosition(): Observable<Point> {
    return this.mouseMovePosition.asObservable();
  }

  public getMouseDownPosition(): Observable<Point> {
    return this.mouseDownPosition.asObservable();
  }
}

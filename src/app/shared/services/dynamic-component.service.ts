import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Point } from 'src/app/website/interfaces/point.interface';

@Injectable({
  providedIn: 'root',
})
export class DynamicComponentService {
  constructor() {}

  private mouseDownPosition = new BehaviorSubject<Point>({ x: 0, y: 0 });
  private mouseMovePosition = new BehaviorSubject<Point>({ x: 0, y: 0 });
  private resizeButtonId = new BehaviorSubject<number>(0);

  public setMouseDownPosition(mouseDownPosition: Point) {
    this.mouseDownPosition.next(mouseDownPosition);
  }

  public setMouseMovePosition(mouseMovePosition: Point) {
    this.mouseMovePosition.next(mouseMovePosition);
  }

  public setResizeButtonId(resizeButtonId: number) {
    this.resizeButtonId.next(resizeButtonId);
  }

  public getMouseMovePosition(): Observable<Point> {
    return this.mouseMovePosition.asObservable();
  }

  public getMouseDownPosition(): Observable<Point> {
    return this.mouseDownPosition.asObservable();
  }

  public getResizeButtonId(): Observable<number> {
    return this.resizeButtonId;
  }
}

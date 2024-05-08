import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Point } from '../../shared/interfaces/point.interface';
import { Dimension } from '../interfaces/dimension.interface';
import { ShapeContainer } from 'src/app/shared/interfaces/shape.interface';

@Injectable({
  providedIn: 'root',
})
export class StatusBarService {
  constructor() {}

  private cursorPosition = new BehaviorSubject<Point>({ x: 0, y: 0 });

  private props = new BehaviorSubject<
    Pick<ShapeContainer, 'componentClass' | 'width' | 'height'>
  >({ componentClass: '', width: 0, height: 0 });

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

  setProps(
    dimension: Pick<ShapeContainer, 'componentClass' | 'width' | 'height'>
  ) {
    this.props.next(dimension);
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

  public getProps(): Observable<
    Pick<ShapeContainer, 'componentClass' | 'width' | 'height'>
  > {
    return this.props.asObservable();
  }
}

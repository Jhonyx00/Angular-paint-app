import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShapeContainer } from '../interfaces/shape.interface';

@Injectable({
  providedIn: 'root',
})
export class ShapeContainerService {
  constructor() {}

  private shapeContainer = new BehaviorSubject<ShapeContainer>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    background: '',
    componentClass: '',
    referenceTop: 0,
    referenceLeft: 0,
    referenceWidth: 0,
    referenceHeight: 0,
  });

  setShapeContainerPropesties(newShapeContainerDimension: ShapeContainer) {
    this.shapeContainer.next(newShapeContainerDimension);
  }

  getShapeContainer(): Observable<ShapeContainer> {
    return this.shapeContainer.asObservable();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DynamicComponentProperties } from '../interfaces/object-properties';

@Injectable({
  providedIn: 'root',
})
export class DrawingStatusService {
  constructor() {}

  private isDrawing = new BehaviorSubject<boolean>(false);
  //get value
  currentDrawingState = this.isDrawing.asObservable();
  //set value
  changeButtonState(isDrawing: boolean) {
    this.isDrawing.next(isDrawing);
  }

  private dimension = new BehaviorSubject<DynamicComponentProperties>({
    top: '',
    left: '',
    width: '',
    height: '',
    background: '',
  });

  currentDimension = this.dimension.asObservable();

  setDynamicComponentDimensions(newDimension: DynamicComponentProperties) {
    this.dimension.next(newDimension);
  }
}

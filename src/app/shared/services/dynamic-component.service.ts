import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DynamicComponentProperties } from '../interfaces/dynamic-component.interface';

@Injectable({
  providedIn: 'root',
})
export class DrawingStatusService {
  constructor() {}

  private dynamicComponentDimension =
    new BehaviorSubject<DynamicComponentProperties>({
      top: '',
      left: '',
      width: '',
      height: '',
      background: '',
    });

  setDynamicComponentDimensions(newDimension: DynamicComponentProperties) {
    this.dynamicComponentDimension.next(newDimension);
  }

  getDynamicComponentDimensions(): Observable<DynamicComponentProperties> {
    return this.dynamicComponentDimension.asObservable();
  }
}

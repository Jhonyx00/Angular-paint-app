import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DynamicComponentProperties } from '../interfaces/dynamic-component.interface';

@Injectable({
  providedIn: 'root',
})
export class DynamicComponentService {
  constructor() {}

  private dynamicComponentDimension =
    new BehaviorSubject<DynamicComponentProperties>({
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      background: '',
      border: '',
    });

  setDynamicComponentDimensions(newDimension: DynamicComponentProperties) {
    this.dynamicComponentDimension.next(newDimension);
  }

  getAuxComponent(): Observable<DynamicComponentProperties> {
    return this.dynamicComponentDimension.asObservable();
  }
}

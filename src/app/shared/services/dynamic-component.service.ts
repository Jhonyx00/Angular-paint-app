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
      top: '',
      left: '',
      width: '',
      height: '',
      background: '',
      border: '',
    });

  setDynamicComponentDimensions(newDimension: DynamicComponentProperties) {
    this.dynamicComponentDimension.next(newDimension);
  }

  getDynamicComponentDimensions(): Observable<DynamicComponentProperties> {
    return this.dynamicComponentDimension.asObservable();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZoomService {
  constructor() {}

  private zoomFactor = new BehaviorSubject<number>(1);

  setZommFactor(zoomFactor: number) {
    this.zoomFactor.next(zoomFactor);
  }

  getZoomFactor(): Observable<number> {
    return this.zoomFactor.asObservable();
  }
}

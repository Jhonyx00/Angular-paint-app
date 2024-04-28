import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DynamicComponentService {
  constructor() {}

  private resizeButtonId = new BehaviorSubject<number>(0);

  public setResizeButtonId(resizeButtonId: number) {
    this.resizeButtonId.next(resizeButtonId);
  }

  public getResizeButtonId(): Observable<number> {
    return this.resizeButtonId;
  }
}

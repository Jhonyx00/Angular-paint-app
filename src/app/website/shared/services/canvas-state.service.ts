import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanvasStateService {
  constructor() {}
  private updateCanvass = new Subject<void>();

  updateCanvasValue = this.updateCanvass.asObservable();

  updateCanvas() {
    this.updateCanvass.next();
  }
}

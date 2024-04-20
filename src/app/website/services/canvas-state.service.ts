import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanvasStateService {
  constructor() {}
  private imageList = new BehaviorSubject<string[]>([]);
  private isOnCanvas = new BehaviorSubject<boolean>(false);

  public setImageList(imageArray: string[]) {
    this.imageList.next(imageArray);
  }

  public getImageList(): Observable<string[]> {
    return this.imageList.asObservable();
  }

  public setResetValue(isReset: boolean) {
    this.isOnCanvas.next(isReset);
  }

  public getResetValue(): Observable<boolean> {
    return this.isOnCanvas;
  }
}

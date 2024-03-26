import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CanvasDimensions } from '../interfaces/canvas-dimensions.interface';

@Injectable({
  providedIn: 'root',
})
export class CanvasStateService {
  constructor() {}
  private imageList = new BehaviorSubject<string[]>([]);
  private canvasDimensions = new BehaviorSubject<CanvasDimensions>({
    width: 0,
    height: 0,
  });
  public setImageList(imageArray: string[]) {
    this.imageList.next(imageArray);
  }

  public getImageList(): Observable<string[]> {
    return this.imageList.asObservable();
  }

  public setCanvasDimensions(size: CanvasDimensions) {
    this.canvasDimensions.next(size);
  }

  public getCanvasDimensions(): Observable<CanvasDimensions> {
    return this.canvasDimensions.asObservable();
  }

  private isOnCanvas = new BehaviorSubject<boolean>(false);

  public setResetValue(isReset: boolean) {
    this.isOnCanvas.next(isReset);
  }

  public getResetValue(): Observable<boolean> {
    return this.isOnCanvas;
  }
}

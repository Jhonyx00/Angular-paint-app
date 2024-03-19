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
  setImagesList(imageArray: string[]) {
    this.imageList.next(imageArray);
  }

  getImageList(): Observable<string[]> {
    return this.imageList.asObservable();
  }

  setCanvasDimensions(size: CanvasDimensions) {
    this.canvasDimensions.next(size);
  }

  public getCanvasDimensions(): Observable<CanvasDimensions> {
    return this.canvasDimensions.asObservable();
  }
}

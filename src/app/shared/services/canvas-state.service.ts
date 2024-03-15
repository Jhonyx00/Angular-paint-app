import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanvasStateService {
  constructor() {}
  private imagesList = new BehaviorSubject<string[]>([]);

  imagesListObservable = this.imagesList.asObservable();

  setImagesList(imageArray: string[]) {
    this.imagesList.next(imageArray);
  }
}

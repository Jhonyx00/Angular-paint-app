import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageDataService {
  constructor() {}

  //  image
  private image = new BehaviorSubject<ImageData | undefined>(undefined);
  public setImage(image: ImageData): void {
    this.image.next(image);
  }
  public getImage(): Observable<ImageData | undefined> {
    return this.image.asObservable();
  }
}

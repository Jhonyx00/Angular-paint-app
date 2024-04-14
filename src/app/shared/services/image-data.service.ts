import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageDataService {
  constructor() {}

  //  image
  private image = new BehaviorSubject<ImageData | undefined>(undefined);

  private imageDataUrl = new BehaviorSubject<string | undefined>(undefined);

  public setImage(image: ImageData | undefined): void {
    this.image.next(image);
  }

  public setImageDataUrl(imageDataUrl: string | undefined): void {
    this.imageDataUrl.next(imageDataUrl);
  }

  public getImage(): Observable<ImageData | undefined> {
    return this.image.asObservable();
  }

  public getImageDataUrl(): Observable<string | undefined> {
    return this.imageDataUrl.asObservable();
  }
}

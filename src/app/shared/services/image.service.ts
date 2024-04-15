import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageDataService {
  constructor() {}

  //  image
  private image = new BehaviorSubject<ImageData | undefined>(undefined);
  private imageDataUrl = new BehaviorSubject<string>('');

  public setImage(image: ImageData | undefined): void {
    this.image.next(image);
  }

  public setImageDataUrl(imageDataUrl: string): void {
    this.imageDataUrl.next(imageDataUrl);
  }

  public getImage(): Observable<ImageData | undefined> {
    return this.image.asObservable();
  }

  public getImageDataUrl(): Observable<string> {
    return this.imageDataUrl.asObservable();
  }
}

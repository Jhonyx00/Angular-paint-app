import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cord } from '../interfaces/cord.interface';
import { ObjectProperties } from '../interfaces/object-properties';

@Injectable({
  providedIn: 'root',
})
export class DrawingStatusService {
  constructor() {}

  private isDrawing = new BehaviorSubject<boolean>(false);
  //get value
  currentDrawingState = this.isDrawing.asObservable();
  //set value
  changeButtonState(isDrawing: boolean) {
    this.isDrawing.next(isDrawing);
  }

  ///// colocar ancho dinámico

  private ancho = new BehaviorSubject<ObjectProperties>({
    top: '',
    left: '',
    width: '',
    height: '',
  });

  anchoActual = this.ancho.asObservable();

  cambiarAncho(ancho: ObjectProperties) {
    this.ancho.next(ancho);
  }
}

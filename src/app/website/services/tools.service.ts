import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  constructor() {}

  //  selected button
  private selectedButton = new BehaviorSubject<string>('Line');

  public setSelectedButton(selectedShape: string): void {
    this.selectedButton.next(selectedShape);
  }

  public getSelectedButton(): Observable<string> {
    return this.selectedButton.asObservable();
  }

  //  color
  private selectedColor = new BehaviorSubject<string>('#000000');

  public changeColor(data: string): void {
    this.selectedColor.next(data);
  }

  public getSelectedColor(): Observable<string> {
    return this.selectedColor.asObservable();
  }

  //crear un behavior subject que indique si esta dentro o fuera del foco del canvas al hacer click en la pantalla
  // para controlar el reseteo
}

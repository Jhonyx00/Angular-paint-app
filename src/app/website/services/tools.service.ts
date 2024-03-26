import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tools } from '../enums/tools.enum';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  constructor() {}

  //  selected button
  private selectedButton = new BehaviorSubject<Tools>(Tools.Line);

  public setSelectedButton(selectedShape: Tools): void {
    this.selectedButton.next(selectedShape);
  }

  public getSelectedButton(): Observable<Tools> {
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
}

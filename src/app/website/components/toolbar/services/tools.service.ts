import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  constructor() {}

  //  selected button
  private selectedButton = new BehaviorSubject<string>('Line');
  selectedButtonObservable = this.selectedButton.asObservable();
  public setSelectedButton(selectedShape: string): void {
    this.selectedButton.next(selectedShape);
  }
  //  color
  private selectedColor = new BehaviorSubject<string>('#000000');
  color = this.selectedColor.asObservable();
  public changeColor(data: string): void {
    this.selectedColor.next(data);
  }
}

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
  private strokeStyle = new BehaviorSubject<string>('#000000');
  color = this.strokeStyle.asObservable();
  public changeColor(data: string): void {
    this.strokeStyle.next(data);
  }
}

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
  setSelectedButton(selectedShape: string) {
    this.selectedButton.next(selectedShape);
  }
  //  color
  private strokeStyle = new BehaviorSubject<string>('#000000');
  color = this.strokeStyle.asObservable();
  changeColor(data: string) {
    this.strokeStyle.next(data);
  }
}

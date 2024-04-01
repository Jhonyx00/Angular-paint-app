import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToolName } from '../enums/tool-name.enum';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  constructor() {}

  //  selected button
  private selectedButton = new BehaviorSubject<ToolName>(ToolName.Line);

  public setSelectedButton(selectedShape: ToolName): void {
    this.selectedButton.next(selectedShape);
  }

  public getSelectedButton(): Observable<ToolName> {
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

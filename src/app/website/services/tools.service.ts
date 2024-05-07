import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ToolName } from '../enums/tool-name.enum';
import { IconTool, Menu } from '../interfaces/tool.interface';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  constructor() {}

  //  selected button
  private selectedButton = new BehaviorSubject<IconTool>({
    id: 3,
    name: ToolName.Line,
    icon: '',
  });

  public setSelectedButton(selectedButton: IconTool): void {
    this.selectedButton.next(selectedButton);
  }

  public getSelectedButton(): Observable<IconTool> {
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

  private hasOptions = new Subject<Menu | null>();

  public getOptions() {
    return this.hasOptions.asObservable();
  }

  public setOptions(options: Menu | null) {
    this.hasOptions.next(options);
  }
}

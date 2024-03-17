import { Component } from '@angular/core';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-color',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.css'],
})
export class ColorComponent {
  constructor(private toolsService: ToolsService) {}

  public colors = new Array<string>(9);
  public input!: HTMLInputElement;
  setColor(event: Event) {
    this.input = event.target as HTMLInputElement;

    if (this.input) {
      this.toolsService.changeColor(this.input.value);
      console.log('Color: ', this.input.value);
      this.colors.unshift(this.input.value);
      this.colors.pop();
      console.log('Color palette: ', this.colors);
    }
  }

  setPaletteColor(color: string) {
    this.input.value = color;
    this.toolsService.changeColor(color);
  }
}

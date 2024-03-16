import { Component } from '@angular/core';
import { ToolsService } from '../toolbar/services/tools.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css'],
})
export class ColorComponent {
  constructor(private toolsService: ToolsService) {}

  setColor(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input) {
      this.toolsService.changeColor(input.value);
      console.log('Color: ', input.value);
    }
  }
}

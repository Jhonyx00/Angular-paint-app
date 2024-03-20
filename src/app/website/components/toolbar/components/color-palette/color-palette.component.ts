import { Component, OnDestroy } from '@angular/core';
import { ToolsService } from '../../../../services/tools.service';

@Component({
  selector: 'app-color',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.css'],
})
export class ColorComponent implements OnDestroy {
  constructor(private toolsService: ToolsService) {}

  public colors = new Array<string>(9);
  public input!: HTMLInputElement;

  setColor(event: Event) {
    this.input = event.target as HTMLInputElement;

    if (this.input) {
      this.toolsService.changeColor(this.input.value);
      this.colors.unshift(this.input.value);
      this.colors.pop();
    }
  }

  setPaletteColor(color: string) {
    if (color != undefined) {
      this.input.value = color;
      this.toolsService.changeColor(color);
    } else {
      console.log('no se puede perrillo');
    }
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}

//no necesitaba notificar naada

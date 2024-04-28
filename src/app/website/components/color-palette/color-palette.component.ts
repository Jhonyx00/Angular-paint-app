import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { ToolsService } from '../../services/tools.service';
import { CanvasStateService } from '../../services/canvas-state.service';

@Component({
  selector: 'color-palette-component',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.css'],
})
export class ColorPaletteComponent implements AfterViewInit {
  constructor(
    private toolsService: ToolsService,
    private renderer: Renderer2
  ) {}

  public colors = new Array<string>(12);

  private input!: HTMLInputElement;

  ngAfterViewInit(): void {
    this.colors[0] = '#0000ff';
    this.colors[1] = '#00ff00';
    this.colors[2] = '#ff0000';
    this.colors[3] = '#ffff00';
    this.colors[4] = '#00ffff';
    this.colors[5] = '#ffae00';
    this.colors[5] = '#ffd1f5';
    this.colors[5] = '#000000';

    this.colors[6] = '#ffd1f5';
    this.colors[7] = '#ff0000';
    this.colors[8] = '#ffff00';
    this.colors[9] = '#00ffff';
    this.colors[10] = '#ffae00';
    this.colors[11] = '#ffd1f5';

    this.input = this.renderer.selectRootElement('#color-chooser', false);
  }

  setColor() {
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
    }
  }
}

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

  public colors = new Array<string>(15);

  private input!: HTMLInputElement;

  ngAfterViewInit(): void {
    this.colors[0] = '#ece6d0';
    this.colors[1] = '#df9d81';
    this.colors[2] = '#d7e235';
    this.colors[3] = '#c5b82b';
    this.colors[4] = '#f7512b';
    this.colors[5] = '#008a93';
    this.colors[8] = '#5f89ca';
    this.colors[7] = '#b7ce5a';

    this.colors[6] = '#7b4b59';
    this.colors[9] = '#b070db';
    this.colors[10] = '#3b4d1b';

    this.colors[11] = '#ccdaf0';
    this.colors[12] = '#ffcac0';
    this.colors[13] = '#cdeaf0';
    this.colors[14] = '#abdaf4';
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

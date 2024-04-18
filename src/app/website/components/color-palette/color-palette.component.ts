import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { ToolsService } from '../../services/tools.service';

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

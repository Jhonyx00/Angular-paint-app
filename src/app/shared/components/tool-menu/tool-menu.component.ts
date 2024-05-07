import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { IconTool } from 'src/app/website/interfaces/tool.interface';

@Component({
  selector: 'app-tool-menu',
  templateUrl: './tool-menu.component.html',
  styleUrls: ['./tool-menu.component.css'],
})
export class ToolMenuComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  @Input() toolGroupName: string = '';
  @Input() toolItems: IconTool[] = [];

  ngOnInit(): void {
    this.initPosition();
  }

  initPosition() {
    const toolItemBounding = this.renderer.selectRootElement('.Shapes', true);

    const { width, top } = toolItemBounding.getBoundingClientRect();

    const toolMenu = this.renderer.selectRootElement('.tool-menu', true);

    this.renderer.setStyle(toolMenu, 'left', width + 'px');
    this.renderer.setStyle(toolMenu, 'top', top + 'px');
  }
}

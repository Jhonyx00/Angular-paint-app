import { Component, OnInit } from '@angular/core';
import { DrawingStatusService } from '../../services/drawing-status.service';
import { ToolsService } from 'src/app/website/components/toolbar/services/tools.service';

@Component({
  selector: 'app-aux-div',
  templateUrl: './aux-div.component.html',
  styleUrls: ['./aux-div.component.css'],
})
export class AuxDivComponent implements OnInit {
  constructor(
    private drawingStateService: DrawingStatusService,
    private toolsService: ToolsService
  ) {}
  ngOnInit(): void {
    this.initColor();
    this.initShapeDimensions();
  }

  private initShapeDimensions() {
    this.drawingStateService.currentDimension.subscribe((current) => {
      this.width = current.width;
      this.height = current.height;
      this.top = current.top;
      this.left = current.left;
    });
  }

  private initColor() {
    this.toolsService.color.subscribe((currentColor) => {
      this.color = currentColor;
    });
  }
  public color = '';
  public width = '';
  public height = '';
  public top = '';
  public left = '';
}

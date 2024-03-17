import { Component, OnInit } from '@angular/core';
import { DrawingStatusService } from '../../services/drawing-status.service';
import { ToolsService } from 'src/app/website/components/toolbar/services/tools.service';
import { DynamicComponentProperties } from '../../interfaces/object-properties';

@Component({
  selector: 'app-aux-div',
  templateUrl: './aux-div.component.html',
  styleUrls: ['./aux-div.component.css'],
})
export class AuxDivComponent implements OnInit {
  constructor(private drawingStateService: DrawingStatusService) {}

  ngOnInit(): void {
    this.initShapeDimensions();
  }

  private initShapeDimensions() {
    this.drawingStateService.currentDimension.subscribe((current) => {
      this.objectProps.width = current.width;
      this.objectProps.height = current.height;
      this.objectProps.top = current.top;
      this.objectProps.left = current.left;
      this.objectProps.background = current.background;
    });
  }

  public objectProps: DynamicComponentProperties = {
    width: '',
    height: '',
    top: '',
    left: '',
    background: '',
  };
}

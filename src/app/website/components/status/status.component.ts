import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../../shared/services/properties.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class StatusComponent implements OnInit {
  constructor(private propertiesService: PropertiesService) {}

  public x: number = 0;
  public y: number = 0;

  CanvasWidth: number = 0;
  CanvasHeight: number = 0;

  isOutside: boolean = false;

  ngOnInit(): void {
    this.updateCursorPosition();
    this.updateCursorState();
    this.displayCanvasDimensions();
  }

  private updateCursorPosition() {
    this.propertiesService.posXY.subscribe((currentPosition) => {
      this.x = currentPosition.x;
      this.y = currentPosition.y;
    });
  }

  private updateCursorState() {
    this.propertiesService.isOutside.subscribe((isOutside) => {
      this.isOutside = isOutside;
    });
  }

  private displayCanvasDimensions() {
    this.propertiesService.canvasSizeValue.subscribe((currentSize) => {
      this.CanvasWidth = currentSize.CanvasWidth;
      this.CanvasHeight = currentSize.CanvasHeight;
    });
  }
}

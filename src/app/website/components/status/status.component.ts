import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class StatusComponent implements OnInit {
  constructor(private propertiesService: PropertiesService) {}

  x: number = 0;
  y: number = 0;

  width: number = 0;
  height: number = 0;

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
      this.width = currentSize.width;
      this.height = currentSize.height;
    });
  }
}

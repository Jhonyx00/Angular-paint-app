import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../../shared/services/properties.service';
import { CursorPosition } from 'src/app/shared/interfaces/cursor-position.interface';
import { CanvasDimensions } from 'src/app/shared/interfaces/canvas-dimensions.interface';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class StatusComponent implements OnInit {
  constructor(private propertiesService: PropertiesService) {}

  public cursosrPosition: CursorPosition = {
    x: 0,
    y: 0,
  };

  public canvasDimensions: CanvasDimensions = {
    width: 0,
    height: 0,
  };

  isOutside: boolean = false;

  ngOnInit(): void {
    this.updateCursorPosition();
    this.updateCursorState();
    this.displayCanvasDimensions();
  }

  private updateCursorPosition() {
    this.propertiesService.getCursorPosition().subscribe((currentPosition) => {
      this.cursosrPosition.x = currentPosition.x;
      this.cursosrPosition.y = currentPosition.y;
    });
  }

  private updateCursorState() {
    this.propertiesService.getOutsideCanvas().subscribe((isOutside) => {
      this.isOutside = isOutside;
    });
  }

  private displayCanvasDimensions() {
    this.propertiesService.getCanvasDimensions().subscribe((currentSize) => {
      this.canvasDimensions.width = currentSize.width;
      this.canvasDimensions.height = currentSize.height;
    });
  }
}

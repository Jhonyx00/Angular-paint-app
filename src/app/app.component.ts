import { Component } from '@angular/core';
import { Point } from './website/interfaces/point.interface';
import { MouseEventService } from './website/services/mouse-event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  mouseDownPosition: Point = {
    x: 0,
    y: 0,
  };
  constructor(private mouseEventService: MouseEventService) {}

  title = 'PaintXD';

  onWheel(event: WheelEvent, options: {}) {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }

  private isOnContainer = false;

  onMouseDown(event: MouseEvent) {
    this.isOnContainer = true;
    // this.mouseEventService.setMoseUp(true);
    this.mouseEventService.setMouseDownPosition({
      x: event.offsetX,
      y: event.offsetY,
    });
  }

  onMouseMove(event: MouseEvent) {
    if (this.isOnContainer) {
      this.mouseEventService.setMouseMovePosition({
        x: event.offsetX,
        y: event.offsetY,
      });
      // console.log('app', event.offsetX, event.offsetY);
    }
  }

  onMouseUp() {
    this.isOnContainer = false;
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Point } from './website/interfaces/point.interface';
import { MouseEventService } from './website/services/mouse-event.service';
import { StatusBarService } from './website/services/statusbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private mouseEventService: MouseEventService,
    private statusBarService: StatusBarService
  ) {}

  private isOutside = false;
  ngOnInit(): void {
    this.init();
  }

  init() {
    this.statusBarService.getOutsideCanvas().subscribe((isOutside) => {
      this.isOutside = isOutside;
    });
  }

  title = 'PaintXD';

  mouseDownPosition: Point = {
    x: 0,
    y: 0,
  };

  onWheel(event: WheelEvent, options: {}) {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }

  private isOnContainer = false;

  onMouseDown(event: MouseEvent) {
    if (event.button === 0 && !this.isOutside) {
      this.isOnContainer = true;
      this.mouseEventService.setMouseDownPosition({
        x: event.offsetX,
        y: event.offsetY,
      });
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.isOnContainer && !this.isOutside) {
      this.mouseEventService.setMouseMovePosition({
        x: event.offsetX,
        y: event.offsetY,
      });
    }
  }

  onMouseUp() {
    this.isOnContainer = false;
  }
}

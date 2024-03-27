import { Component, OnDestroy, OnInit } from '@angular/core';
import { StatusBarService } from '../../services/statusbar.service';
import { Point } from 'src/app/website/interfaces/cursor-position.interface';
import { CanvasDimensions } from 'src/app/website/interfaces/canvas-dimensions.interface';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class StatusComponent implements OnInit {
  constructor(private statusBarService: StatusBarService) {}

  public cursosrPosition: Point = {
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
    this.statusBarService.getCursorPosition().subscribe((currentPosition) => {
      this.cursosrPosition = currentPosition;
    });
  }

  private updateCursorState() {
    this.statusBarService.getOutsideCanvas().subscribe((isOutside) => {
      this.isOutside = isOutside;
    });
  }

  private displayCanvasDimensions() {
    this.statusBarService.getCanvasDimensions().subscribe((currentSize) => {
      this.canvasDimensions = currentSize;
    });
  }
}

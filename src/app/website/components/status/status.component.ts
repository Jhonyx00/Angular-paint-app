import { Component, OnDestroy, OnInit } from '@angular/core';
import { StatusBarService } from '../../services/statusbar.service';
import { CursorPosition } from 'src/app/website/interfaces/cursor-position.interface';
import { CanvasDimensions } from 'src/app/website/interfaces/canvas-dimensions.interface';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class StatusComponent implements OnInit, OnDestroy {
  constructor(private statusBarService: StatusBarService) {}

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
    this.statusBarService.getCursorPosition().subscribe((currentPosition) => {
      this.cursosrPosition.x = currentPosition.x;
      this.cursosrPosition.y = currentPosition.y;
    });
  }

  private updateCursorState() {
    this.statusBarService.getOutsideCanvas().subscribe((isOutside) => {
      this.isOutside = isOutside;
    });
  }

  private displayCanvasDimensions() {
    this.statusBarService.getCanvasDimensions().subscribe((currentSize) => {
      this.canvasDimensions.width = currentSize.width;
      this.canvasDimensions.height = currentSize.height;
    });
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}

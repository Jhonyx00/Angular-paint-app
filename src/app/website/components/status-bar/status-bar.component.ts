import { Component, OnDestroy, OnInit } from '@angular/core';
import { StatusBarService } from '../../services/statusbar.service';
import { Point } from 'src/app/website/interfaces/point.interface';
import { Dimension } from '../../interfaces/dimension.interface';

@Component({
  selector: 'statusbar-component',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css'],
})
export class StatusBarComponent implements OnInit {
  constructor(private statusBarService: StatusBarService) {}

  public cursosrPosition: Point = {
    x: 0,
    y: 0,
  };

  public canvasDimensions: Dimension = {
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
    this.statusBarService
      .getCanvasDimensions()
      .subscribe((currentCanvasDimensions) => {
        this.canvasDimensions = currentCanvasDimensions;
      });
  }
}

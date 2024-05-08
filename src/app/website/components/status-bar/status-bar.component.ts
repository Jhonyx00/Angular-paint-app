import { Component, OnDestroy, OnInit } from '@angular/core';
import { StatusBarService } from '../../services/statusbar.service';
import { Point } from 'src/app/shared/interfaces/point.interface';
import { Dimension } from '../../interfaces/dimension.interface';
import { ShapeContainer } from 'src/app/shared/interfaces/shape.interface';

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

  // public shapeContainerDimension: Dimension = {
  //   width: 0,
  //   height: 0,
  // };

  public props: Pick<ShapeContainer, 'componentClass' | 'width' | 'height'> = {
    componentClass: '',
    width: 0,
    height: 0,
  };

  isOutside: boolean = false;

  ngOnInit(): void {
    this.updateCursorPosition();
    this.updateCursorState();
    this.displayCanvasDimensions();
    this.displayShapeContainerDimension();
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

  private displayShapeContainerDimension() {
    this.statusBarService.getProps().subscribe((currentProps) => {
      this.props = currentProps;
    });
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { DrawingStatusService } from '../../services/drawing-status.service';
import { CanvasComponent } from 'src/app/website/components/canvas/canvas.component';

@Component({
  selector: 'app-aux-div',
  templateUrl: './aux-div.component.html',
  styleUrls: ['./aux-div.component.css'],
})
export class AuxDivComponent implements OnInit {
  constructor(
    private drawingStateService: DrawingStatusService,
    @Inject(CanvasComponent) private canvasComponent: CanvasComponent
  ) {}
  ngOnInit(): void {
    this.drawingStateService.anchoActual.subscribe((current) => {
      this.width = current.width;
      this.height = current.height;
      this.top = current.top;
      this.left = current.left;
    });

    this.drawingStateService.currentDrawingState.subscribe((currentState) => {
      this.isDrawing = currentState;
    });
  }

  public isDrawing = false;
  public width = '';
  public height = '';
  public top = '';
  public left = '';

  deleteComponent() {
    console.log('soltaste el componente');

    this.canvasComponent.deleteComponent();
  }
  resizeDiv(event: MouseEvent) {
    if (this.isDrawing) {
      console.log('Redimensionando');

      this.width = event.offsetX + 'px';
      this.height = event.offsetY + 'px';
    }
  }
}

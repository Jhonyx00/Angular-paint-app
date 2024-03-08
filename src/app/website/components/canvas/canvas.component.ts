import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { Elipse, Rectangle } from '../../interfaces/rectangle.interface';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;

  constructor(private propertiesService: PropertiesService) {}
  ngOnInit(): void {
    this.propertiesService.canvasSize({
      width: this.width,
      height: this.height,
    });
  }

  height: number = 0;
  width: number = 0;
  color: string = '#000000';
  option = 0;
  private shape: number = 0;
  @Input('properties') set properties(newCanvas: {
    width: number;
    height: number;
  }) {
    this.width = newCanvas.width;
    this.height = newCanvas.height;
  }

  private ctx!: CanvasRenderingContext2D;
  private isDrawing: boolean = false;

  //position
  private x: number = 0;
  private y: number = 0;

  //SHAPES
  public shapeList = new Array();
  public rectangleDimensions: Rectangle = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    color: '#000000',
  };

  public ovalDimensions: Elipse = {
    x: 0,
    y: 0,
    radiusX: 0,
    radiusY: 0,
    rotation: 0,
    startAngle: 0,
    endAngle: 0,
    color: '#000000',
  };

  ngAfterViewInit(): void {
    //when canvas is absolutely available
    this.ctx = this.canvas.nativeElement.getContext('2d');

    //GET properties canvas needs
    this.propertiesService.color.subscribe((currentColor) => {
      this.color = currentColor;
      this.ctx.fillStyle = this.color;
    });

    this.propertiesService.selectedShapeValue.subscribe((currentShape) => {
      this.shape = currentShape;
    });

    //GET properties canvas needs
    this.propertiesService.selectedOptionValue.subscribe((currentOption) => {
      this.option = currentOption;

      if (this.option === 1) {
        this.saveWork();

        console.log(this.option);
      }
    });
  }

  //Mouse events
  mouseDown(event: MouseEvent) {
    //press mouse
    this.isDrawing = true;

    this.x = event.offsetX;
    this.y = event.offsetY;
  }

  mouseMove(event: MouseEvent) {
    //this.ctx.fillStyle = this.color;

    if (this.isDrawing) {
      //SHAPE SELECTION
      switch (this.shape) {
        case 0:
          this.drawLine(event);
          break;
        case 1:
          this.drawRectangle(event);
          break;
        case 2:
          this.drawOval(event);
          break;
        case 3:
          break;
        default:
          break;
      }
    }

    //SET properties to be accesibble from other components
    this.propertiesService.positionXY({ x: event.offsetX, y: event.offsetY });
  }

  mouseUp(event: MouseEvent) {
    this.isDrawing = false;

    if (this.shape == 1) {
      this.shapeList.push(this.rectangleDimensions);
    } else {
      this.shapeList.push(this.ovalDimensions);
    }

    console.log('Todas las figuras', this.shapeList);
  }

  mouseEnter() {
    //SET properties
    this.propertiesService.outsideCanvas(false);
  }

  mouseLeave() {
    //SET properties
    this.propertiesService.outsideCanvas(true);
  }

  paintAllShapes() {
    this.shapeList.forEach((shape) => {
      this.ctx.fillStyle = shape.color;
      this.ctx.fillRect(shape.x, shape.y, shape.w, shape.h);

      this.ctx.beginPath();
      // this.ctx.fillStyle = shape.color;

      this.ctx.ellipse(
        shape.x,
        shape.y,
        shape.radiusX,
        shape.radiusY,
        shape.rotation,
        shape.startAngle,
        shape.endAngle
      );
      this.ctx.fill();
    });
  }

  //DRAWING FUNCTIONS

  //0
  public drawLine(event: MouseEvent) {
    this.ctx.strokeStyle = this.color;

    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
    this.x = event.offsetX;
    this.y = event.offsetY;
  }

  //1
  public drawRectangle(event: MouseEvent) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.paintAllShapes();
    this.ctx.fillStyle = this.color;
    /// this.paintAllShapes();

    this.ctx.fillRect(
      this.x,
      this.y,
      event.offsetX - this.x,
      event.offsetY - this.y
    );

    //Set rectangle values
    this.rectangleDimensions = {
      x: this.x,
      y: this.y,
      w: event.offsetX - this.x,
      h: event.offsetY - this.y,
      color: this.color,
    };
  }

  //2
  public drawOval(event: MouseEvent) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.paintAllShapes();
    this.ctx.fillStyle = this.color;

    const relativeX = event.offsetX - this.x;
    const relativeY = event.offsetY - this.y;
    let newX = 0;
    let newY = 0;

    if (relativeX > 0 && relativeY < 0) {
      newX = this.x + Math.abs(this.x - event.offsetX) / 2;
      newY = this.y - Math.abs(this.y - event.offsetY) / 2;
      //console.log('CUADRANTE 1');
    } else if (relativeX < 0 && relativeY < 0) {
      newX = this.x - Math.abs(this.x - event.offsetX) / 2;
      newY = this.y - Math.abs(this.y - event.offsetY) / 2;
      // console.log('CUADRANTE 2');
    } else if (relativeX < 0 && relativeY > 0) {
      newX = this.x - Math.abs(this.x - event.offsetX) / 2;
      newY = this.y + Math.abs(this.y - event.offsetY) / 2;
      // console.log('CUADRANTE 3');
    } else {
      newX = this.x + Math.abs(this.x - event.offsetX) / 2;
      newY = this.y + Math.abs(this.y - event.offsetY) / 2;
      //console.log('CUADRANTE 4');
    }

    //this.ctx.fillStyle = this.color;

    this.ctx.beginPath();
    this.ctx.ellipse(
      newX,
      newY,
      Math.abs(event.offsetX - this.x) / 2,
      Math.abs(event.offsetY - this.y) / 2,
      0,
      0,
      2 * Math.PI
    );
    this.ctx.fill();

    this.ovalDimensions = {
      x: newX,
      y: newY,
      radiusX: Math.abs(event.offsetX - this.x) / 2,
      radiusY: Math.abs(event.offsetY - this.y) / 2,
      rotation: 0,
      startAngle: 0,
      endAngle: 2 * Math.PI,
      color: this.color,
    };
  }

  //OPTIONS FROM TOOLBAR

  public saveWork() {
    const base64ImageData = this.canvas.nativeElement.toDataURL();

    let imageName = prompt('Enter name');

    const downloadLink = document.createElement('a');
    downloadLink.href = base64ImageData;

    downloadLink.download = imageName || 'image1';
    downloadLink.click();

    window.URL.revokeObjectURL(downloadLink.href);
  }
}

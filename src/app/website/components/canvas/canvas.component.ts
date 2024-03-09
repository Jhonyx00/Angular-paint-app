import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { Ellipse } from '../../interfaces/shape.interface';
import { Rectangle } from '../../interfaces/shape.interface';
import { Line } from '../../interfaces/shape.interface';
import { CanvasStateService } from '../../services/canvas-state.service';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;

  constructor(
    private propertiesService: PropertiesService,
    private canvasStateService: CanvasStateService
  ) {}
  ngOnInit(): void {
    this.propertiesService.canvasSize({
      width: this.width,
      height: this.height,
    });

    this.canvasStateService.updateCanvasValue.subscribe(() => {
      this.paintAllShapes();
    });
  }
  width: number = 800;
  height: number = 500;

  color: string = '#000000';
  option = 0;
  private shape: number = 0;

  public ctx!: CanvasRenderingContext2D;
  private isDrawing: boolean = false;

  //position
  private x: number = 0;
  private y: number = 0;

  //SHAPE ARRAY
  public shapeList: (Rectangle | Ellipse | Line)[] = [];
  public newShapeList: (Rectangle | Ellipse | Line)[] = [];
  //SHAPES
  // Objects that represents the shapes in order to be drawn on the canvas before a new drawing
  // is being painted
  public lineDimensions: Line = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 0,
    color: '#000000',
    shapeType: '',
  };

  public rectangleDimensions: Rectangle = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    color: '#000000',
    shapeType: '',
  };

  public ellipseDimensions: Ellipse = {
    x: 0,
    y: 0,
    radiusX: 0,
    radiusY: 0,
    rotation: 0,
    startAngle: 0,
    endAngle: 0,
    color: '#000000',
    shapeType: '',
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
          this.drawEllipse(event);
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

    switch (this.shape) {
      case 0:
        //PUSH INTO LINE ARRAY
        this.shapeList.push(this.lineDimensions);
        //this.canvas.nativeElement.save();
        break;
      case 1:
        this.shapeList.push(this.rectangleDimensions);

        break;
      case 2:
        this.shapeList.push(this.ellipseDimensions);

        break;
      default:
        break;
    }

    console.log('Todas las figuras', this.shapeList);
    this.propertiesService.setShapeList(this.shapeList);
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
    this.propertiesService.shapeListValue.subscribe((currentShapeList) => {
      this.shapeList = currentShapeList;
    });

    this.ctx.clearRect(0, 0, this.width, this.height);

    // for (const shape of this.shapeList) {
    // }

    this.shapeList.forEach((shape) => {
      switch (shape.shapeType) {
        case 'Line':
          const line = shape as Line;
          this.ctx.strokeStyle = line.color;
          this.ctx.beginPath();
          this.ctx.moveTo(line.x, line.y);
          this.ctx.lineTo(line.x2, line.y2);
          this.ctx.stroke();
          break;
        case 'Rectangle':
          const rectangle = shape as Rectangle;
          this.ctx.fillStyle = rectangle.color;
          this.ctx.fillRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
          break;
        case 'Ellipse':
          const ellipse = shape as Ellipse;
          this.ctx.beginPath();
          // this.ctx.fillStyle = shape.color;
          this.ctx.fillStyle = ellipse.color;
          this.ctx.ellipse(
            ellipse.x,
            ellipse.y,
            ellipse.radiusX,
            ellipse.radiusY,
            ellipse.rotation,
            ellipse.startAngle,
            ellipse.endAngle
          );
          this.ctx.fill();
          break;

        default:
          break;
      }

      // if ('w' in shape) {
      //   this.ctx.fillStyle = shape.color;
      //   this.ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
      // } else if ('radiusX' in shape) {
      //   this.ctx.beginPath();
      //   // this.ctx.fillStyle = shape.color;
      //   this.ctx.fillStyle = shape.color;
      //   this.ctx.ellipse(
      //     shape.x,
      //     shape.y,
      //     shape.radiusX,
      //     shape.radiusY,
      //     shape.rotation,
      //     shape.startAngle,
      //     shape.endAngle
      //   );
      //   this.ctx.fill();
      // }
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

    this.lineDimensions = {
      shapeType: 'Line',
      x: this.x,
      x2: this.y,
      y: event.offsetX,
      y2: event.offsetY,
      color: this.color,
    };
  }

  //1
  public drawRectangle(event: MouseEvent) {
    this.paintAllShapes();
    this.ctx.fillStyle = this.color;

    const w = event.offsetX - this.x;
    const h = event.offsetY - this.y;
    this.ctx.fillRect(this.x, this.y, w, h);

    //Rectangle object
    this.rectangleDimensions = {
      shapeType: 'Rectangle',
      x: this.x,
      y: this.y,
      w: w,
      h: h,
      color: this.color,
    };
  }

  //2
  public drawEllipse(event: MouseEvent) {
    this.paintAllShapes();
    this.ctx.fillStyle = this.color;

    const relativeX = event.offsetX - this.x;
    const relativeY = event.offsetY - this.y;
    let newX = 0;
    let newY = 0;
    const endAngle = 2 * Math.PI;

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

    this.ctx.beginPath();
    this.ctx.ellipse(
      newX,
      newY,
      Math.abs(event.offsetX - this.x) / 2,
      Math.abs(event.offsetY - this.y) / 2,
      0,
      0,
      endAngle
    );
    this.ctx.fill();

    //Oval object
    this.ellipseDimensions = {
      shapeType: 'Ellipse',
      x: newX,
      y: newY,
      radiusX: Math.abs(event.offsetX - this.x) / 2,
      radiusY: Math.abs(event.offsetY - this.y) / 2,
      rotation: 0,
      startAngle: 0,
      endAngle: endAngle,
      color: this.color,
    };
  }

  //OPTIONS FROM TOOLBAR
  public saveWork() {
    const base64ImageData = this.canvas.nativeElement.toDataURL();
    let imageName = prompt('Enter image name');
    const downloadLink = document.createElement('a');
    downloadLink.href = base64ImageData;
    downloadLink.download = imageName || 'image1';
    downloadLink.click();
    window.URL.revokeObjectURL(downloadLink.href);
  }
}

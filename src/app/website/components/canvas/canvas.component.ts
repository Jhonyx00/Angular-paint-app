import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { PropertiesService } from '../../../shared/services/properties.service';
import { Ellipse } from '../../../shared/interfaces/shape.interface';
import { Rectangle } from '../../../shared/interfaces/shape.interface';
import { Line } from '../../../shared/interfaces/shape.interface';
import { CanvasStateService } from '../../../shared/services/canvas-state.service';
import { Cord } from '../../../shared/interfaces/cord.interface';
import { ToolsService } from '../toolbar/services/tools.service';
import { AuxDivComponent } from '../../../shared/components/aux-div/aux-div.component';

import { DynamicHostDirective } from '../../../shared/directives/dynamic-host.directive';
import { DrawingStatusService } from 'src/app/shared/services/drawing-status.service';
import { ObjectProperties } from 'src/app/shared/interfaces/object-properties';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit, OnInit {
  touchDown(event: TouchEvent) {
    console.log(
      `tocado en x:${event.touches[0].clientX}, y:${event.touches[0].clientY}`
    );
  }
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;

  public div!: any;
  public objectProps: ObjectProperties = {
    width: '',
    height: '',
    top: '',
    left: '',
  };
  // private divInitialPosition: Cord = { x: 0, y: 0 };
  public selectedShape!: Rectangle | Ellipse | Line;

  constructor(
    private propertiesService: PropertiesService,
    private canvasStateService: CanvasStateService,
    private toolsService: ToolsService,
    private drawingStatusService: DrawingStatusService
  ) {}
  ngOnInit(): void {
    this.initCanvasDimensions();
    this.updateCanvasValue();
  }

  private initCanvasDimensions() {
    this.propertiesService.canvasSize({
      width: this.width,
      height: this.height,
    });
  }

  private updateCanvasValue() {
    this.canvasStateService.updateCanvasValue.subscribe(() => {
      //this.paintAllShapes();
    });
  }

  width: number = 800;
  height: number = 500;

  private color: string = '#000000';
  // private option = '';

  public toolName = '';
  private ctx!: CanvasRenderingContext2D;
  private isDrawing: boolean = false;

  //position
  private x: number = 0;
  private y: number = 0;

  private isSelected = false;

  //SHAPE ARRAY
  private shapeList: (Rectangle | Ellipse | Line)[] = [];
  private points: Cord[] = [];

  //SELECTED SHAPE BY CLICKING

  //SHAPES
  // Objects that represents the shapes in order to be drawn on the canvas before a new drawing
  // is being painted
  private lineDimensions: Line = {
    color: '#000000',
    shapeType: '',
    points: [{ x: 0, y: 0 }],
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };

  private rectangleDimensions: Rectangle = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    color: '#000000',
    shapeType: '',
  };

  private ellipseDimensions: Ellipse = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
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
    this.initColor();
    this.initTool();
    this.initShape();
    // this.initFileOption();
  }
  private initShape() {
    this.drawingStatusService.currentDimension.subscribe((currentShape) => {
      this.objectProps = currentShape;
      //console.log(this.objectProps);
    });
  }

  ///                     AFTER VIEW INIT FUNCTIONS
  private initColor() {
    this.toolsService.color.subscribe((currentColor) => {
      this.color = currentColor;
      this.ctx.fillStyle = this.color;
    });
  }

  // private initTool() {
  //   this.toolsService.selectedShapeValue.subscribe((currentTool) => {
  //   });
  // }
  private initTool() {
    this.toolsService.selectedButtonObservable.subscribe((currentTool) => {
      this.toolName = currentTool;

      if (this.toolName === 'Save') {
        this.saveWork();
        console.log(this.toolName);
      }
    });
  }

  public XY: Cord = { x: 0, y: 0 };
  ///                     MOUSE EVENTS
  mouseDown(event: MouseEvent) {
    //press mouse
    // if (this.toolName === 'Move') {
    //   this.selectShape(event);
    // } else {
    this.isDrawing = true;

    this.drawingStatusService.changeButtonState(true);
    this.x = event.offsetX;
    this.y = event.offsetY;

    if (this.toolName != 'Line' && this.toolName != 'Eraser') {
      //colocar las condiciones que no sean figuras

      //puesto que solo las figuras ocupan el componente dinamico
      this.createComponent();
    }

    console.log(`Punto inicial x: ${this.x}, y: ${this.y}`);
  }

  mouseMove(event: MouseEvent) {
    // no pintar las figuras si se sibuja una linea,
    // o si se selecciona una figura (esto es por si se quiere colocar un recuadro que contenga a la figura seleccionada)

    // if (
    //   this.toolName != 'Line' &&
    //   this.toolName != 'Move' &&
    //   this.toolName != 'Eraser'
    // ) {
    //   //this.paintAllShapes();
    // } else if (this.isSelected) {
    //   this.moveShape(event, this.selectedShape);
    // }

    //si se esta dibujando
    if (this.isDrawing) {
      //SHAPE SELECTION
      switch (this.toolName) {
        case 'Line':
          this.drawLine(event);
          break;
        case 'Rectangle':
          // this.drawRectangle(event);
          this.drawRectangleDiv(event);
          break;
        case 'Ellipse':
          this.drawEllipse(event);
          break;

        case 'Eraser':
          this.erase(event);
          break;
        default:
          break;
      }
    }
    //SET properties to be accesibble from status component
    this.propertiesService.positionXY({ x: event.offsetX, y: event.offsetY });
  }

  mouseUp() {
    console.log('mouse soltado/////');
    this.isSelected = false; //se deja de seleccionar una figura
    this.isDrawing = false;
    this.drawingStatusService.changeButtonState(false);
    this.points = []; //reset points

    switch (this.toolName) {
      case 'Line':
        this.shapeList.push(this.lineDimensions);
        break;
      case 'Rectangle':
        this.drawRectangle(this.objectProps);
        //this.shapeList.push(this.rectangleDimensions);
        break;
      case 'Ellipse':
        this.shapeList.push(this.ellipseDimensions);
        break;
      default:
        break;
    }

    console.log('Todas las figuras', this.shapeList);

    this.deleteComponent();
    this.propertiesService.setShapeList(this.shapeList);
  }

  mouseEnter() {
    this.propertiesService.outsideCanvas(false);
  }

  mouseLeave() {
    this.propertiesService.outsideCanvas(true);
  }

  // private paintAllShapes() {
  //   this.propertiesService.shapeListValue.subscribe((currentShapeList) => {
  //     this.shapeList = currentShapeList;
  //   });

  //   this.ctx.clearRect(0, 0, this.width, this.height);

  //   this.shapeList.forEach((shape) => {
  //     switch (shape.shapeType) {
  //       case 'Line':
  //         const line = shape as Line;
  //         this.ctx.strokeStyle = line.color;
  //         this.ctx.beginPath();
  //         for (let x = 0; x < line.points.length; x++) {
  //           this.ctx.lineTo(line.points[x].x, line.points[x].y);
  //         }
  //         this.ctx.stroke();
  //         break;

  //       case 'Rectangle':
  //         const rectangle = shape as Rectangle;
  //         this.ctx.fillStyle = rectangle.color;
  //         this.ctx.fillRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
  //         break;

  //       case 'Ellipse':
  //         const ellipse = shape as Ellipse;
  //         this.ctx.beginPath();
  //         // this.ctx.fillStyle = shape.color;
  //         this.ctx.fillStyle = ellipse.color;
  //         this.ctx.ellipse(
  //           ellipse.x,
  //           ellipse.y,
  //           ellipse.radiusX,
  //           ellipse.radiusY,
  //           ellipse.rotation,
  //           ellipse.startAngle,
  //           ellipse.endAngle
  //         );
  //         this.ctx.fill();
  //         break;
  //       ///other cases
  //       default:
  //         break;
  //     }
  //   });
  // }
  ///                     SHAPES
  //0

  private drawLine(event: MouseEvent) {
    this.ctx.strokeStyle = this.color;

    this.ctx.lineWidth = 5;

    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
    this.x = event.offsetX;
    this.y = event.offsetY;

    this.points.push({
      x: this.x,
      y: this.y,
    });

    this.lineDimensions = {
      shapeType: 'Line',
      color: this.color,
      points: this.points,
      x: this.points[0].x,
      y: this.points[0].y,
      w: this.points[this.points.length - 1].x,
      h: this.points[this.points.length - 1].y,
    };
  }

  private drawRectangleDiv(event: MouseEvent) {
    const w = event.offsetX - this.x;
    const h = event.offsetY - this.y;

    this.div.style.borderColor = this.color;

    const newX = Math.abs(event.offsetX - this.x);
    const newY = Math.abs(event.offsetY - this.y);

    // Quadrant 1
    if (w > 0 && h < 0) {
      //console.log('Cuarante 1');
      this.drawingStatusService.setDimensions({
        top: event.offsetY + 'px',
        left: this.x + 'px',
        width: newX + 'px',
        height: newY + 'px',
      });
    }
    // Quadrant 2
    else if (w < 0 && h < 0) {
      //console.log('Cuarante 2');
      this.drawingStatusService.setDimensions({
        top: event.offsetY + 'px',
        left: event.offsetX + 'px',
        width: newX + 'px',
        height: newY + 'px',
      });
    }
    // Quadrant 3
    else if (w < 0 && h > 0) {
      //console.log('Cuarante 3');
      this.drawingStatusService.setDimensions({
        top: this.y + 'px',
        left: event.offsetX + 'px',
        width: newX + 'px',
        height: newY + 'px',
      });
    }
    //Quadrant 4
    else {
      //console.log('Cuarante 4');
      this.drawingStatusService.setDimensions({
        top: this.y + 'px',
        left: this.x + 'px',
        width: newX + 'px',
        height: newY + 'px',
      });
    }
  }

  //1
  private drawRectangle(shapeObject: ObjectProperties) {
    this.ctx.fillStyle = this.color;

    this.ctx.fillRect(
      parseFloat(shapeObject.left),
      parseFloat(shapeObject.top),
      parseFloat(shapeObject.width),
      parseFloat(shapeObject.height)
    );
  }

  //2
  private drawEllipse(event: MouseEvent) {
    this.ctx.fillStyle = this.color;
    const relativeX = event.offsetX - this.x;
    const relativeY = event.offsetY - this.y;
    let newX = 0;
    let newY = 0;
    const endAngle = 2 * Math.PI;

    // Quadrant 1
    if (relativeX > 0 && relativeY < 0) {
      newX = this.x + Math.abs(this.x - event.offsetX) / 2;
      newY = this.y - Math.abs(this.y - event.offsetY) / 2;
    }
    // Quadrant 2
    else if (relativeX < 0 && relativeY < 0) {
      newX = this.x - Math.abs(this.x - event.offsetX) / 2;
      newY = this.y - Math.abs(this.y - event.offsetY) / 2;
    }
    // Quadrant 3
    else if (relativeX < 0 && relativeY > 0) {
      newX = this.x - Math.abs(this.x - event.offsetX) / 2;
      newY = this.y + Math.abs(this.y - event.offsetY) / 2;
    }
    //Quadrant 4
    else {
      newX = this.x + Math.abs(this.x - event.offsetX) / 2;
      newY = this.y + Math.abs(this.y - event.offsetY) / 2;
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
      w: Math.abs(event.offsetX - this.x),
      h: Math.abs(event.offsetY - this.y),
      radiusX: Math.abs(event.offsetX - this.x) / 2,
      radiusY: Math.abs(event.offsetY - this.y) / 2,
      rotation: 0,
      startAngle: 0,
      endAngle: endAngle,
      color: this.color,
    };
  }

  ///                     ERASE

  private erase(event: MouseEvent) {
    this.ctx.clearRect(event.offsetX, event.offsetY, 10, 10);
    //console.log(event.offsetX, event.offsetY);
  }

  ///                     SELECT
  //SELECT A SHAPE
  private selectShape(event: MouseEvent) {
    const posX = event.offsetX;
    const posY = event.offsetY;

    this.shapeList.find((shape) => {
      if (
        posX >= shape.x &&
        posX <= shape.w + shape.x &&
        posY >= shape.y &&
        posY <= shape.h + shape.y
      ) {
        this.ctx.strokeStyle = 'blue';
        this.ctx.setLineDash([5, 5]);

        this.ctx.rect(shape.x, shape.y, shape.w, shape.h);
        this.ctx.stroke();

        //rectangle selector
        this.selectedShape = shape;
        console.log('Selected shape', this.selectedShape);
        this.isSelected = true;

        this.XY = {
          x: Math.abs(this.selectedShape.x - event.offsetX),
          y: Math.abs(this.selectedShape.y - event.offsetY),
        };
      }
    });
  }
  //MOVE A SHAPE
  private moveShape(event: MouseEvent, shape: Ellipse | Rectangle | Line) {
    //SET CONDITIONS FOR EACH SHAPE
    if (shape.shapeType === 'Line') {
      const line = shape as Line;

      console.log('Shape', line);

      // line.points[0].x = event.offsetX - this.XY.x;
      // line.points[0].y = event.offsetY - this.XY.y;

      line.points[10].x = event.offsetX;
      line.points[10].y = event.offsetY;

      // for (let x = 0; x < line.points.length; x++) {
      //   line.points[x].x = event.offsetX - this.XY.x;
      //   line.points[x].y = event.offsetY - this.XY.y;
      // }
    } else {
      shape.x = event.offsetX - this.XY.x;
      shape.y = event.offsetY - this.XY.y;
    }

    //this.paintAllShapes();
  }

  ///                     FILE
  private saveWork() {
    const base64ImageData = this.canvas.nativeElement.toDataURL();
    let imageName = prompt('Enter image name');
    const downloadLink = document.createElement('a');
    downloadLink.href = base64ImageData;
    downloadLink.download = imageName || 'image1';
    downloadLink.click();
    window.URL.revokeObjectURL(downloadLink.href);
  }

  //    DINAMIC COMPONENT
  @ViewChild(DynamicHostDirective, { read: ViewContainerRef })
  public dynamicHost!: ViewContainerRef;
  private componentRef!: ComponentRef<AuxDivComponent>;

  public createComponent(): void {
    this.componentRef = this.dynamicHost.createComponent(AuxDivComponent);
    this.div = this.componentRef.location.nativeElement as HTMLElement;
  }

  public deleteComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}

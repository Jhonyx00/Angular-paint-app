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
import { CanvasStateService } from '../../../shared/services/canvas-state.service';
import { ToolsService } from '../toolbar/services/tools.service';
import { AuxDivComponent } from '../../../shared/components/aux-div/aux-div.component';
import { DynamicHostDirective } from '../../../shared/directives/dynamic-host.directive';
import { DrawingStatusService } from 'src/app/shared/services/drawing-status.service';
import { DynamicComponentProperties } from 'src/app/shared/interfaces/object-properties';
import { CanvasDimensions } from 'src/app/shared/interfaces/canvas-dimensions.interface';
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

  constructor(
    private propertiesService: PropertiesService,
    private canvasStateService: CanvasStateService,
    private toolsService: ToolsService,
    private drawingStatusService: DrawingStatusService
  ) {}

  @ViewChild('canvas', { static: true }) canvas!: ElementRef;

  ///////// VARS

  private div!: any;

  private imagesArray: string[] = [];
  private objectProps: DynamicComponentProperties = {
    width: '',
    height: '',
    top: '',
    left: '',
  };

  private canvasDimensions: CanvasDimensions = {
    CanvasWidth: 800,
    CanvasHeight: 500,
  };

  private currentCanvasImage = new Image();
  private color: string = '#000000';

  private toolName = '';
  private ctx!: CanvasRenderingContext2D;
  private isDrawing: boolean = false;

  // Mouse down position
  private x: number = 0;
  private y: number = 0;

  ////ON INIT
  ngOnInit(): void {
    this.initCanvasDimensions();
    // this.initCurrentDrawing();
    //set images when redo or undo button clicked
  }
  private initCanvasDimensions() {
    this.canvas.nativeElement.width = this.canvasDimensions.CanvasWidth;
    this.canvas.nativeElement.height = this.canvasDimensions.CanvasHeight;
    this.propertiesService.canvasSize(this.canvasDimensions);
  }

  ////AFTER INIT
  ngAfterViewInit(): void {
    //when canvas is absolutely available
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.initColor();
    this.initTool();
    this.initAuxDynamicComponent();

    //new
    this.updateCanvasValue();
  }

  ///                     AFTER VIEW INIT FUNCTIONS
  private initColor() {
    this.toolsService.color.subscribe((currentColor) => {
      this.color = currentColor;
      this.ctx.fillStyle = this.color;
    });
  }

  private initTool() {
    this.toolsService.selectedButtonObservable.subscribe((currentTool) => {
      this.toolName = currentTool;

      if (this.toolName === 'Save') {
        this.saveWork();
        console.log(this.toolName);
      }
    });
  }

  private initAuxDynamicComponent() {
    this.drawingStatusService.currentDimension.subscribe((currentShape) => {
      this.objectProps = currentShape;
    });
  }

  private updateCanvasValue() {
    this.canvasStateService.imagesListObservable.subscribe((currentList) => {
      this.imagesArray = currentList;

      if (this.imagesArray.length > 0) {
        this.setCurrentCanvasImage();
      } else {
        this.ctx.clearRect(
          0,
          0,
          this.canvasDimensions.CanvasWidth,
          this.canvasDimensions.CanvasHeight
        );
      }
    });
  }

  ///                     MOUSE EVENTS
  mouseDown(event: MouseEvent) {
    this.isDrawing = true;

    this.drawingStatusService.changeButtonState(true);
    this.x = event.offsetX;
    this.y = event.offsetY;

    if (
      this.toolName != 'Line' &&
      this.toolName != 'Eraser' &&
      this.toolName != 'Select'
    ) {
      //puesto que solo las figuras ocupan el componente dinamico
      this.createComponent();
    }
  }

  mouseMove(event: MouseEvent) {
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
    this.isDrawing = false;
    this.drawingStatusService.changeButtonState(false);

    switch (this.toolName) {
      case 'Line':
        //this.shapeList.push(this.lineDimensions);
        break;
      case 'Rectangle':
        this.drawRectangle(this.objectProps);
        //this.shapeList.push(this.rectangleDimensions);
        break;
      case 'Ellipse':
        //this.shapeList.push(this.ellipseDimensions);
        break;
      default:
        break;
    }
    this.deleteComponent();
    this.imagesArray.push(this.canvas.nativeElement.toDataURL());
    //this.canvasStateService.setImagesList(this.imagesArray);
  }

  mouseEnter() {
    this.propertiesService.outsideCanvas(false);
  }

  mouseLeave() {
    this.propertiesService.outsideCanvas(true);
  }

  //esta funcion de abajo se ejecuta cada vez que se suelta el mouse
  private setCurrentCanvasImage() {
    this.currentCanvasImage.src = this.imagesArray[this.imagesArray.length - 1];
    console.log('IMAGEN A MOSTRAR', this.currentCanvasImage.src);
    this.currentCanvasImage.onload = () => {
      this.ctx.clearRect(
        0,
        0,
        this.canvasDimensions.CanvasWidth,
        this.canvasDimensions.CanvasHeight
      );
      this.ctx.drawImage(this.currentCanvasImage, 0, 0);
    };
  }

  ///                     SHAPES
  //0

  private drawLine(event: MouseEvent) {
    this.ctx.strokeStyle = this.color;

    this.ctx.lineWidth = 3;

    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
    this.x = event.offsetX;
    this.y = event.offsetY;
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
  private drawRectangle(shapeObject: DynamicComponentProperties) {
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
  }

  ///                     ERASE

  private erase(event: MouseEvent) {
    this.ctx.clearRect(event.offsetX, event.offsetY, 10, 10);
    //console.log(event.offsetX, event.offsetY);
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

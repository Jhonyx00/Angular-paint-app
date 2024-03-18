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
import { every } from 'rxjs';
import { Cord } from 'src/app/shared/interfaces/cord.interface';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit, OnInit {
  constructor(
    private propertiesService: PropertiesService,
    private canvasStateService: CanvasStateService,
    private toolsService: ToolsService,
    private drawingStatusService: DrawingStatusService
  ) {}

  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  @ViewChild(DynamicHostDirective, { read: ViewContainerRef })

  ///////// VARS
  //DYNAMIC COMPONENT
  private dynamicHost!: ViewContainerRef;
  private componentRef!: ComponentRef<AuxDivComponent>;
  public isInsideDynamicComponent = false;
  public isSelectDrawn = false;

  private div!: HTMLElement;
  public XY: Cord = { x: 0, y: 0 };

  private imagesArray: string[] = [];

  private props = {
    color: 'blue',
    stroke: '',
  };
  private objectProps: DynamicComponentProperties = {
    width: '',
    height: '',
    top: '',
    left: '',
    background: '',
  };

  private canvasDimensions: CanvasDimensions = {
    CanvasWidth: 800,
    CanvasHeight: 500,
  };

  private currentCanvasImage = new Image();
  private color: string = '';

  private toolName = '';
  private ctx!: CanvasRenderingContext2D;
  private isDrawing: boolean = false;

  // Mouse down position
  private x: number = 0;
  private y: number = 0;

  ////ON INIT
  ngOnInit(): void {
    this.initCanvasDimensions();
    this.initAuxDynamicComponent();
    // this.initCurrentDrawing();
    //set images when redo or undo button clicked
  }
  private initCanvasDimensions(): void {
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

    //new
    this.updateCanvasValue();
  }

  ///                     AFTER VIEW INIT FUNCTIONS
  private initColor(): void {
    this.toolsService.color.subscribe((currentColor) => {
      this.color = currentColor;
      this.ctx.strokeStyle = this.color;
      this.ctx.fillStyle = this.color;
    });
  }

  private initTool(): void {
    this.toolsService.selectedButtonObservable.subscribe((currentTool) => {
      this.toolName = currentTool;
      console.log('Tool: ', this.toolName);
      if (this.toolName === 'Save') {
        this.saveWork();
        console.log(this.toolName);
      }
    });
  }

  private initAuxDynamicComponent(): void {
    this.drawingStatusService.currentDimension.subscribe((currentShape) => {
      this.objectProps = currentShape;
    });
  }

  private updateCanvasValue(): void {
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
  public mouseDown(event: MouseEvent): void {
    this.isDrawing = true;

    this.drawingStatusService.changeButtonState(true);
    this.x = event.offsetX;
    this.y = event.offsetY;

    if (
      this.toolName != 'Line' &&
      this.toolName != 'Eraser' &&
      this.toolName != 'Move'
    ) {
      //puesto que solo las figuras ocupan el componente dinamico
      this.createComponent();
    }

    if (this.toolName == 'Move') {
      this.XY = {
        x: Math.abs(parseFloat(this.objectProps.left) - event.offsetX),
        y: Math.abs(parseFloat(this.objectProps.top) - event.offsetY),
      };
    }
  }

  public mouseMove(event: MouseEvent): void {
    //si se esta dibujando
    if (this.isDrawing) {
      //SHAPE SELECTION
      switch (this.toolName) {
        case 'Line':
          this.drawLine(event);
          break;
        case 'Rectangle':
          this.drawRectangleDiv(event);
          break;
        case 'Ellipse':
          this.drawEllipse(event);
          break;

        case 'Select':
          this.selectArea(event, this.props);

          break;

        case 'Move':
          this.moveObject(event);
          break;

        case 'Eraser':
          this.erase(event);
          break;
        default:
          break;
      }
    } else {
      if (this.isSelectDrawn) {
        this.isMouseInside(event);
      }
    }

    //SET properties to be accesibble from status component
    this.propertiesService.positionXY({ x: event.offsetX, y: event.offsetY });
  }

  moveObject(event: MouseEvent) {
    if (this.isInsideDynamicComponent) {
      console.log(`Move to x:${event.offsetX}, y:${event.offsetY}`);
      this.objectProps.top = event.offsetY - this.XY.y + 'px';
      this.objectProps.left = event.offsetX - this.XY.x + 'px';

      this.drawingStatusService.setDynamicComponentDimensions(this.objectProps);
    }
  }

  isMouseInside(event: MouseEvent) {
    if (
      event.offsetY > parseFloat(this.objectProps.top) &&
      event.offsetY <
        parseFloat(this.objectProps.height) +
          parseFloat(this.objectProps.top) &&
      event.offsetX > parseFloat(this.objectProps.left) &&
      event.offsetX <
        parseFloat(this.objectProps.width) + parseFloat(this.objectProps.left)
    ) {
      this.toolName = 'Move'; //Avoid nested select
      this.isInsideDynamicComponent = true;
      console.log('dentro', this.toolName);
    } else {
      this.toolName = 'Select'; // a new select can be drawed

      this.isInsideDynamicComponent = false;
      console.log('fuera', this.toolName);
    }
  }

  public mouseUp(): void {
    this.isDrawing = false;
    this.drawingStatusService.changeButtonState(false);

    switch (this.toolName) {
      case 'Line':
        //this.shapeList.push(this.lineDimensions);
        break;
      case 'Rectangle':
        this.drawRectangle(this.objectProps);
        this.deleteComponent(); //delete component when any shape is drawed
        //this.shapeList.push(this.rectangleDimensions);
        break;
      case 'Ellipse':
        //this.shapeList.push(this.ellipseDimensions);
        break;

      case 'Move':
        //this.toolName = 'Select';

        break;

      case 'Select':
        this.cut(this.objectProps);
        this.isSelectDrawn = true; //significa que se dibujo un rectangulo de "select"
        break;
      default:
        break;
    }

    this.imagesArray.push(this.canvas.nativeElement.toDataURL());
    //this.canvasStateService.setImagesList(this.imagesArray);
  }

  public mouseEnter(): void {
    this.propertiesService.outsideCanvas(false);
  }

  public mouseLeave(): void {
    this.propertiesService.outsideCanvas(true);
  }

  //esta funcion de abajo se ejecuta cada vez que se suelta el mouse
  private setCurrentCanvasImage(): void {
    this.currentCanvasImage.src = this.imagesArray[this.imagesArray.length - 1];
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

  private drawLine(event: MouseEvent): void {
    //these two must be public and its value can change with toolbar buttons
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
    this.x = event.offsetX;
    this.y = event.offsetY;
  }

  private drawRectangleDiv(event: MouseEvent): void {
    const w = event.offsetX - this.x;
    const h = event.offsetY - this.y;

    const newX = Math.abs(event.offsetX - this.x);
    const newY = Math.abs(event.offsetY - this.y);

    // Quadrant 1
    if (w > 0 && h < 0) {
      this.objectProps = {
        top: event.offsetY + 'px',
        left: this.x + 'px',
        width: newX + 'px',
        height: newY + 'px',
        background: this.color,
      };
    }
    // Quadrant 2
    else if (w < 0 && h < 0) {
      this.objectProps = {
        top: event.offsetY + 'px',
        left: event.offsetX + 'px',
        width: newX + 'px',
        height: newY + 'px',
        background: this.color,
      };
    }
    // Quadrant 3
    else if (w < 0 && h > 0) {
      //console.log('Cuarante 3');
      this.objectProps = {
        top: this.y + 'px',
        left: event.offsetX + 'px',
        width: newX + 'px',
        height: newY + 'px',
        background: this.color,
      };
    }
    //Quadrant 4
    else {
      this.objectProps = {
        top: this.y + 'px',
        left: this.x + 'px',
        width: newX + 'px',
        height: newY + 'px',
        background: this.color,
      };
    }

    this.drawingStatusService.setDynamicComponentDimensions(this.objectProps);
  }

  //podria devolver un objeto con las dimensiones del rectangulo recien dibujado para luego poder moverlo
  private drawRectangle(shapeObject: DynamicComponentProperties): void {
    this.ctx.fillRect(
      parseFloat(shapeObject.left),
      parseFloat(shapeObject.top),
      parseFloat(shapeObject.width),
      parseFloat(shapeObject.height)
    );
  }

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
  private erase(event: MouseEvent): void {
    this.ctx.clearRect(event.offsetX, event.offsetY, 10, 10);
    //console.log(event.offsetX, event.offsetY);
  }

  ///                     FILE
  private saveWork(): void {
    const base64ImageData = this.canvas.nativeElement.toDataURL();
    let imageName = prompt('Enter image name');
    const downloadLink = document.createElement('a');
    downloadLink.href = base64ImageData;
    downloadLink.download = imageName || 'image1';
    downloadLink.click();
    window.URL.revokeObjectURL(downloadLink.href);
  }

  //    DINAMIC COMPONENT FUNCTIONS

  private createComponent(): void {
    this.componentRef = this.dynamicHost.createComponent(AuxDivComponent);
    this.div = this.componentRef.location.nativeElement as HTMLElement;
  }

  private deleteComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
  private selectArea(event: MouseEvent, proprs: {}): void {
    // console.log(proprs);

    this.ctx.setLineDash([5, 5]);
    this.ctx.fillStyle = 'transparent';
    this.ctx.strokeStyle = 'black';

    const w = event.offsetX - this.x;
    const h = event.offsetY - this.y;

    const newX = Math.abs(event.offsetX - this.x);
    const newY = Math.abs(event.offsetY - this.y);

    // Quadrant 1
    if (w > 0 && h < 0) {
      this.objectProps = {
        top: event.offsetY + 'px',
        left: this.x + 'px',
        width: newX + 'px',
        height: newY + 'px',
        background: this.color,
      };
    }
    // Quadrant 2
    else if (w < 0 && h < 0) {
      this.objectProps = {
        top: event.offsetY + 'px',
        left: event.offsetX + 'px',
        width: newX + 'px',
        height: newY + 'px',
        background: this.color,
      };
    }
    // Quadrant 3
    else if (w < 0 && h > 0) {
      //console.log('Cuarante 3');
      this.objectProps = {
        top: this.y + 'px',
        left: event.offsetX + 'px',
        width: newX + 'px',
        height: newY + 'px',
        background: this.color,
      };
    }
    //Quadrant 4
    else {
      this.objectProps = {
        top: this.y + 'px',
        left: this.x + 'px',
        width: newX + 'px',
        height: newY + 'px',
        background: this.props.color,
      };
    }

    this.drawingStatusService.setDynamicComponentDimensions(this.objectProps);
  }

  public showDinamicComponent() {
    console.log('Comp dinamico', this.objectProps);
  }
  public cut(area: DynamicComponentProperties) {
    //colocar cursor move
    //console.log('Area:', area);

    //console.log(parseFloat(area.width));

    this.ctx.clearRect(
      parseFloat(area.left),
      parseFloat(area.top),
      parseFloat(area.width),
      parseFloat(area.height)
    );

    //this.imagesArray.push(this.canvas.nativeElement.toDataURL()); //guarda la seleccion

    //console.log(this.imagesArray);

    //this.imagesArray.push(this.canvas.nativeElement.toDataURL()); //guarda la imagen con el cacho arrancado de la seleccion

    // ////carga la imagen al canvas
    // this.currentCanvasImage.src = this.imagesArray[0];
    // this.currentCanvasImage.onload = () => {
    //   this.ctx.clearRect(
    //     0,
    //     0,
    //     this.canvasDimensions.CanvasWidth,
    //     this.canvasDimensions.CanvasHeight
    //   );
    //   this.ctx.drawImage(this.currentCanvasImage, 0, 0);
    // };

    // this.ctx.clearRect(
    //   0,
    //   0,
    //   this.canvasDimensions.CanvasWidth,
    //   parseFloat(area.top)
    // );

    // this.ctx.clearRect(
    //   0,
    //   0,
    //   parseFloat(area.left),
    //   this.canvasDimensions.CanvasHeight
    // );

    // this.ctx.clearRect(
    //   parseFloat(area.left),
    //   parseFloat(area.height) + parseFloat(area.top),
    //   this.canvasDimensions.CanvasWidth,
    //   this.canvasDimensions.CanvasHeight
    // );

    // this.ctx.clearRect(
    //   parseFloat(area.left) + parseFloat(area.width),
    //   parseFloat(area.top),
    //   this.canvasDimensions.CanvasWidth,
    //   this.canvasDimensions.CanvasHeight
    // );

    //this.imagesArray.push(this.canvas.nativeElement.toDataURL()); //guarda la seleccion
  }
}

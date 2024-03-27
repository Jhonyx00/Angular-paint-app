import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { StatusBarService } from '../../services/statusbar.service';
import { CanvasStateService } from '../../services/canvas-state.service';
import { ToolsService } from '../../services/tools.service';
import { AuxDivComponent } from '../../../shared/components/aux-div/aux-div.component';
import { DynamicHostDirective } from '../../../shared/directives/dynamic-host.directive';
import { DynamicComponentService } from 'src/app/shared/services/dynamic-component.service';
import { DynamicComponentProperties } from 'src/app/shared/interfaces/dynamic-component.interface';
import { CanvasDimensions } from 'src/app/website/interfaces/canvas-dimensions.interface';
import { Point } from 'src/app/website/interfaces/cursor-position.interface';
import { ImageDataService } from '../../../shared/services/image-data.service';
import { Tools } from '../../enums/tools.enum';
import { Cursors } from '../../enums/cursors.enum';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit, OnInit, OnDestroy {
  constructor(
    private statusBarService: StatusBarService,
    private canvasStateService: CanvasStateService,
    private toolsService: ToolsService,
    private dynamicComponentService: DynamicComponentService,
    private imageDataService: ImageDataService
  ) {}

  ///////// VARS

  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  @ViewChild(DynamicHostDirective, { read: ViewContainerRef })

  //DYNAMIC COMPONENT
  private dynamicHost!: ViewContainerRef;
  private componentRef!: ComponentRef<AuxDivComponent>;
  private isInsideDynamicComponent = false;
  private isSelectDrawn = false;

  private selectedImage: ImageData | undefined;
  public canvasCursor: Cursors = Cursors.Crosshair;
  private XY: Point = {
    x: 0,
    y: 0,
  };

  // private polygonCoords: Point[] = [];
  private imagesArray: string[] = [];

  private objectProps: DynamicComponentProperties = {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    background: '',
    outline: '',
    clipPath: '',
  };

  private canvasDimensions: CanvasDimensions = {
    width: 800,
    height: 500,
  };

  private currentCanvasImage = new Image();
  private color: string = '';

  private toolName!: Tools;

  private ctx!: CanvasRenderingContext2D;

  private isDrawing: boolean = false;

  // Mouse down position
  private mouseDownPosition: Point = {
    x: 0,
    y: 0,
  };

  ////ON INIT
  ngOnInit(): void {
    this.initCanvasDimensions();
    this.initAuxDynamicComponent();
  }

  private initCanvasDimensions(): void {
    this.canvas.nativeElement.width = this.canvasDimensions.width;
    this.canvas.nativeElement.height = this.canvasDimensions.height;
    this.statusBarService.setCanvasDimensions(this.canvasDimensions);
  }

  ////AFTER INIT
  //when canvas is absolutely available

  ngAfterViewInit(): void {
    this.initContext();
    this.initColor();
    this.initTool();
    this.updateCanvasValue();
    this.setInitialValues();
  }

  private initContext() {
    this.ctx = this.canvas.nativeElement.getContext('2d', {
      willReadFrequently: true,
    });
  }

  ///                     AFTER VIEW INIT FUNCTIONS
  private initColor(): void {
    this.toolsService.getSelectedColor().subscribe((currentColor) => {
      this.color = currentColor;
      this.ctx.strokeStyle = this.color;
      this.ctx.fillStyle = this.color;
    });
  }

  private initTool(): void {
    // get last value from behavior subject
    this.toolsService.getSelectedButton().subscribe((currentTool: Tools) => {
      this.toolName = currentTool; //get tool name
      this.canvasStateService.setResetValue(false);
    });
  }

  private setInitialValues(): void {
    this.canvasStateService.getResetValue().subscribe((currentState) => {
      //console.log('Current state:', currentState);

      if (!currentState) {
        //check if there is still a last selected area
        if (this.selectedImage != undefined && this.toolName != Tools.Move) {
          this.checkLastSelectedArea();
        }
        //reset values
        this.resetAuxComponent();
        this.resetObjectProperties();

        //this.dynamicHost.clear(); //i should not use this
      }
    });
  }

  private resetAuxComponent() {
    this.selectedImage = undefined;
    this.imageDataService.setImage(this.selectedImage);
  }

  private resetObjectProperties() {
    this.objectProps.top = 0;
    this.objectProps.left = 0;
    this.objectProps.width = 0;
    this.objectProps.height = 0;
    this.objectProps.outline = '';
    this.objectProps.background = '';
  }

  private initAuxDynamicComponent(): void {
    this.dynamicComponentService
      .getAuxComponent()
      .subscribe((currentObjectDimensions) => {
        this.objectProps = currentObjectDimensions;
      });
  }

  ///                     MOUSE EVENTS
  public mouseDown(event: MouseEvent): void {
    this.isDrawing = true;

    this.mouseDownPosition.x = event.offsetX;
    this.mouseDownPosition.y = event.offsetY;

    //to prevent showing the last image in second canvas
    this.imageDataService.setImage(undefined);

    switch (this.toolName) {
      case Tools.Rectangle:
      case Tools.Ellipse:
      case Tools.Triangle:
      case Tools.Hexagon:
      case Tools.Pentagon:
        this.createComponent();
        break;

      case Tools.Select:
        this.deleteComponent();
        this.createComponent();
        this.paintSelectedArea();
        this.checkSelectBackground();
        break;

      case Tools.Move:
        this.setDeltaXY(event.offsetX, event.offsetY);
        break;

      default:
        break;
    }

    this.canvasStateService.setResetValue(true);
  }

  public mouseMove(event: MouseEvent): void {
    //si se esta dibujando
    if (this.isDrawing) {
      //SHAPE SELECTION
      switch (this.toolName) {
        case Tools.Line:
          this.drawLine(event);
          break;

        case Tools.Rectangle:
          this.drawRectangleDiv(event);
          break;

        case Tools.Ellipse:
          this.drawRectangleDiv(event);
          this.setEllipseStyles();
          break;

        case Tools.Triangle:
          this.drawRectangleDiv(event);
          this.setTriangleStyles();
          break;

        case Tools.Select:
          this.drawRectangleDiv(event);
          this.setSelectStyles();
          break;

        case Tools.Hexagon:
          this.drawRectangleDiv(event);
          this.setHexagonStyles();
          break;

        case Tools.Pentagon:
          this.drawRectangleDiv(event);
          this.setPentagonStyles();

          break;

        case Tools.Move:
          this.moveObject(event);
          break;

        case Tools.Eraser:
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
    this.statusBarService.setCursorPosition({
      x: event.offsetX,
      y: event.offsetY,
    });
  }

  public mouseUp(): void {
    this.isDrawing = false;

    //verificar si existen dimensiones de lo que se dibujó
    if (this.objectProps.width > 0 && this.objectProps.height > 0) {
      switch (this.toolName) {
        case Tools.Rectangle:
          this.drawRectangle(this.objectProps);
          this.deleteComponent(); //delete component when any shape is drawed
          break;

        case Tools.Ellipse:
          this.drawEllipse(this.objectProps);
          this.deleteComponent(); //delete component when any shape is drawed
          break;

        case Tools.Triangle:
          this.drawTriangle(this.objectProps);
          this.deleteComponent();
          break;

        case Tools.Hexagon:
          this.deleteComponent();
          this.drawHexagon(this.objectProps);

          break;

        case Tools.Pentagon:
          this.deleteComponent();
          this.drawPentagon(this.objectProps);

          break;

        case Tools.Select:
          this.selectImageArea(this.objectProps); //get the fragment of canvas
          this.clearSelectedArea(this.objectProps); //remove fragment from selection
          this.setAuxDivImage(); //set image to auxCanvas
          this.checkSelectBackground();
          break;

        default:
          break;
      }
    }

    this.imagesArray.push(this.canvas.nativeElement.toDataURL());
  }

  public mouseEnter(): void {
    this.statusBarService.setOutsideCanvas(false);
  }

  public mouseLeave(): void {
    this.statusBarService.setOutsideCanvas(true);
  }

  private updateCanvasValue(): void {
    this.canvasStateService.getImageList().subscribe((currentList) => {
      this.imagesArray = currentList;

      if (this.imagesArray.length > 0) {
        this.setCurrentCanvasImage();
      } else {
        this.ctx.clearRect(
          0,
          0,
          this.canvasDimensions.width,
          this.canvasDimensions.height
        );
      }
    });
  }

  private moveObject(event: MouseEvent) {
    if (this.isInsideDynamicComponent) {
      this.objectProps.top = event.offsetY - this.XY.y;
      this.objectProps.left = event.offsetX - this.XY.x;
      this.dynamicComponentService.setDynamicComponentDimensions(
        this.objectProps
      );
    }
  }

  private isMouseInside(event: MouseEvent) {
    if (
      event.offsetY > this.objectProps.top &&
      event.offsetY < this.objectProps.height + this.objectProps.top &&
      event.offsetX > this.objectProps.left &&
      event.offsetX < this.objectProps.width + this.objectProps.left
    ) {
      this.canvasCursor = Cursors.Move;
      this.toolName = Tools.Move; //Avoid nested select
      this.isInsideDynamicComponent = true;
    } else {
      this.canvasCursor = Cursors.Crosshair;

      this.toolName = Tools.Select; // a new select can be drawed
      this.isInsideDynamicComponent = false;
    }
  }

  private paintSelectedArea() {
    if (this.selectedImage != undefined) {
      this.ctx.putImageData(
        this.selectedImage,
        this.objectProps.left,
        this.objectProps.top
      );
    }
  }

  private setDeltaXY(offsetX: number, offsetY: number) {
    this.XY = {
      x: Math.abs(this.objectProps.left - offsetX),
      y: Math.abs(this.objectProps.top - offsetY),
    };
  }

  private setAuxDivImage() {
    if (this.selectedImage != undefined) {
      this.imageDataService.setImage(this.selectedImage);
    }
  }

  private selectImageArea(area: DynamicComponentProperties) {
    this.isSelectDrawn = true; // a new rectangle select
    this.selectedImage = this.ctx.getImageData(
      area.left,
      area.top,
      area.width,
      area.height
    );
  }

  private clearSelectedArea(area: DynamicComponentProperties) {
    this.ctx.clearRect(area.left, area.top, area.width, area.height);
  }

  //esta funcion de abajo se ejecuta cada vez que se suelta el mouse
  private setCurrentCanvasImage(): void {
    ///guardarla mejor como imageData en vez de base64
    this.currentCanvasImage.src = this.imagesArray[this.imagesArray.length - 1];
    this.currentCanvasImage.onload = () => {
      this.ctx.clearRect(
        0,
        0,
        this.canvasDimensions.width,
        this.canvasDimensions.height
      );
      this.ctx.drawImage(this.currentCanvasImage, 0, 0);
    };
  }

  private checkLastSelectedArea() {
    this.paintSelectedArea();
    this.deleteComponent();
    this.isSelectDrawn = false;
  }

  ///                     SHAPES

  private drawLine(event: MouseEvent): void {
    //these two must be public and its value can change with toolbar buttons
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(this.mouseDownPosition.x, this.mouseDownPosition.y);
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
    this.mouseDownPosition.x = event.offsetX;
    this.mouseDownPosition.y = event.offsetY;
  }

  private drawRectangleDiv(event: MouseEvent): void {
    const rectangleWidth = event.offsetX - this.mouseDownPosition.x;
    const rectangleHeight = event.offsetY - this.mouseDownPosition.y;

    const newX = Math.abs(event.offsetX - this.mouseDownPosition.x);
    const newY = Math.abs(event.offsetY - this.mouseDownPosition.y);

    this.objectProps = {
      top: 0,
      left: 0,
      width: newX,
      height: newY,
      background: this.color,
      outline: '',
      clipPath: '',
    };
    // Quadrant 1
    if (rectangleWidth > 0 && rectangleHeight < 0) {
      this.objectProps = {
        ...this.objectProps,
        top: event.offsetY,
        left: this.mouseDownPosition.x,
      };
    }
    // Quadrant 2
    else if (rectangleWidth < 0 && rectangleHeight < 0) {
      this.objectProps = {
        ...this.objectProps,
        top: event.offsetY,
        left: event.offsetX,
      };
    }
    // Quadrant 3
    else if (rectangleWidth < 0 && rectangleHeight > 0) {
      this.objectProps = {
        ...this.objectProps,
        top: this.mouseDownPosition.y,
        left: event.offsetX,
      };
    }
    //Quadrant 4
    else {
      this.objectProps = {
        ...this.objectProps,
        top: this.mouseDownPosition.y,
        left: this.mouseDownPosition.x,
      };
    }

    this.dynamicComponentService.setDynamicComponentDimensions(
      this.objectProps
    );
  }

  private setSelectStyles() {
    this.objectProps.outline = '2px dashed gray';
    this.objectProps.background = 'transparent';
  }

  private checkSelectBackground() {
    if (this.isDrawing) {
      this.objectProps.background = 'transparent';
    } else {
      this.objectProps.background = 'white';
    }
  }

  private setEllipseStyles() {
    this.objectProps.clipPath = 'ellipse(50% 50% at 50% 50%)';
  }

  private setTriangleStyles() {
    this.objectProps.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
  }

  private setHexagonStyles() {
    this.objectProps.clipPath =
      'polygon(50% 0%, 0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%)';
  }

  private setPentagonStyles() {
    this.objectProps.clipPath =
      'polygon(50% 0%, 0% 40%, 20% 100%, 80% 100%, 100% 40%)';
  }

  //podria devolver un objeto con las dimensiones del rectangulo recien dibujado para luego poder moverlo
  private drawRectangle(
    dynamicComponentProperties: DynamicComponentProperties
  ): void {
    const { width, height, top, left } = dynamicComponentProperties;
    this.ctx.fillRect(left, top, width, height);
  }

  private drawEllipse(dynamicComponentProperties: DynamicComponentProperties) {
    const { width, height, top, left } = dynamicComponentProperties;

    this.ctx.fillStyle = this.color;
    const endAngle = 2 * Math.PI;
    this.ctx.beginPath();
    this.ctx.ellipse(
      left + width / 2,
      top + height / 2,
      Math.abs(width) / 2,
      Math.abs(height) / 2,
      0,
      0,
      endAngle
    );
    this.ctx.fill();
  }

  private drawTriangle(
    dynamicComponentProperties: DynamicComponentProperties
  ): void {
    const { width, height, top, left } = dynamicComponentProperties;

    this.ctx.beginPath();
    this.ctx.moveTo(left + width / 2, top);
    this.ctx.lineTo(left, top + height);
    this.ctx.lineTo(left + width, top + height);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawHexagon(dynamicComponentProperties: DynamicComponentProperties) {
    const { width, height, top, left } = dynamicComponentProperties;
    this.ctx.beginPath();
    const polygonCoords = [
      { x: left + width / 2, y: top },
      { x: left, y: top + height / 4 },
      { x: left, y: top + height / (6 / 4.5) },
      { x: left + width / 2, y: top + height },
      { x: left + width, y: top + height / (6 / 4.5) },
      { x: left + width, y: top + height / 4 },
    ];
    for (let i = 0; i < polygonCoords.length; i++) {
      this.ctx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawPentagon(dynamicComponentProperties: DynamicComponentProperties) {
    const { width, height, top, left } = dynamicComponentProperties;
    this.ctx.beginPath();
    const polygonCoords = [
      { x: left + width * 0.5, y: top },
      { x: left, y: top + height * 0.4 },
      { x: left + width * 0.2, y: top + height },
      { x: left + width * 0.8, y: top + height },
      { x: left + width, y: top + height * 0.4 },
    ];
    for (let i = 0; i < polygonCoords.length; i++) {
      this.ctx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  ///                     ERASE
  private erase(event: MouseEvent): void {
    this.ctx.clearRect(event.offsetX, event.offsetY, 10, 10);
  }

  //    DINAMIC COMPONENT FUNCTIONS
  private createComponent(): void {
    this.componentRef = this.dynamicHost.createComponent(AuxDivComponent);
  }

  private deleteComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}

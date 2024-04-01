import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
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
import { Cursor } from '../../enums/cursors.enum';

@Component({
  selector: 'canvas-component',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit, OnInit, OnDestroy {
  constructor(
    private statusBarService: StatusBarService,
    private canvasStateService: CanvasStateService,
    private toolsService: ToolsService,
    private dynamicComponentService: DynamicComponentService,
    private imageDataService: ImageDataService,
    private renderer: Renderer2
  ) {}

  @Input() containerWidth: number = 0;
  @Input() containerHeight: number = 0;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  @ViewChild(DynamicHostDirective, { read: ViewContainerRef })
  private dynamicHost!: ViewContainerRef;
  private componentRef!: ComponentRef<AuxDivComponent>;
  private isSelectDrawn = false;
  private onResizeButton = false;
  private onClickResizeButton = false;
  private selectedImage: ImageData | undefined;
  private auxComponent!: HTMLCanvasElement;
  private resizedImage = new Image();
  private currentCanvasImage = new Image();
  private color: string = '';
  private toolName!: Tools;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing: boolean = false;
  private imagesArray: string[] = [];
  protected canvasCursor: Cursor = Cursor.Crosshair;

  private objectProps: DynamicComponentProperties = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    background: '',
    componentClass: '',
    referenceWidth: 0,
    referenceHeight: 0,
  };

  private mouseDownPosition: Point = {
    x: 0,
    y: 0,
  };

  private XY: Point = {
    x: 0,
    y: 0,
  };

  ////ON INIT
  ngOnInit(): void {
    this.initCanvasDimensions();
    this.initAuxDynamicComponent();

    // let parent = this.renderer.parentNode(this.canvas);

    // console.log(parent);

    // const canvasContainer =
    //   this.canvas.nativeElement.parentNode.parentNode.parentNode;
    // console.log(canvasContainer);
  }

  private initCanvasDimensions(): void {
    // this.canvas.nativeElement.width = this.canvasDimensions.width;
    // this.canvas.nativeElement.height = this.canvasDimensions.height;
    // console.log(this.containerWidth, this.containerHeight);

    this.canvas.nativeElement.width = this.containerWidth;
    this.canvas.nativeElement.height = this.containerHeight;
    console.log(this.containerWidth, this.containerHeight);

    this.statusBarService.setCanvasDimensions({
      width: this.containerWidth,
      height: this.containerHeight,
    });
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

    this.ctx.imageSmoothingEnabled = true;
  }

  ///                     AFTER VIEW INIT FUNCTIONS
  private initColor(): void {
    this.toolsService.getSelectedColor().subscribe((currentColor) => {
      this.color = currentColor;
      this.ctx.strokeStyle = this.color;
      this.ctx.fillStyle = this.color;
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = 'round';
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
    this.objectProps.background = '';
    this.objectProps.componentClass = '';
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
    this.mouseDownPosition.x = event.offsetX;
    this.mouseDownPosition.y = event.offsetY;

    if (this.onResizeButton) {
      console.log('top left corner');
      this.onClickResizeButton = true;
    } else {
      this.isDrawing = true;
      this.imageDataService.setImage(undefined);

      switch (this.toolName) {
        case Tools.Rectangle:
        case Tools.Ellipse:
        case Tools.Triangle:
        case Tools.Hexagon:
        case Tools.Pentagon:
        case Tools.Star:
        case Tools.Rhombus:
          this.createComponent();

          break;

        case Tools.Select:
          this.deleteComponent();

          this.createComponent();
          this.auxComponent = this.componentRef.location.nativeElement
            .firstChild as HTMLCanvasElement;

          this.paintSelectedArea();

          this.renderer.removeAttribute(this.resizedImage, 'src');
          this.checkSelectBackground();
          break;

        case Tools.Move:
          this.setDeltaXY(event.offsetX, event.offsetY);
          break;

        default:
          break;
      }
    }

    this.canvasStateService.setResetValue(true);
  }

  public mouseMove(event: MouseEvent): void {
    if (this.isDrawing) {
      //SHAPE SELECTION
      switch (this.toolName) {
        case Tools.Line:
          this.drawLine(event);
          break;

        case Tools.Select2:
          this.drawLine(event);
          break;

        case Tools.Rectangle:
        case Tools.Ellipse:
        case Tools.Triangle:
        case Tools.Select:
        case Tools.Hexagon:
        case Tools.Pentagon:
        case Tools.Star:
        case Tools.Rhombus:
          this.drawShapeContainer(event);
          break;

        case Tools.Move:
          this.moveShapeContainer(event, this.isMouseInsideSelect(event));
          break;

        case Tools.Eraser:
          this.erase(event);
          break;

        default:
          break;
      }

      //Set properties to aux component while drawing
      //necesary to view the aux compponent while drawing
      ///only modify required properties (top, left, width, height) if it is possible
      this.dynamicComponentService.setDynamicComponentDimensions(
        this.objectProps
      );
      //Set styles depending on the selected tool
      this.setShapeContainerStyles(this.toolName);
    } else if (this.onClickResizeButton) {
      this.resizeAuxComponent(event);
    } else {
      if (this.isSelectDrawn) {
        if (this.isMouseInsideSelect(event)) {
          this.setCursorAndToolname(Cursor.Move, Tools.Move);
        } else {
          this.setCursorAndToolname(Cursor.Crosshair, Tools.Select);
        }
        this.onResizeButtonClick(event);
      }
    }

    //Set properties to be accessible from status component
    this.statusBarService.setCursorPosition({
      x: event.offsetX,
      y: event.offsetY,
    });
  }

  public mouseUp(): void {
    this.isDrawing = false;
    this.onClickResizeButton = false;

    if (this.objectProps.width > 0 && this.objectProps.height > 0) {
      switch (this.toolName) {
        case Tools.Rectangle:
          this.drawRectangle();
          break;

        case Tools.Ellipse:
          this.drawEllipse();
          break;

        case Tools.Triangle:
          this.drawTriangle();
          break;

        case Tools.Hexagon:
          this.drawHexagon();
          break;

        case Tools.Pentagon:
          this.drawPentagon();
          break;

        case Tools.Star:
          this.drawStar();
          break;

        case Tools.Rhombus:
          this.drawRhombus();
          break;

        case Tools.Select:
          this.selectImageArea(); //get the fragment of canvas
          this.clearSelectedArea(); //remove fragment from selection
          this.setAuxDivImage(); //set image to auxCanvas
          this.checkSelectBackground(); //check if selection background is white
          break;

        default:
          break;
      }
      //set dimensions of aux component when mouse is up
      this.dynamicComponentService.setDynamicComponentDimensions(
        this.objectProps
      );
      //instantly delete dynamic component when selected tool is a shape
      if (this.toolName != Tools.Select && this.toolName != Tools.Move) {
        this.deleteComponent();
      }
      //get new aux component image when resizing it
      if (this.onResizeButton) {
        //console.log('top left corner dropped');
        const auxComponentUrl = this.auxComponent.toDataURL();
        //this.resizedImage.src = this.auxComponentUrl;
        this.renderer.setAttribute(this.resizedImage, 'src', auxComponentUrl);
      }
    }
    //get the canvas image and push it to images list
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
        this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
      }
    });
  }

  private moveShapeContainer(event: MouseEvent, isMouseInside: boolean): void {
    if (isMouseInside) {
      this.objectProps.top = event.offsetY - this.XY.y;
      this.objectProps.left = event.offsetX - this.XY.x;
    }
  }

  private isMouseInsideSelect(event: MouseEvent): boolean {
    const { width, height, top, left } = this.objectProps;
    if (
      event.offsetY > top - 16 &&
      event.offsetY < height + top + 16 &&
      event.offsetX > left - 16 &&
      event.offsetX < width + left + 16
    ) {
      return true;
    } else {
      return false;
    }
  }

  private setCursorAndToolname(canvasCursor: Cursor, toolName: Tools): void {
    this.canvasCursor = canvasCursor;
    this.toolName = toolName; //Avoid nested select
  }

  private onResizeButtonClick(event: MouseEvent): void {
    //detect all buttons only
    const { width, height, top, left } = this.objectProps;
    const { offsetX, offsetY } = event;
    if (
      offsetX < left &&
      offsetY < top &&
      offsetX > left - 16 &&
      offsetY > top - 16
    ) {
      this.canvasCursor = Cursor.ResizeNW;
      this.onResizeButton = true;
    } else {
      this.onResizeButton = false;
    }
  }

  private resizeAuxComponent(event: MouseEvent): void {
    const { top, left, referenceWidth, referenceHeight } = this.objectProps;
    const { offsetX, offsetY } = event;

    //calculate value from mousedown to offset
    const dX = offsetX - this.mouseDownPosition.x;
    const dY = offsetY - this.mouseDownPosition.y;

    //calculate new width and height from original width and height
    const newWidth = referenceWidth - dX;
    const newHeight = referenceHeight - dY;

    //set new values to aux component

    if (newWidth > 0 && newHeight > 0) {
      this.objectProps.left = offsetX;
      this.objectProps.top = offsetY;
      this.objectProps.width = newWidth;
      this.objectProps.height = newHeight;
    }
  }

  private paintSelectedArea(): void {
    if (this.selectedImage != undefined && !this.resizedImage.src) {
      this.ctx.putImageData(
        this.selectedImage,
        this.objectProps.left,
        this.objectProps.top
      );
    } else if (this.resizedImage.src) {
      //only if selection style is not transparent
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(
        this.objectProps.left,
        this.objectProps.top,
        this.objectProps.width,
        this.objectProps.height
      );

      this.ctx.drawImage(
        this.resizedImage,
        this.objectProps.left,
        this.objectProps.top,
        this.objectProps.width,
        this.objectProps.height
      );

      this.ctx.fillStyle = this.color;
    }
  }

  private setDeltaXY(offsetX: number, offsetY: number): void {
    this.XY = {
      x: Math.abs(this.objectProps.left - offsetX),
      y: Math.abs(this.objectProps.top - offsetY),
    };
  }

  private setAuxDivImage(): void {
    if (this.selectedImage != undefined) {
      this.imageDataService.setImage(this.selectedImage);
    }
  }

  private selectImageArea(): void {
    const { width, height, top, left } = this.objectProps;
    this.selectedImage = this.ctx.getImageData(left, top, width, height);
    this.isSelectDrawn = true; // a new rectangle select
  }

  private clearSelectedArea() {
    const { width, height, top, left } = this.objectProps;
    this.ctx.clearRect(left, top, width, height);
  }

  //esta funcion de abajo se ejecuta cada vez que se suelta el mouse
  private setCurrentCanvasImage(): void {
    ///guardarla mejor como imageData en vez de base64
    this.currentCanvasImage.src = this.imagesArray[this.imagesArray.length - 1];
    this.currentCanvasImage.onload = () => {
      this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
      this.ctx.drawImage(this.currentCanvasImage, 0, 0);
    };
  }

  private checkLastSelectedArea(): void {
    this.paintSelectedArea();
    this.deleteComponent();
    this.isSelectDrawn = false;
  }

  //Set styles depending on the selected tool (only tools that have a container)
  private setShapeContainerStyles(toolName: Tools) {
    this.objectProps.componentClass = toolName;
  }

  private checkSelectBackground() {
    if (this.isDrawing) {
      this.objectProps.background = 'transparent';
    } else {
      this.objectProps.background = 'white';
    }
  }

  ///                     SHAPES

  private drawShapeContainer(event: MouseEvent): void {
    const dX = event.offsetX - this.mouseDownPosition.x;
    const dY = event.offsetY - this.mouseDownPosition.y;
    const rectangleWidth = dX;
    const rectangleHeight = dY;
    const newWidth = Math.abs(dX);
    const newHeight = Math.abs(dY);

    this.objectProps = {
      top: 0,
      left: 0,
      width: newWidth,
      height: newHeight,
      background: this.toolName == Tools.Select ? 'transparent' : this.color,
      componentClass: '',
      referenceWidth: newWidth,
      referenceHeight: newHeight,
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
  }

  private drawLine(event: MouseEvent): void {
    this.ctx.beginPath();
    this.ctx.moveTo(this.mouseDownPosition.x, this.mouseDownPosition.y);
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
    this.mouseDownPosition.x = event.offsetX;
    this.mouseDownPosition.y = event.offsetY;
  }

  private drawRectangle(): void {
    const { width, height, top, left } = this.objectProps;
    this.ctx.fillRect(left, top, width, height);
  }

  private drawEllipse() {
    const { width, height, top, left } = this.objectProps;
    const endAngle = 2 * Math.PI;
    this.ctx.beginPath();
    this.ctx.ellipse(
      left + width * 0.5,
      top + height * 0.5,
      Math.abs(width) * 0.5,
      Math.abs(height) * 0.5,
      0,
      0,
      endAngle
    );
    this.ctx.fill();
  }

  private drawTriangle(): void {
    const { width, height, top, left } = this.objectProps;
    const polygonCoords: Point[] = [
      { x: left + width * 0.5, y: top },
      { x: left, y: top + height },
      { x: left + width, y: top + height },
    ];

    this.ctx.beginPath();
    for (let i = 0; i < polygonCoords.length; i++) {
      this.ctx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawHexagon() {
    const { width, height, top, left } = this.objectProps;
    /*Numerical values expressed in percentage indicate where to place each point 
      according to the width and height of aux component:
      width * 0.25 = 25% of aux component height 
      */
    const polygonCoords: Point[] = [
      { x: left + width * 0.25, y: top },
      { x: left, y: top + height * 0.5 },
      { x: left + width * 0.25, y: top + height },
      { x: left + width * 0.75, y: top + height },
      { x: left + width, y: top + height * 0.5 },
      { x: left + width * 0.75, y: top },
    ];

    this.ctx.beginPath();
    for (let i = 0; i < polygonCoords.length; i++) {
      this.ctx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawPentagon() {
    const { width, height, top, left } = this.objectProps;
    const polygonCoords: Point[] = [
      { x: left + width * 0.5, y: top },
      { x: left, y: top + height * 0.38 },
      { x: left + width * 0.18, y: top + height },
      { x: left + width * 0.82, y: top + height },
      { x: left + width, y: top + height * 0.38 },
    ];

    this.ctx.beginPath();
    for (let i = 0; i < polygonCoords.length; i++) {
      this.ctx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  public drawStar() {
    const { width, height, top, left } = this.objectProps;
    const polygonCoords: Point[] = [
      { x: left + width * 0.5, y: top },
      { x: left + width * 0.37, y: top + height * 0.38 },
      { x: left, y: top + height * 0.38 },
      { x: left + width * 0.31, y: top + height * 0.59 },
      { x: left + width * 0.18, y: top + height * 1 },
      { x: left + width * 0.5, y: top + height * 0.75 },
      { x: left + width * 0.82, y: top + height * 1 },
      { x: left + width * 0.69, y: top + height * 0.59 },
      { x: left + width * 1, y: top + height * 0.38 },
      { x: left + width * 0.63, y: top + height * 0.38 },
    ];

    this.ctx.beginPath();
    for (let i = 0; i < polygonCoords.length; i++) {
      this.ctx.lineTo(polygonCoords[i].x, polygonCoords[i].y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  ///HACER QUE CADA FUNCION RETORNE LA FORMA QUE SE DIBUJA PARA LUEGO PASARLA POR EL SERVICIO AL COMPONENTE AUXILIAR Y COLOCARLA

  private drawRhombus() {
    const { width, height, top, left } = this.objectProps;
    const polygonCoords: Point[] = [
      { x: left + width * 0.5, y: top },
      { x: left, y: top + height * 0.5 },
      { x: left + width * 0.5, y: top + height },
      { x: left + width, y: top + height * 0.5 },
    ];

    this.ctx.beginPath();
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

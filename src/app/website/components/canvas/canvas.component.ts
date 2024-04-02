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
import { ShapeContainerComponent } from '../../../shared/components/shape-container/shape-container.component';
import { DynamicHostDirective } from '../../../shared/directives/dynamic-host.directive';
import { ShapeContainerService } from 'src/app/shared/services/shape-container.service';
import { ShapeContainer } from 'src/app/shared/interfaces/shape.interface';
import { Point } from 'src/app/website/interfaces/point.interface';
import { ImageDataService } from '../../../shared/services/image-data.service';
import { ToolName } from '../../enums/tool-name.enum';
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
    private shapeContainerService: ShapeContainerService,
    private imageDataService: ImageDataService,
    private renderer: Renderer2
  ) {}

  @Input() containerWidth: number = 0;
  @Input() containerHeight: number = 0;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  @ViewChild(DynamicHostDirective, { read: ViewContainerRef })
  private dynamicHost!: ViewContainerRef;
  private componentRef!: ComponentRef<ShapeContainerComponent>;
  private isSelectDrawn = false;
  private onResizeButton = false;
  private onClickResizeButton = false;
  private resize = false;
  private selectedImage: ImageData | undefined;
  private auxComponent!: HTMLCanvasElement;
  private resizedImage = new Image();
  private currentCanvasImage = new Image();
  private color: string = '';
  private toolName!: ToolName;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing: boolean = false;
  private imagesArray: string[] = [];
  protected canvasCursor: Cursor = Cursor.Crosshair;

  private shapeContainer: ShapeContainer = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    background: '',
    componentClass: '',
    referenceTop: 0,
    referenceLeft: 0,
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
    this.initShapeContainer();
  }

  private initCanvasDimensions(): void {
    this.canvas.nativeElement.width = this.containerWidth;
    this.canvas.nativeElement.height = this.containerHeight;
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
    this.toolsService.getSelectedButton().subscribe((currentTool: ToolName) => {
      this.toolName = currentTool; //get tool name
      this.canvasStateService.setResetValue(false);
    });
  }

  private setInitialValues(): void {
    this.canvasStateService.getResetValue().subscribe((currentCanvasState) => {
      //console.log('Current state:', currentCanvasState);

      if (!currentCanvasState) {
        //check if there is still a last selected area
        if (this.selectedImage != undefined && this.toolName != ToolName.Move) {
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
    this.shapeContainer.top = 0;
    this.shapeContainer.left = 0;
    this.shapeContainer.width = 0;
    this.shapeContainer.height = 0;
    this.shapeContainer.referenceTop = 0;
    this.shapeContainer.referenceLeft = 0;
    this.shapeContainer.referenceWidth = 0;
    this.shapeContainer.referenceHeight = 0;
    this.shapeContainer.background = '';
    this.shapeContainer.componentClass = '';
  }

  private initShapeContainer(): void {
    this.shapeContainerService
      .getShapeContainer()
      .subscribe((currentShapeContainer) => {
        this.shapeContainer = currentShapeContainer;
      });
  }

  //MOUSE EVENTS
  public mouseDown(event: MouseEvent): void {
    this.mouseDownPosition.x = event.offsetX;
    this.mouseDownPosition.y = event.offsetY;
    //console.log('top left corner');
    if (this.onResizeButton) {
      this.resize = true;
      this.onClickResizeButton = true;
    } else {
      this.resize = false;
      this.isDrawing = true;
      this.imageDataService.setImage(undefined);

      switch (this.toolName) {
        case ToolName.Rectangle:
        case ToolName.Ellipse:
        case ToolName.Triangle:
        case ToolName.Hexagon:
        case ToolName.Pentagon:
        case ToolName.Star:
        case ToolName.Rhombus:
          this.createComponent();
          break;

        case ToolName.Select:
          this.deleteComponent();

          this.createComponent();

          this.paintSelectedArea();
          this.initAuxCanvas();
          this.renderer.removeAttribute(this.resizedImage, 'src');
          this.checkSelectBackground();
          break;

        case ToolName.Move:
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
      switch (this.toolName) {
        case ToolName.Line:
          this.drawLine(event);
          break;

        case ToolName.Select2:
          this.drawLine(event);
          break;

        case ToolName.Rectangle:
        case ToolName.Ellipse:
        case ToolName.Triangle:
        case ToolName.Select:
        case ToolName.Hexagon:
        case ToolName.Pentagon:
        case ToolName.Star:
        case ToolName.Rhombus:
          this.drawShapeContainer(event);
          break;

        case ToolName.Move:
          this.moveShapeContainer(event, this.isMouseInsideSelect(event));
          break;

        case ToolName.Eraser:
          this.erase(event);
          break;

        default:
          break;
      }

      //Set properties to aux component while drawing
      //necesary to view the aux compponent while drawing
      ///only modify required properties (top, left, width, height) if it is possible
      this.shapeContainerService.setShapeContainerPropesties(
        this.shapeContainer
      );
      //Set styles depending on the selected tool
      this.setShapeContainerStyles(this.toolName);
    } else if (this.onClickResizeButton) {
      this.resizeShapeComponent(event);
    } else {
      if (this.isSelectDrawn) {
        if (this.isMouseInsideSelect(event)) {
          this.setCursorAndToolname(Cursor.Move, ToolName.Move);
        } else {
          this.setCursorAndToolname(Cursor.Crosshair, ToolName.Select);
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

    if (this.shapeContainer.width > 0 && this.shapeContainer.height > 0) {
      switch (this.toolName) {
        case ToolName.Rectangle:
          this.drawRectangle();
          break;

        case ToolName.Ellipse:
          this.drawEllipse();
          break;

        case ToolName.Triangle:
          this.drawTriangle();
          break;

        case ToolName.Hexagon:
          this.drawHexagon();
          break;

        case ToolName.Pentagon:
          this.drawPentagon();
          break;

        case ToolName.Star:
          this.drawStar();
          break;

        case ToolName.Rhombus:
          this.drawRhombus();
          break;

        case ToolName.Select:
          this.selectImageArea(); //get the fragment of canvas
          this.clearSelectedArea(); //remove fragment from selection
          this.setShapeContainerImage(); //set image to auxCanvas
          this.checkSelectBackground(); //check if selection background is white
          break;

        default:
          break;
      }
      //instantly delete dynamic component when selected tool is a shape
      if (this.toolName != ToolName.Select && this.toolName != ToolName.Move) {
        this.deleteComponent();
      }
      //if corner button pressed
      if (this.onResizeButton) {
        this.setResizedImage();
        this.setShapeContainerReferenceProps();
      }

      //set dimensions of aux component when mouse is up
      this.shapeContainerService.setShapeContainerPropesties(
        this.shapeContainer
      );
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
    this.canvasStateService.getImageList().subscribe((currentImage) => {
      this.imagesArray = currentImage;

      if (this.imagesArray.length > 0) {
        this.setCurrentCanvasImage();
      } else {
        this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
      }
    });
  }

  private moveShapeContainer(event: MouseEvent, isMouseInside: boolean): void {
    if (isMouseInside) {
      this.shapeContainer.top = event.offsetY - this.XY.y;
      this.shapeContainer.left = event.offsetX - this.XY.x;
      this.shapeContainer.referenceTop = event.offsetY - this.XY.y;
      this.shapeContainer.referenceLeft = event.offsetX - this.XY.x;
    }
  }

  private isMouseInsideSelect(event: MouseEvent): boolean {
    const { width, height, top, left } = this.shapeContainer;
    if (
      event.offsetY > top - 8 &&
      event.offsetY < height + top + 8 &&
      event.offsetX > left - 8 &&
      event.offsetX < width + left + 8
    ) {
      return true;
    } else {
      return false;
    }
  }

  private setCursorAndToolname(canvasCursor: Cursor, toolName: ToolName): void {
    this.canvasCursor = canvasCursor;
    this.toolName = toolName; //Avoid nested select
  }

  private initAuxCanvas() {
    this.auxComponent = this.componentRef.location.nativeElement
      .firstChild as HTMLCanvasElement;
  }

  private onResizeButtonClick(event: MouseEvent): void {
    const { width, height, top, left } = this.shapeContainer;
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

  //set reference properties
  private setShapeContainerReferenceProps(): void {
    this.shapeContainer.referenceTop = this.shapeContainer.top;
    this.shapeContainer.referenceLeft = this.shapeContainer.left;
    this.shapeContainer.referenceWidth = this.shapeContainer.width;
    this.shapeContainer.referenceHeight = this.shapeContainer.height;
  }

  private resizeShapeComponent(event: MouseEvent): void {
    const { referenceLeft, referenceTop, referenceWidth, referenceHeight } =
      this.shapeContainer;
    const { offsetX, offsetY } = event;
    //calculate value from mousedown to offset
    const dX = offsetX - this.mouseDownPosition.x;
    const dY = offsetY - this.mouseDownPosition.y;
    //calculate new top, left, width and height from original width and height
    const newTop = referenceTop + dY;
    const newLeft = referenceLeft + dX;
    const newWidth = referenceWidth - dX;
    const newHeight = referenceHeight - dY;
    //set new values to shapeContainer if its new values are greather than zero
    if (newWidth > 0 && newHeight > 0) {
      this.shapeContainer.left = newLeft;
      this.shapeContainer.top = newTop;
      this.shapeContainer.width = newWidth;
      this.shapeContainer.height = newHeight;
    }
  }

  private setDeltaXY(offsetX: number, offsetY: number): void {
    this.XY = {
      x: Math.abs(this.shapeContainer.left - offsetX),
      y: Math.abs(this.shapeContainer.top - offsetY),
    };
  }

  private setShapeContainerImage(): void {
    if (this.selectedImage != undefined) {
      this.imageDataService.setImage(this.selectedImage);
    }
  }

  private selectImageArea(): void {
    const { width, height, top, left } = this.shapeContainer;
    if (!this.resize) {
      this.selectedImage = this.ctx.getImageData(left, top, width, height);
      this.isSelectDrawn = true; // a new rectangle select
    }
  }

  private clearSelectedArea() {
    const { width, height, top, left } = this.shapeContainer;
    if (!this.resize) {
      this.ctx.clearRect(left, top, width, height);
    }
  }

  private paintSelectedArea(): void {
    const { width, height, top, left } = this.shapeContainer;

    if (this.selectedImage != undefined && !this.resizedImage.src) {
      this.ctx.putImageData(this.selectedImage, left, top);
    } else if (this.resizedImage.src) {
      //only if selection style is not transparent
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(left, top, width, height);
      this.ctx.drawImage(this.resizedImage, left, top, width, height);
      this.ctx.fillStyle = this.color;
    }
  }

  private setResizedImage(): void {
    const auxComponentUrl = this.auxComponent.toDataURL();
    this.renderer.setAttribute(this.resizedImage, 'src', auxComponentUrl);
  }

  private setCurrentCanvasImage(): void {
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

  //Set styles depending on the selected tool (only ToolName that have a container)
  private setShapeContainerStyles(toolName: ToolName) {
    this.shapeContainer.componentClass = toolName;
  }

  private checkSelectBackground() {
    if (this.isDrawing) {
      this.shapeContainer.background = 'transparent';
    } else {
      this.shapeContainer.background = 'white';
    }
  }

  //SHAPES

  private drawShapeContainer(event: MouseEvent): void {
    const dX = event.offsetX - this.mouseDownPosition.x;
    const dY = event.offsetY - this.mouseDownPosition.y;
    const rectangleWidth = dX;
    const rectangleHeight = dY;
    const newWidth = Math.abs(dX);
    const newHeight = Math.abs(dY);

    this.shapeContainer = {
      top: 0,
      left: 0,
      width: newWidth,
      height: newHeight,
      background: this.toolName == ToolName.Select ? 'transparent' : this.color,
      componentClass: '',
      referenceLeft: 0,
      referenceTop: 0,
      referenceWidth: newWidth,
      referenceHeight: newHeight,
    };
    // Quadrant 1
    if (rectangleWidth > 0 && rectangleHeight < 0) {
      this.shapeContainer = {
        ...this.shapeContainer,
        top: event.offsetY,
        left: this.mouseDownPosition.x,
        referenceTop: event.offsetY,
        referenceLeft: this.mouseDownPosition.x,
      };
    }
    // Quadrant 2
    else if (rectangleWidth < 0 && rectangleHeight < 0) {
      this.shapeContainer = {
        ...this.shapeContainer,
        top: event.offsetY,
        left: event.offsetX,
        referenceTop: event.offsetY,
        referenceLeft: event.offsetX,
      };
    }
    // Quadrant 3
    else if (rectangleWidth < 0 && rectangleHeight > 0) {
      this.shapeContainer = {
        ...this.shapeContainer,
        top: this.mouseDownPosition.y,
        left: event.offsetX,
        referenceTop: this.mouseDownPosition.y,
        referenceLeft: event.offsetY,
      };
    }
    //Quadrant 4
    else {
      this.shapeContainer = {
        ...this.shapeContainer,
        top: this.mouseDownPosition.y,
        left: this.mouseDownPosition.x,
        referenceTop: this.mouseDownPosition.y,
        referenceLeft: this.mouseDownPosition.x,
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
    const { width, height, top, left } = this.shapeContainer;
    this.ctx.fillRect(left, top, width, height);
  }

  private drawEllipse() {
    const { width, height, top, left } = this.shapeContainer;
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
    const { width, height, top, left } = this.shapeContainer;
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
    const { width, height, top, left } = this.shapeContainer;
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
    const { width, height, top, left } = this.shapeContainer;
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
    const { width, height, top, left } = this.shapeContainer;
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

  private drawRhombus() {
    const { width, height, top, left } = this.shapeContainer;
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

  //ERASE
  private erase(event: MouseEvent): void {
    this.ctx.clearRect(event.offsetX, event.offsetY, 10, 10);
  }

  //DINAMIC COMPONENT FUNCTIONS
  private createComponent(): void {
    this.componentRef = this.dynamicHost.createComponent(
      ShapeContainerComponent
    );
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

import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
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
import { ShapeContainerService } from 'src/app/shared/services/shape-container.service';
import { ShapeContainer } from 'src/app/shared/interfaces/shape.interface';
import { Point } from 'src/app/website/interfaces/point.interface';
import { ImageDataService } from '../../../shared/services/image.service';
import { ToolName } from '../../enums/tool-name.enum';
import { DynamicComponentService } from 'src/app/shared/services/dynamic-component.service';
import { IconTool, Tool } from '../../interfaces/tool.interface';
import { Dimension } from '../../interfaces/dimension.interface';
import { Bounding } from '../../interfaces/bounding.interface';
import { MouseEventService } from '../../services/mouse-event.service';

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
    private renderer: Renderer2,
    private dynamicComponentService: DynamicComponentService,
    private mouseEventService: MouseEventService
  ) {}

  //Dynamic component
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  @ViewChild('shapeContainer', { read: ViewContainerRef })
  private dynamicHost!: ViewContainerRef;
  private componentRef!: ComponentRef<ShapeContainerComponent>;
  private isDrawing: boolean = false;

  private freeSelectPoints: Point[] = [];

  private ctx!: CanvasRenderingContext2D;

  protected canvasDimension: Dimension = {
    width: 0,
    height: 0,
  };

  private resizedImage = new Image();
  private currentCanvasImage = new Image();
  private color: string = '';
  private auxColor: string = '';

  private toolName: Tool = {
    id: 0,
    name: ToolName.Line,
  };

  private auxToolName: Tool = {
    id: 0,
    name: ToolName.Line,
  };

  private imagesArray: string[] = [];
  private shapeContainerButtonId: number = 0;

  private lastSelectedShape!: ToolName;

  private lastSelectedColor = '';

  //Objects
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
    isRendered: false,
    rotation: 0,
  };

  private mouseDownPosition: Point = {
    x: 0,
    y: 0,
  };

  private mouseMovePosition: Point = {
    x: 0,
    y: 0,
  };

  private bounding: Bounding = {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  };

  ////ON INIT
  ngOnInit(): void {
    this.initCanvasDimensions();
    this.initShapeContainer();
    this.initMouseEvent();
    this.initMouseMoveEvent();
    this.initShapeContainerButtonId();
    this.initSelectionImage();
  }

  initSelectionImage() {
    this.imageDataService.getImageDataUrl().subscribe((imageDatUrl) => {
      if (imageDatUrl) {
        this.resizedImage.src = imageDatUrl;
      }
    });
  }

  private initCanvasDimensions() {
    const canvasMainContainer = this.renderer.selectRootElement(
      '.canvas-main-container',
      true
    );

    const canvasContainer = this.renderer.selectRootElement(
      '.canvas-container',
      true
    );

    const canvasWidth: number =
      canvasMainContainer.getBoundingClientRect().width;
    const canvasHeight: number =
      canvasMainContainer.getBoundingClientRect().height;

    this.renderer.setStyle(canvasContainer, 'width', canvasWidth + 'px');
    this.renderer.setStyle(canvasContainer, 'height', canvasHeight + 'px');

    this.canvasDimension = {
      width: Math.round(canvasWidth),
      height: Math.round(canvasHeight),
    };

    this.statusBarService.setCanvasDimensions(this.canvasDimension);
  }

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
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });
  }

  private initColor(): void {
    this.toolsService.getSelectedColor().subscribe((currentColor) => {
      this.color = currentColor;
      this.auxColor = this.color;
      this.ctx.strokeStyle = this.color;
      this.ctx.fillStyle = this.color;
      this.ctx.lineWidth = 1;
      this.ctx.lineCap = 'round';
    });
  }

  private initTool(): void {
    this.toolsService.getSelectedButton().subscribe((currentTool: IconTool) => {
      const id = currentTool.id;
      const name = currentTool.name;
      this.toolName = { id: id, name: name };
      this.auxToolName = { id: id, name: name };
    });
  }

  private setInitialValues(): void {
    this.canvasStateService.getResetValue().subscribe((currentCanvasState) => {
      if (!currentCanvasState) {
        this.checkLastSelectedArea();
        this.setUndefinedImage();
        this.removeShapeContainerImg();
        this.resetShapeCotainerProps();
      }
    });
  }

  private initShapeContainer(): void {
    this.shapeContainerService
      .getShapeContainer()
      .subscribe((currentShapeContainer) => {
        this.shapeContainer = currentShapeContainer;
      });
  }

  private initShapeContainerButtonId() {
    this.dynamicComponentService
      .getResizeButtonId()
      .subscribe((currentShapeContainerButtonId) => {
        this.shapeContainerButtonId = currentShapeContainerButtonId;
      });
  }

  /////
  initMouseEvent() {
    this.mouseEventService
      .getMouseDownPosition()
      .subscribe((currentMouseDown) => {
        if (this.shapeContainerButtonId === 0) {
          this.onMouseDown(currentMouseDown);
        }
      });
  }

  initMouseMoveEvent() {
    this.mouseEventService
      .getMouseMovePosition()
      .subscribe((currentMouseMove) => {
        this.mouseMovePosition = currentMouseMove;
        this.onMouseMove(this.mouseMovePosition);
      });
  }

  //MOUSE EVENTS
  public onMouseDown(mouseDownPosition: Point): void {
    this.isDrawing = true;

    this.mouseDownPosition = {
      x: mouseDownPosition.x,
      y: mouseDownPosition.y,
    };

    this.setToolName(this.shapeContainerButtonId);

    this.bounding.minX = this.mouseDownPosition.x;
    this.bounding.minY = this.mouseDownPosition.y;

    if (this.toolName.id === 2 || this.toolName.id == 10) {
      this.paintSelectedArea(this.toolName.id);
      this.deleteComponent();
      this.createComponent();
      this.removeShapeContainerImg();
      this.setShapeDrawnValues(false);
    } else if (this.toolName.id === 1) {
      this.paintShape(this.toolName.name, this.color);
      this.deleteComponent();
      this.createComponent();
      this.setShapeDrawnValues(false);
    }

    this.resetShapeCotainerProps();

    this.freeSelectPoints = [];

    //get the canvas image and push it to images list
    this.imagesArray.push(this.canvas.nativeElement.toDataURL());
  }

  public onMouseMove(mouseMovePosition: Point): void {
    if (this.isDrawing) {
      switch (this.toolName.id) {
        case 1:
        case 2:
          this.drawShapeContainer(mouseMovePosition, this.toolName.name);
          break;

        case 3:
          this.drawLine(mouseMovePosition);
          break;

        case 4:
          this.erase(mouseMovePosition);
          break;

        case 10:
          this.drawFreeSelect(mouseMovePosition);
          break;

        default:
          break;
      }
    }

    this.statusBarService.setCursorPosition(mouseMovePosition);
    this.statusBarService.setshapeContainerDimension({
      width: this.shapeContainer.width,
      height: this.shapeContainer.height,
    });
  }

  public mouseUp(): void {
    this.isDrawing = false;

    if (this.shapeContainer.width > 0 && this.shapeContainer.height > 0) {
      if (this.toolName.id == 1 || this.toolName.id == 2) {
        this.setShapeDrawnValues(true);
      }
    }

    if (this.toolName.id === 10) {
      this.setCurrentCanvasImage();
      this.setFreeSelectProperties();
      this.imageDataService.setPath(this.freeSelectPoints);
      this.setShapeDrawnValues(true);
      this.resetBoundingPoints();
      //this.ctx.globalCompositeOperation = 'source-over';
    }
  }

  private resetBoundingPoints() {
    this.bounding.minX = 0;
    this.bounding.minY = 0;
    this.bounding.maxX = 0;
    this.bounding.maxY = 0;
  }

  //CANVAS FUNCTIONS
  private updateCanvasValue(): void {
    this.canvasStateService.getImageList().subscribe((currentImage) => {
      this.imagesArray = currentImage;
      if (this.imagesArray.length > 0) {
        this.setCurrentCanvasImage();
      } else {
        this.ctx.clearRect(
          0,
          0,
          this.canvasDimension.width,
          this.canvasDimension.height
        );
      }
    });
  }

  private setToolName(buttonId: number) {
    if (buttonId === 0) {
      this.toolName = this.auxToolName; //toolName now is last tool selected
      this.color = this.auxColor;
      this.lastSelectedShape = this.toolName.name;
      this.lastSelectedColor = this.color;
    }
  }

  private setShapeDrawnValues(value: boolean) {
    this.shapeContainer.isRendered = value;
  }

  private paintSelectedArea(selectId: number): void {
    const { width, height, top, left, rotation } = this.shapeContainer;

    if (rotation) {
      this.rotateShapeContainer();
    }

    if (this.resizedImage.src) {
      if (selectId === 10) {
        this.ctx.drawImage(this.resizedImage, left, top, width, height);
      } else if (selectId === 2) {
        this.ctx.fillStyle = 'white'; //only if selection style is not transparent
        this.ctx.fillRect(left, top, width, height);
        this.ctx.drawImage(this.resizedImage, left, top, width, height);
      }
    }

    if (rotation) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  private setUndefinedImage() {
    this.imageDataService.setImage(undefined);
  }

  private removeShapeContainerImg(): void {
    this.renderer.removeAttribute(this.resizedImage, 'src');
  }

  private setFreeSelectProperties() {
    const boundingPoints = this.getMinMaxXY();
    const rectangleWidth = boundingPoints.maxX - boundingPoints.minX;
    const rectangleHeight = boundingPoints.maxY - boundingPoints.minY;
    this.shapeContainer.left = boundingPoints.minX;
    this.shapeContainer.top = boundingPoints.minY;
    this.shapeContainer.width = rectangleWidth;
    this.shapeContainer.height = rectangleHeight;
    this.shapeContainer.componentClass = 'Select2';
    this.shapeContainer.rotation = 0;
  }

  private resetShapeCotainerProps() {
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
    this.shapeContainer.isRendered = false;
    this.shapeContainer.rotation = 0;
  }

  private paintShape(toolName: ToolName, color: string) {
    this.ctx.fillStyle = color;

    if (this.shapeContainer.rotation) {
      this.rotateShapeContainer();
    }

    switch (toolName) {
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

      default:
        break;
    }

    if (this.shapeContainer.rotation) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  private setCurrentCanvasImage(): void {
    this.currentCanvasImage.src = this.imagesArray[this.imagesArray.length - 1];
    this.currentCanvasImage.onload = () => {
      this.ctx.clearRect(
        0,
        0,
        this.canvasDimension.width,
        this.canvasDimension.height
      );

      this.ctx.drawImage(this.currentCanvasImage, 0, 0);
    };
  }

  private checkLastSelectedArea(): void {
    if (
      this.resizedImage.src &&
      this.shapeContainer.componentClass === ToolName.Select
    ) {
      this.paintSelectedArea(2);
    } else if (
      this.resizedImage.src &&
      this.shapeContainer.componentClass === ToolName.Select2
    ) {
      this.paintSelectedArea(10);
    } else {
      this.paintShape(this.lastSelectedShape, this.lastSelectedColor);
    }
    this.dynamicHost.clear();
    this.setShapeDrawnValues(false);
  }

  private rotateShapeContainer() {
    const { width, height, top, left, rotation } = this.shapeContainer;
    const rotationAngle = (rotation * Math.PI) / 180;
    this.ctx.translate(left + width * 0.5, top + height * 0.5);
    this.ctx.rotate(rotationAngle);
    this.ctx.translate(-(left + width * 0.5), -(top + height * 0.5));
  }

  //SHAPES
  private drawShapeContainer({ x, y }: Point, toolName: ToolName): void {
    let rectangleWidth = x - this.mouseDownPosition.x;
    let rectangleHeight = y - this.mouseDownPosition.y;
    let newWidth = Math.abs(rectangleWidth);
    let newHeight = Math.abs(rectangleHeight);

    //dimension
    this.shapeContainer.width = newWidth;
    this.shapeContainer.height = newHeight;
    this.shapeContainer.referenceWidth = newWidth;
    this.shapeContainer.referenceHeight = newHeight;

    //class
    this.shapeContainer.componentClass = toolName;

    //background
    if (this.toolName.id === 2) {
      this.shapeContainer.background = 'transparent';
    } else {
      this.shapeContainer.background = this.color;
    }
    // Quadrant 1
    if (rectangleWidth > 0 && rectangleHeight < 0) {
      this.shapeContainer.top = y;
      this.shapeContainer.left = this.mouseDownPosition.x;
      this.shapeContainer.referenceTop = y;
      this.shapeContainer.referenceLeft = this.mouseDownPosition.x;
    }
    // Quadrant 2
    else if (rectangleWidth < 0 && rectangleHeight < 0) {
      this.shapeContainer.top = y;
      this.shapeContainer.left = x;
      this.shapeContainer.referenceTop = y;
      this.shapeContainer.referenceLeft = x;
    }
    // Quadrant 3
    else if (rectangleWidth < 0 && rectangleHeight > 0) {
      this.shapeContainer.top = this.mouseDownPosition.y;
      this.shapeContainer.left = x;
      this.shapeContainer.referenceTop = this.mouseDownPosition.y;
      this.shapeContainer.referenceLeft = x;
    }
    //Quadrant 4
    else {
      this.shapeContainer.top = this.mouseDownPosition.y;
      this.shapeContainer.left = this.mouseDownPosition.x;
      this.shapeContainer.referenceTop = this.mouseDownPosition.y;
      this.shapeContainer.referenceLeft = this.mouseDownPosition.x;
    }
  }

  private drawLine({ x, y }: Point): void {
    this.ctx.beginPath();
    this.ctx.moveTo(this.mouseDownPosition.x, this.mouseDownPosition.y);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.mouseDownPosition.x = x;
    this.mouseDownPosition.y = y;
  }

  private drawFreeSelect({ x, y }: Point): void {
    //this.ctx.globalCompositeOperation = 'difference';
    this.ctx.strokeStyle = 'blue';
    this.ctx.lineWidth = 1;

    this.ctx.beginPath();
    this.ctx.moveTo(this.mouseDownPosition.x, this.mouseDownPosition.y);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    this.mouseDownPosition.x = x;
    this.mouseDownPosition.y = y;

    this.freeSelectPoints.push({ x, y });

    this.setMinMaxXY(x, y);
  }

  public setMinMaxXY(x: number, y: number) {
    if (x < this.bounding.minX) {
      this.bounding.minX = x;
    }
    if (y < this.bounding.minY) {
      this.bounding.minY = y;
    }
    if (x > this.bounding.maxX) {
      this.bounding.maxX = x;
    }
    if (y > this.bounding.maxY) {
      this.bounding.maxY = y;
    }
  }

  public getMinMaxXY(): Bounding {
    return {
      minX: this.bounding.minX,
      minY: this.bounding.minY,
      maxX: this.bounding.maxX,
      maxY: this.bounding.maxY,
    };
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
  private erase({ x, y }: Point): void {
    this.ctx.clearRect(x, y, 20, 20);
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

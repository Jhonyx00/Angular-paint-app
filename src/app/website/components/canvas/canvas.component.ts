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
import { DynamicHostDirective } from '../../../shared/directives/dynamic-host.directive';
import { ShapeContainerService } from 'src/app/shared/services/shape-container.service';
import { ShapeContainer } from 'src/app/shared/interfaces/shape.interface';
import { Point } from 'src/app/website/interfaces/point.interface';
import { ImageDataService } from '../../../shared/services/image-data.service';
import { ToolName } from '../../enums/tool-name.enum';
import { DynamicComponentService } from 'src/app/shared/services/dynamic-component.service';
import { Box } from 'src/app/shared/interfaces/box';

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
    private dynamicComponentService: DynamicComponentService
  ) {}

  @ViewChild('canvas', { static: true }) canvas!: ElementRef;

  //Dynamic component
  @ViewChild(DynamicHostDirective, { read: ViewContainerRef })
  private dynamicHost!: ViewContainerRef;
  private componentRef!: ComponentRef<ShapeContainerComponent>;
  private isDrawing: boolean = false;

  private selectedImage: ImageData | undefined;
  private auxComponent!: HTMLCanvasElement;

  protected canvasWidth = 0;
  protected canvasHeight = 0;

  private resizedImage = new Image();
  private currentCanvasImage = new Image();
  private color: string = '';
  private toolName!: ToolName;
  private auxToolName!: ToolName;

  private canvasBoundingClientRect: Box = { left: 0, top: 0 };
  private ctx!: CanvasRenderingContext2D;
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
    zIndex: 0,
  };

  private mouseDownPosition: Point = {
    x: 0,
    y: 0,
  };

  private mouseMovePosition: Point = {
    x: 0,
    y: 0,
  };

  ////ON INIT
  ngOnInit(): void {
    this.initCanvasDimensions();
    this.initShapeContainer();
  }

  private initCanvasDimensions(): void {
    this.statusBarService
      .getCanvasDimensions()
      .subscribe((currentCanvasDimension) => {
        this.canvasWidth = currentCanvasDimension.width;
        this.canvasHeight = currentCanvasDimension.height;
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
    this.initDynamicComponentCursorPos();
    this.initDynamicComponentMovingPos();
    this.initShapeContainerButtonId();
    this.initBoundingClientRect();
  }

  private initBoundingClientRect() {
    const { left, top } = this.renderer
      .selectRootElement('.canvas-container', true)
      .getBoundingClientRect();

    this.canvasBoundingClientRect = { left, top };
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
    this.toolsService.getSelectedButton().subscribe((currentTool: ToolName) => {
      this.toolName = currentTool;
      this.auxToolName = currentTool;
      this.canvasStateService.setResetValue(false);
    });
  }

  private setInitialValues(): void {
    this.canvasStateService.getResetValue().subscribe((currentCanvasState) => {
      if (!currentCanvasState) {
        this.checkLastSelectedArea();
        this.removeShapeContainerImage();
        this.resetShapeCotainerProps();
      }
    });
  }

  private removeShapeContainerImage() {
    this.selectedImage = undefined;
    this.imageDataService.setImage(this.selectedImage);
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
  }

  private initShapeContainer(): void {
    this.shapeContainerService
      .getShapeContainer()
      .subscribe((currentShapeContainer) => {
        this.shapeContainer = currentShapeContainer;
      });
  }
  ///
  private initDynamicComponentCursorPos() {
    this.dynamicComponentService
      .getMouseDownPosition()
      .subscribe((currentPosition) => {
        this.mouseDownPosition = currentPosition;
        if (this.mouseDownPosition.x != 0 || this.mouseDownPosition.y != 0) {
          this.performMouseDownAction(this.mouseDownPosition);
        }
      });
  }

  private initDynamicComponentMovingPos() {
    this.dynamicComponentService
      .getMouseMovePosition()
      .subscribe((currentMouseMove) => {
        this.mouseMovePosition = currentMouseMove;
        if (this.mouseMovePosition.x != 0 || this.mouseMovePosition.y != 0) {
          this.mouseMove(this.mouseMovePosition);
        }
      });
  }

  private initShapeContainerButtonId() {
    this.dynamicComponentService
      .getResizeButtonId()
      .subscribe((currentShapeContainerButtonId) => {
        this.shapeContainerButtonId = currentShapeContainerButtonId;
      });
  }

  private performMouseDownAction(mouseDownPosition: Point) {
    if (this.shapeContainerButtonId === 0) {
      this.isDrawing = true;
      this.imageDataService.setImage(undefined);
      switch (this.toolName) {
        case ToolName.Select:
          this.paintSelectedArea();
          this.removeShapeContainerImg();
          this.checkSelectBackground();
          break;

        case ToolName.Line:
          this.setPencilContainerMouseDownPosition(mouseDownPosition);
          break;

        default:
          this.setShapeContainerMouseDownPosition(mouseDownPosition);
          this.deleteComponent();
          this.createComponent();
          this.setShapeDrawnValues(false);
          this.paintShape(this.toolName, this.color);
          break;
      }
    } else if (this.shapeContainerButtonId === 10) {
      this.isDrawing = true;
    }
    // this.color = this.auxColor;
    this.lastSelectedColor = this.color;
    //get the canvas image and push it to images list
    this.imagesArray.push(this.canvas.nativeElement.toDataURL());
    this.canvasStateService.setResetValue(true);
  }

  private setShapeContainerMouseDownPosition(mouseDownPosition: Point) {
    this.mouseDownPosition = {
      x: mouseDownPosition.x,
      y: mouseDownPosition.y,
    };
  }

  private setPencilContainerMouseDownPosition(mouseDownPosition: Point) {
    this.mouseDownPosition = {
      x: mouseDownPosition.x - this.canvasBoundingClientRect.left,
      y: mouseDownPosition.y - this.canvasBoundingClientRect.top,
    };
  }
  //MOUSE EVENTS
  public mouseDown(event: MouseEvent): void {
    this.shapeContainer.zIndex = 2;
    this.performMouseDownAction(event);
  }

  public mouseMove(mouseMovePosition: Point): void {
    if (this.isDrawing) {
      switch (this.toolName) {
        case ToolName.Line:
          this.drawLine(mouseMovePosition);
          break;

        case ToolName.Eraser:
          this.erase(mouseMovePosition);
          break;

        default:
          this.drawShapeContainer(mouseMovePosition, this.toolName);
          break;
      }
    } else {
      this.setToolName(this.shapeContainerButtonId);
    }

    this.statusBarService.setCursorPosition(mouseMovePosition);
  }

  public mouseUp(): void {
    this.isDrawing = false;
    this.shapeContainer.zIndex = 5;

    if (this.shapeContainer.width > 0 && this.shapeContainer.height > 0) {
      switch (this.toolName) {
        case ToolName.Select:
          this.initAuxComponent();
          this.selectArea(); //get the fragment of canvas
          this.setShapeDrawnValues(true); //
          this.clearSelectedArea(); //remove fragment from selection
          this.setShapeContainerImage(); //set image to auxCanvas
          this.checkSelectBackground(); //check if selection background is white
          break;

        default:
          this.setShapeDrawnValues(true);
          break;
      }
    }
  }

  public mouseEnter(): void {
    this.statusBarService.setOutsideCanvas(false);
  }

  public mouseLeave(): void {
    this.statusBarService.setOutsideCanvas(true);
  }

  //CANVAS FUNCTIONS
  private updateCanvasValue(): void {
    this.canvasStateService.getImageList().subscribe((currentImage) => {
      this.imagesArray = currentImage;
      if (this.imagesArray.length > 0) {
        this.setCurrentCanvasImage();
      } else {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      }
    });
  }

  private setToolName(buttonId: number) {
    if (buttonId === 10) {
      this.toolName = ToolName.Move;
    } else if (buttonId === 0) {
      this.toolName = this.auxToolName; //toolName now is last tool selected
      this.lastSelectedShape = this.toolName;
    }
  }

  private setShapeContainerImage(): void {
    if (this.selectedImage != undefined) {
      this.imageDataService.setImage(this.selectedImage);
    }
    //no need to get image when rotating shapeContainer (button 9)
    if (this.shapeContainerButtonId != 9) {
      const auxComponentUrl = this.auxComponent.toDataURL();
      this.renderer.setAttribute(this.resizedImage, 'src', auxComponentUrl);
    }
  }

  private checkSelectBackground() {
    if (this.isDrawing) {
      this.shapeContainer.background = 'transparent';
    } else {
      this.shapeContainer.background = 'white';
    }
  }

  //get the new selected area container
  private initAuxComponent() {
    this.auxComponent = this.renderer.selectRootElement('#aux-canvas', false);
  }

  private setShapeDrawnValues(value: boolean) {
    this.shapeContainer.isRendered = value;
  }

  private selectArea(): void {
    const { width, height, top, left } = this.shapeContainer;
    this.selectedImage = this.ctx.getImageData(left, top, width, height);
  }

  private clearSelectedArea() {
    const { width, height, top, left } = this.shapeContainer;
    this.ctx.clearRect(left, top, width, height);
  }

  private paintSelectedArea(): void {
    const { width, height, top, left, rotation } = this.shapeContainer;

    if (rotation) {
      this.rotateShapeContainer();
    }

    if (this.resizedImage.src) {
      this.ctx.fillStyle = 'white'; //only if selection style is not transparent
      this.ctx.fillRect(left, top, width, height);
      this.ctx.drawImage(this.resizedImage, left, top, width, height);
      this.ctx.fillStyle = this.color;
    }

    if (rotation) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
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

  private removeShapeContainerImg(): void {
    if (this.auxComponent) {
      this.renderer.removeAttribute(this.resizedImage, 'src');
    }
  }

  private setCurrentCanvasImage(): void {
    this.currentCanvasImage.src = this.imagesArray[this.imagesArray.length - 1];
    this.currentCanvasImage.onload = () => {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.drawImage(this.currentCanvasImage, 0, 0);
    };
  }

  private checkLastSelectedArea(): void {
    if (this.selectedImage != undefined) {
      this.paintSelectedArea();
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
    const toolbarWidth = this.canvasBoundingClientRect.left;
    const toolbarHeight = this.canvasBoundingClientRect.top;

    let rectangleWidth = x - this.mouseDownPosition.x;
    let rectangleHeight = y - this.mouseDownPosition.y;
    let newWidth = Math.abs(rectangleWidth);
    let newHeight = Math.abs(rectangleHeight);

    //rotation
    this.shapeContainer.rotation = 0;

    //dimension
    this.shapeContainer.width = newWidth;
    this.shapeContainer.height = newHeight;
    this.shapeContainer.referenceWidth = newWidth;
    this.shapeContainer.referenceHeight = newHeight;

    //class
    this.shapeContainer.componentClass = toolName;

    //background
    if (this.toolName === ToolName.Select) {
      this.shapeContainer.background = 'transparent';
    } else {
      this.shapeContainer.background = this.color;
    }
    // Quadrant 1
    if (rectangleWidth > 0 && rectangleHeight < 0) {
      this.shapeContainer.top = y - toolbarHeight;
      this.shapeContainer.left = this.mouseDownPosition.x - toolbarWidth;
      this.shapeContainer.referenceTop = y - toolbarHeight;
      this.shapeContainer.referenceLeft =
        this.mouseDownPosition.x - toolbarWidth;
    }
    // Quadrant 2
    else if (rectangleWidth < 0 && rectangleHeight < 0) {
      this.shapeContainer.top = y - toolbarHeight;
      this.shapeContainer.left = x - toolbarWidth;
      this.shapeContainer.referenceTop = y - toolbarHeight;
      this.shapeContainer.referenceLeft = x - toolbarWidth;
    }
    // Quadrant 3
    else if (rectangleWidth < 0 && rectangleHeight > 0) {
      this.shapeContainer.top = this.mouseDownPosition.y - toolbarHeight;
      this.shapeContainer.left = x - toolbarWidth;
      this.shapeContainer.referenceTop =
        this.mouseDownPosition.y - toolbarHeight;
      this.shapeContainer.referenceLeft = x - toolbarWidth;
    }
    //Quadrant 4
    else {
      this.shapeContainer.top = this.mouseDownPosition.y - toolbarHeight;
      this.shapeContainer.left = this.mouseDownPosition.x - toolbarWidth;
      this.shapeContainer.referenceTop =
        this.mouseDownPosition.y - toolbarHeight;
      this.shapeContainer.referenceLeft =
        this.mouseDownPosition.x - toolbarWidth;
    }
  }

  private drawLine({ x, y }: Point): void {
    const toolbarWidth = this.canvasBoundingClientRect.left;
    const toolbarHeight = this.canvasBoundingClientRect.top;

    this.ctx.beginPath();
    this.ctx.moveTo(this.mouseDownPosition.x, this.mouseDownPosition.y);
    this.ctx.lineTo(x - toolbarWidth, y - toolbarHeight);
    this.ctx.stroke();

    this.mouseDownPosition.x = x - toolbarWidth;
    this.mouseDownPosition.y = y - toolbarHeight;
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
    const toolbarWidth = this.canvasBoundingClientRect.left;
    const toolbarHeight = this.canvasBoundingClientRect.top;
    this.ctx.clearRect(x - toolbarWidth, y - toolbarHeight, 20, 20);
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

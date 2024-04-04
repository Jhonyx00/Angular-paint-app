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
import { Cursor } from '../../enums/cursor.enum';

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

  //Dynamic component
  @ViewChild(DynamicHostDirective, { read: ViewContainerRef })
  private dynamicHost!: ViewContainerRef;
  private componentRef!: ComponentRef<ShapeContainerComponent>;

  private isDrawing: boolean = false;
  private isSelectDrawn: boolean = false;
  private resizedButtonClicked: boolean = false;
  private isInsideSelectedArea: boolean = false;

  private selectedImage: ImageData | undefined;
  private auxComponent!: HTMLCanvasElement;

  private resizedImage = new Image();
  private currentCanvasImage = new Image();

  private color: string = '';
  private toolName!: ToolName;
  private ctx!: CanvasRenderingContext2D;
  private imagesArray: string[] = [];
  protected canvasCursor: Cursor = Cursor.Crosshair;
  private resizeButtonId: number = 0;

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
        this.checkLastSelectedArea();
        //reset values
        this.resetAuxComponent();
        this.resetObjectProperties();
        this.dynamicHost.clear();
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

    if (this.resizeButtonId > 0 && this.resizeButtonId < 9) {
      this.isInsideSelectedArea = true;
      this.resizedButtonClicked = true;
    } else {
      this.isInsideSelectedArea = false;
      this.isDrawing = true;
      this.imageDataService.setImage(undefined);

      if (
        this.toolName != ToolName.Select &&
        this.toolName != ToolName.Move &&
        this.toolName != ToolName.Line &&
        this.toolName != ToolName.Eraser
      ) {
        this.createComponent();
      } else if (this.toolName == ToolName.Select) {
        this.createComponent();
        this.paintSelectedArea();
        this.removeResizedImageSrc();
        this.checkSelectBackground();
      } else if (this.toolName == ToolName.Move) {
        this.setDeltaXY(event.offsetX, event.offsetY);
      }
    }
    this.canvasStateService.setResetValue(true);
  }

  public mouseMove(event: MouseEvent): void {
    if (this.isDrawing) {
      this.performSelectedAction(event);
      //Set properties to aux component while drawing
      //necesary to view the aux compponent while drawing
      this.shapeContainerService.setShapeContainerPropesties(
        this.shapeContainer
      );
    } else if (this.resizedButtonClicked) {
      this.resizeShapeContainer(event);
    } else {
      this.checkSelectedArea(event);
    }
    //Set properties to be accessible from status component
    this.statusBarService.setCursorPosition({
      x: event.offsetX,
      y: event.offsetY,
    });
  }

  public mouseUp(): void {
    this.isDrawing = false;
    this.resizedButtonClicked = false;

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
          //get the new selected area container
          this.auxComponent = this.renderer.selectRootElement('canvas', false);
          this.selectArea(); //get the fragment of canvas
          this.clearSelectedArea(); //remove fragment from selection
          this.setShapeContainerImage(); //set image to auxCanvas
          this.checkSelectBackground(); //check if selection background is white
          this.setResizedImage();
          this.setShapeContainerReferenceProps();
          break;

        default:
          break;
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

  //CANVAS FUNCTIONS
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

  private performSelectedAction(event: MouseEvent) {
    if (
      this.toolName != ToolName.Move &&
      this.toolName != ToolName.Eraser &&
      this.toolName != ToolName.Line
    ) {
      this.drawShapeContainer(event, this.toolName);
    } else if (this.toolName == ToolName.Line) {
      this.drawLine(event);
    } else if (this.toolName == ToolName.Move) {
      this.moveShapeContainer(event);
    } else if (this.toolName == ToolName.Eraser) {
      this.erase(event);
    }
  }

  private moveShapeContainer(event: MouseEvent): void {
    if (this.resizeButtonId == 9) {
      this.shapeContainer.top = event.offsetY - this.XY.y;
      this.shapeContainer.left = event.offsetX - this.XY.x;
      this.shapeContainer.referenceTop = event.offsetY - this.XY.y;
      this.shapeContainer.referenceLeft = event.offsetX - this.XY.x;
    }
  }

  private checkResizeButton(event: MouseEvent): number {
    const { width, height, top, left } = this.shapeContainer;
    const { offsetX, offsetY } = event;

    const buttonWidth = 16;
    const halfButtonWidth = buttonWidth * 0.5;

    const dxLeft = left - buttonWidth;
    const dyTop = top - buttonWidth;
    const totalHeight = top + height;
    const totalWidth = left + width;
    const dxTotalHeight = top + height + buttonWidth;
    const dxTotalWidth = left + width + buttonWidth;
    const dy1 = top + height * 0.5 - halfButtonWidth;
    const dy2 = top + height * 0.5 + halfButtonWidth;
    const dx1 = left + width * 0.5 - halfButtonWidth;
    const dx2 = left + width * 0.5 + halfButtonWidth;

    if (
      offsetX < left &&
      offsetY < top &&
      offsetX > dxLeft &&
      offsetY > dyTop
    ) {
      return 1;
    } else if (
      offsetX > dxLeft &&
      offsetX < left &&
      offsetY > dy1 &&
      offsetY < dy2
    ) {
      return 2;
    } else if (
      offsetX > dxLeft &&
      offsetX < left &&
      offsetY > totalHeight &&
      offsetY < dxTotalHeight
    ) {
      return 3;
    } else if (
      offsetY > totalHeight &&
      offsetY < dxTotalHeight &&
      offsetX > dx1 &&
      offsetX < dx2
    ) {
      return 4;
    } else if (
      offsetY > totalHeight &&
      offsetY < dxTotalHeight &&
      offsetX > totalWidth &&
      offsetX < dxTotalWidth
    ) {
      return 5;
    } else if (
      offsetY > dy1 &&
      offsetY < dy2 &&
      offsetX > left + width &&
      offsetX < dxTotalWidth
    ) {
      return 6;
    } else if (
      offsetY > dyTop &&
      offsetY < top &&
      offsetX > totalWidth &&
      offsetX < dxTotalWidth
    ) {
      return 7;
    } else if (
      offsetY > dyTop &&
      offsetY < top &&
      offsetX > dx1 &&
      offsetX < dx2
    ) {
      return 8;
    } else if (
      offsetY > top &&
      offsetY < totalHeight &&
      offsetX > left &&
      offsetX < totalWidth
    ) {
      return 9;
    } else {
      return 0;
    }
  }

  private checkSelectedArea(event: MouseEvent) {
    //if a select shape is drawn on the screen
    if (this.isSelectDrawn) {
      this.resizeButtonId = this.checkResizeButton(event);
      this.setCursor(this.resizeButtonId);
      this.setToolName(this.resizeButtonId);
    }
  }

  private setToolName(buttonId: number) {
    if (buttonId == 9) {
      this.toolName = ToolName.Move;
    } else if (buttonId == 0) {
      this.toolName = ToolName.Select;
    }
  }

  //set cursors according to the area selected
  private setCursor(area: number) {
    switch (area) {
      case 0:
        this.canvasCursor = Cursor.Crosshair;
        break;
      case 1:
        this.canvasCursor = Cursor.NwseResize;
        break;
      case 2:
        this.canvasCursor = Cursor.EwResize;
        break;
      case 3:
        this.canvasCursor = Cursor.NeswResize;
        break;
      case 4:
        this.canvasCursor = Cursor.NsResize;
        break;
      case 5:
        this.canvasCursor = Cursor.NwseResize;
        break;
      case 6:
        this.canvasCursor = Cursor.EwResize;
        break;
      case 7:
        this.canvasCursor = Cursor.NeswResize;
        break;
      case 8:
        this.canvasCursor = Cursor.NsResize;
        break;
      case 9:
        this.canvasCursor = Cursor.Move;
        break;
      default:
        break;
    }
  }

  //set reference properties
  private setShapeContainerReferenceProps(): void {
    if (this.resizeButtonId > 0 && this.resizeButtonId < 9) {
      this.shapeContainer.referenceTop = this.shapeContainer.top;
      this.shapeContainer.referenceLeft = this.shapeContainer.left;
      this.shapeContainer.referenceWidth = this.shapeContainer.width;
      this.shapeContainer.referenceHeight = this.shapeContainer.height;
    }
  }

  private resizeShapeContainer(event: MouseEvent): void {
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

    const newInverseWidth = referenceWidth + dX;
    const newInverseHeight = referenceHeight + dY;

    //set new values to shapeContainer if the new values are greather than zero
    switch (this.resizeButtonId) {
      case 1:
        if (newWidth > 0 && newHeight > 0) {
          this.shapeContainer.left = newLeft;
          this.shapeContainer.top = newTop;
          this.shapeContainer.width = newWidth;
          this.shapeContainer.height = newHeight;
        }
        break;

      case 2:
        if (newWidth > 0) {
          this.shapeContainer.left = newLeft;
          this.shapeContainer.width = newWidth;
        }
        break;

      case 3:
        if (newWidth > 0 && newInverseHeight > 0) {
          this.shapeContainer.left = newLeft;
          this.shapeContainer.width = newWidth;
          this.shapeContainer.height = newInverseHeight;
        }
        break;

      case 4:
        if (newInverseHeight > 0) {
          this.shapeContainer.height = newInverseHeight;
        }
        break;

      case 5:
        if (newInverseWidth > 0 && newInverseHeight > 0) {
          this.shapeContainer.width = newInverseWidth;
          this.shapeContainer.height = newInverseHeight;
        }
        break;

      case 6:
        if (newInverseWidth > 0) {
          this.shapeContainer.width = newInverseWidth;
        }
        break;

      case 7:
        if (newHeight > 0 && newInverseWidth > 0) {
          this.shapeContainer.top = newTop;
          this.shapeContainer.width = newInverseWidth;
          this.shapeContainer.height = newHeight;
        }
        break;

      case 8:
        if (newHeight > 0) {
          this.shapeContainer.top = newTop;
          this.shapeContainer.height = newHeight;
        }
        break;

      default:
        break;
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

  private selectArea(): void {
    const { width, height, top, left } = this.shapeContainer;
    if (!this.isInsideSelectedArea) {
      this.selectedImage = this.ctx.getImageData(left, top, width, height);
      this.isSelectDrawn = true; // a new rectangle select
    }
  }

  private clearSelectedArea() {
    const { width, height, top, left } = this.shapeContainer;
    if (!this.isInsideSelectedArea) {
      this.ctx.clearRect(left, top, width, height);
    }
  }

  private paintSelectedArea(): void {
    const { width, height, top, left } = this.shapeContainer;

    if (this.selectedImage != undefined && !this.resizedImage.src) {
      this.ctx.putImageData(this.selectedImage, left, top);
    } else if (this.resizedImage.src) {
      //if image resized
      this.ctx.fillStyle = 'white'; //only if selection style is not transparent
      this.ctx.fillRect(left, top, width, height);
      this.ctx.drawImage(this.resizedImage, left, top, width, height);
      this.ctx.fillStyle = this.color;
    }
  }

  private setResizedImage(): void {
    if (this.resizeButtonId > 0) {
      const auxComponentUrl = this.auxComponent.toDataURL();
      this.renderer.setAttribute(this.resizedImage, 'src', auxComponentUrl);
    }
  }

  private removeResizedImageSrc(): void {
    if (this.auxComponent) {
      this.renderer.removeAttribute(this.resizedImage, 'src');
    }
  }

  private setCurrentCanvasImage(): void {
    this.currentCanvasImage.src = this.imagesArray[this.imagesArray.length - 1];
    this.currentCanvasImage.onload = () => {
      this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
      this.ctx.drawImage(this.currentCanvasImage, 0, 0);
    };
  }

  private checkLastSelectedArea(): void {
    if (this.selectedImage != undefined && this.toolName != ToolName.Move) {
      this.paintSelectedArea();
      this.isSelectDrawn = false;
    }
  }

  private checkSelectBackground() {
    if (this.isDrawing) {
      this.shapeContainer.background = 'transparent';
    } else {
      this.shapeContainer.background = 'white';
    }
  }

  //SHAPES

  private drawShapeContainer(event: MouseEvent, toolName: ToolName): void {
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
      componentClass: toolName,
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
    this.deleteComponent();
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

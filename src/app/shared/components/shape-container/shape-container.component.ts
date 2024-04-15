import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ShapeContainer } from '../../interfaces/shape.interface';
import { ShapeContainerService } from '../../services/shape-container.service';
import { ImageDataService } from 'src/app/shared/services/image.service';
import { Subscription } from 'rxjs';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { Point } from 'src/app/website/interfaces/point.interface';
import { StatusBarService } from 'src/app/website/services/statusbar.service';
import { Box } from '../../interfaces/box';
import { ToolName } from 'src/app/website/enums/tool-name.enum';

@Component({
  selector: 'shape-container',
  templateUrl: './shape-container.component.html',
  styleUrls: ['./shape-container.component.css'],
})
export class ShapeContainerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private shapeContainerService: ShapeContainerService,
    private imageDataService: ImageDataService,
    private dynamicComponentService: DynamicComponentService,
    private renderer: Renderer2,
    private statusBarService: StatusBarService
  ) {}

  private ctxAux!: CanvasRenderingContext2D;
  private ctxMainCanvas!: CanvasRenderingContext2D;

  private resizeButtonId: number = 0;
  private image$: Subscription | undefined;
  private dynamicComponent$: Subscription | undefined;

  private isOverButton: boolean = false;
  private isOnShapeContainer: boolean = false;

  private isOnResizeButton: boolean = false;
  private selectedImage: ImageData | undefined;
  private resizedImage = new Image();
  private auxComponent!: HTMLCanvasElement;

  private isAreaSelected = false;
  angleDiff = 0;
  fixedAngle = 0;

  movingAngle = 0;

  public shapeContainer: ShapeContainer = {
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

  private initialAngle = 0;
  private XY: Point = {
    x: 0,
    y: 0,
  };

  private mouseDownPosition: Point = {
    x: 0,
    y: 0,
  };

  private mouseMovePosition: Point = {
    x: 0,
    y: 0,
  };

  private shapeContainerBoundingClientRect: Box = { left: 0, top: 0 };

  protected buttons = [
    {
      id: 1,
      class: 'btn1',
      name: 'nw-resize',
    },
    {
      id: 2,
      class: 'btn2',
      name: 'w-resize',
    },
    {
      id: 3,
      class: 'btn3',
      name: 'sw-resize',
    },
    {
      id: 4,
      class: 'btn4',
      name: 's-resize',
    },
    {
      id: 5,
      class: 'btn5',
      name: 'se-resize',
    },
    {
      id: 6,
      class: 'btn6',
      name: 'e-resize',
    },
    {
      id: 7,
      class: 'btn7',
      name: 'ne-resize',
    },
    {
      id: 8,
      class: 'btn8',
      name: 'n-resize',
    },
    {
      id: 9,
      class: 'btn9',
      name: 'grab',
    },
  ];

  ngOnInit(): void {
    this.initAuxComponentDimensions();
    this.initShapeContainerBoundingClientRect();
  }

  ngAfterViewInit(): void {
    this.initAuxContext();
    this.initImage();
    this.initMainCanvasContext();
    this.initAuxCanvas();
  }

  initAuxCanvas() {
    this.auxComponent = this.renderer.selectRootElement('#aux-canvas', false);
  }

  initMainCanvasContext() {
    this.ctxMainCanvas = this.renderer
      .selectRootElement('.canvas', true)
      .getContext('2d');
  }

  private initAuxContext() {
    this.ctxAux = this.renderer
      .selectRootElement('#aux-canvas', false)
      .getContext('2d');
  }

  private initImage() {
    this.image$ = this.imageDataService.getImage().subscribe((image) => {
      if (image != undefined) {
        this.auxComponent.width = image?.width;
        this.auxComponent.height = image?.height;
        this.ctxAux.putImageData(image, 0, 0);
      }
    });
  }

  private initAuxComponentDimensions() {
    this.dynamicComponent$ = this.shapeContainerService
      .getShapeContainer()
      .subscribe((currentAuxComponent: ShapeContainer) => {
        this.shapeContainer = currentAuxComponent;
      });
  }

  private initShapeContainerBoundingClientRect() {
    const { left, top } = this.renderer
      .selectRootElement('.main-container', true)
      .getBoundingClientRect();
    this.shapeContainerBoundingClientRect = { left, top };
  }

  public mouseEnter(): void {
    this.statusBarService.setOutsideCanvas(false);
  }

  public mouseLeave(): void {
    this.statusBarService.setOutsideCanvas(true);
  }

  public btnMouseDown(id: number) {
    this.isOverButton = true;
    this.isOnResizeButton = true;
    this.resizeButtonId = id;
  }

  public btnMouseUp() {
    //this.isOnResizeButton = false;
    // this.shapeContainer.zIndex = 5;
    this.isOverButton = false;
    this.isOnResizeButton = false;

    this.setShapeContainerReferenceProps();
  }

  public mainContainerMouseMove(event: MouseEvent) {
    const x = event.clientX - this.shapeContainerBoundingClientRect.left;
    const y = event.clientY - this.shapeContainerBoundingClientRect.top;

    if (this.isOnShapeContainer) {
      this.moveShapeContainer(x, y);
    } else if (this.isOnResizeButton) {
      this.resizeShapeContainer(x, y);
    }

    this.mouseMovePosition = { x: Math.round(x), y: Math.round(y) };

    this.dynamicComponentService.setMouseMovePosition(this.mouseMovePosition);

    this.statusBarService.setCursorPosition(this.mouseMovePosition);
  }

  public mainContainerMouseDown(event: MouseEvent) {
    const x = event.clientX - this.shapeContainerBoundingClientRect.left;
    const y = event.clientY - this.shapeContainerBoundingClientRect.top;

    this.mouseDownPosition = { x: x, y: y };
    this.dynamicComponentService.setResizeButtonId(0);

    if (
      !this.isOverButton &&
      !this.isOnResizeButton &&
      !this.isOnShapeContainer
    ) {
      this.shapeContainer.zIndex = 2;

      this.imageDataService.setImage(undefined);

      this.isAreaSelected = false;

      this.dynamicComponentService.setMouseDownPosition({
        x: x,
        y: y,
      });
    } else if (
      (this.isOnShapeContainer || this.isOnResizeButton) &&
      this.shapeContainer.componentClass == ToolName.Select
    ) {
      this.selectArea(); //get the fragment of canvas
      this.setShapeContainerImage(); //set image to auxCanvas
      this.setSelectBackground(); //check if selection background is white
    }
  }

  private selectArea(): void {
    if (!this.isAreaSelected) {
      const { width, height, top, left } = this.shapeContainer;
      this.selectedImage = this.ctxMainCanvas.getImageData(
        left,
        top,
        width,
        height
      );
      this.clearSelectedArea();
    }
    this.isAreaSelected = true;
  }

  private clearSelectedArea() {
    const { width, height, top, left } = this.shapeContainer;
    this.ctxMainCanvas.clearRect(left, top, width, height);
  }

  private setShapeContainerImage(): void {
    if (this.selectedImage != undefined) {
      this.imageDataService.setImage(this.selectedImage);
      const auxComponentUrl = this.auxComponent.toDataURL();
      this.renderer.setAttribute(this.resizedImage, 'src', auxComponentUrl);
      this.imageDataService.setImageDataUrl(auxComponentUrl);
    }
  }

  private setSelectBackground() {
    this.shapeContainer.background = 'white';
  }

  public onShapeContainerMouseDown(event: MouseEvent) {
    this.isOverButton = true;
    this.isOnShapeContainer = true;
    this.isOnResizeButton = true;

    this.setDeltaXY(
      event.clientX - this.shapeContainerBoundingClientRect.left,
      event.clientY - this.shapeContainerBoundingClientRect.top
    );
  }

  public onShapeContainerMouseUp() {
    this.isOverButton = false;
    this.isOnShapeContainer = false;
    this.isOnResizeButton = false;
    this.dynamicComponentService.setResizeButtonId(0);

    this.setShapeContainerReferenceProps();
  }

  public onMouseHover() {
    this.isOverButton = true;
  }

  public onMouseOut() {
    this.isOverButton = false;
  }

  private moveShapeContainer(x: number, y: number): void {
    this.shapeContainer.top = y - this.XY.y;
    this.shapeContainer.left = x - this.XY.x;
    this.shapeContainer.referenceTop = y - this.XY.y;
    this.shapeContainer.referenceLeft = x - this.XY.x;
  }

  private setDeltaXY(offsetX: number, offsetY: number): void {
    this.XY = {
      x: Math.abs(this.shapeContainer.left - offsetX),
      y: Math.abs(this.shapeContainer.top - offsetY),
    };
  }

  private resizeShapeContainer(x: number, y: number): void {
    const { referenceLeft, referenceTop, referenceWidth, referenceHeight } =
      this.shapeContainer;
    //calculate value from mousedown to offset
    const dX = x - this.mouseDownPosition.x;
    const dY = y - this.mouseDownPosition.y;
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
        } else if (newWidth < 0 && newHeight > 0) {
          this.shapeContainer.top = newTop;
          this.shapeContainer.height = newHeight;
        } else if (newHeight < 0 && newWidth > 0) {
          this.shapeContainer.left = newLeft;
          this.shapeContainer.width = newWidth;
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
        } else if (newWidth < 0 && newInverseHeight > 0) {
          this.shapeContainer.height = newInverseHeight;
        } else if (newInverseHeight < 0 && newWidth > 0) {
          this.shapeContainer.left = newLeft;
          this.shapeContainer.width = newWidth;
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
        } else if (newInverseWidth < 0 && newInverseHeight > 0) {
          this.shapeContainer.height = newInverseHeight;
        } else if (newInverseWidth > 0 && newInverseHeight < 0) {
          this.shapeContainer.width = newInverseWidth;
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
        } else if (newHeight > 0 && newInverseWidth < 0) {
          this.shapeContainer.top = newTop;
          this.shapeContainer.height = newHeight;
        } else if (newHeight < 0 && newInverseWidth > 0) {
          this.shapeContainer.width = newInverseWidth;
        }
        break;

      case 8:
        if (newHeight > 0) {
          this.shapeContainer.top = newTop;
          this.shapeContainer.height = newHeight;
        }
        break;

      case 9:
        this.setRotationValues(x, y);

        break;
      default:
        break;
    }
  }

  private setRotationValues(x: number, y: number) {
    const { width, height, left, top } = this.shapeContainer;
    const halfHeight = top + height * 0.5;
    const halfWidth = left + width * 0.5;
    this.movingAngle = Math.atan2(y - halfHeight, x - halfWidth);

    this.fixedAngle = Math.atan2(
      this.mouseDownPosition.y - halfHeight,
      this.mouseDownPosition.x - halfWidth
    );
    //console.log(-(this.fixedAngle * 180) / Math.PI);
    this.angleDiff = this.fixedAngle - this.initialAngle;
    this.initialAngle = this.movingAngle;

    this.shapeContainer.rotation = -(this.angleDiff * 180) / Math.PI;
  }

  private setShapeContainerReferenceProps(): void {
    this.shapeContainer.referenceTop = this.shapeContainer.top;
    this.shapeContainer.referenceLeft = this.shapeContainer.left;
    this.shapeContainer.referenceWidth = this.shapeContainer.width;
    this.shapeContainer.referenceHeight = this.shapeContainer.height;
  }

  ngOnDestroy(): void {
    this.image$?.unsubscribe();
    this.dynamicComponent$?.unsubscribe();
  }
}

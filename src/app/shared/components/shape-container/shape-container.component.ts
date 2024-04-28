import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ShapeContainer } from '../../interfaces/shape.interface';
import { ShapeContainerService } from '../../services/shape-container.service';
import { ImageDataService } from 'src/app/shared/services/image.service';
import { Subscription } from 'rxjs';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { Point } from 'src/app/website/interfaces/point.interface';
import { StatusBarService } from 'src/app/website/services/statusbar.service';
import { ToolName } from 'src/app/website/enums/tool-name.enum';
import { ZoomService } from 'src/app/website/services/zoom.service';

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
    private statusBarService: StatusBarService,
    private zoomService: ZoomService
  ) {}

  @ViewChild('auxCanvas') auxCanvas!: ElementRef;
  private ctxAux!: CanvasRenderingContext2D;
  private ctxMainCanvas!: CanvasRenderingContext2D;

  private zoomFactor = 0;
  private resizeButtonId: number = 0;
  private image$: Subscription | undefined;
  private dynamicComponent$: Subscription | undefined;

  private isOnShapeContainer: boolean = false;

  private isOnResizeButton: boolean = false;
  private selectedImage: ImageData | undefined;
  private resizedImage = new Image();

  private isAreaSelected = false;
  private isImagePlaced = false;

  private angle = 0;
  private initialAngle = 0;

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
  };

  private path: Point[] = [];

  private shapePath = new Path2D();

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
    this.initImage();
    this.initPath();

    this.initZoomFactor();
  }

  initZoomFactor() {
    this.zoomService.getZoomFactor().subscribe((currentZoomFactor) => {
      this.zoomFactor = currentZoomFactor;
      console.log(this.zoomFactor);
    });
  }

  ngAfterViewInit(): void {
    this.initAuxContext();
    this.initMainCanvasContext();
  }

  initPath() {
    this.imageDataService.getPath().subscribe((currentPath) => {
      this.path = currentPath;
    });
  }

  initMainCanvasContext() {
    this.ctxMainCanvas = this.renderer
      .selectRootElement('.canvas', true)
      .getContext('2d');
  }

  private initAuxContext() {
    this.ctxAux = this.auxCanvas.nativeElement.getContext('2d', {
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });
  }

  private initImage() {
    this.image$ = this.imageDataService.getImage().subscribe((image) => {
      if (image != undefined) {
        this.auxCanvas.nativeElement.width = image?.width;
        this.auxCanvas.nativeElement.height = image?.height;
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

  public mouseEnter(): void {
    this.statusBarService.setOutsideCanvas(false);
  }

  public mouseLeave(): void {
    this.statusBarService.setOutsideCanvas(true);
  }

  public btnMouseDown(id: number, event: MouseEvent) {
    const x = event.clientX / this.zoomFactor;
    const y = event.clientY / this.zoomFactor;
    this.isOnResizeButton = true;
    this.resizeButtonId = id;

    this.setDeltaXY(x, y);
  }

  public btnMouseUp() {
    this.isOnResizeButton = false;
    this.setShapeContainerReferenceProps();
  }

  public mainContainerMouseMove(event: MouseEvent) {
    const x = event.clientX / this.zoomFactor;
    const y = event.clientY / this.zoomFactor;
    this.mouseMovePosition = { x: x, y: y };

    if (this.isOnShapeContainer) {
      this.moveShapeContainer(x, y);
    } else if (this.isOnResizeButton) {
      this.resizeShapeContainer(x, y);
    }

    this.dynamicComponentService.setMouseMovePosition(this.mouseMovePosition);
    this.statusBarService.setCursorPosition(this.mouseMovePosition);
  }

  public mainContainerMouseDown(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;
    const newX = event.clientX / this.zoomFactor;
    const newY = event.clientY / this.zoomFactor;

    this.mouseDownPosition = { x: newX, y: newY };

    const { top, left, bottom, right } =
      this.auxCanvas.nativeElement.getBoundingClientRect();

    if (x < left - 32 || y < top - 32 || x > right + 32 || y > bottom + 32) {
      this.dynamicComponentService.setResizeButtonId(0);
    } else {
      this.dynamicComponentService.setResizeButtonId(10);
    }

    if (!this.isOnResizeButton && !this.isOnShapeContainer) {
      // this.shapeContainer.zIndex = 2;
      this.imageDataService.setImage(undefined);
      this.isAreaSelected = false;
      this.dynamicComponentService.setMouseDownPosition({
        x: x,
        y: y,
      });
    } else {
      if (this.shapeContainer.componentClass == ToolName.Select) {
        this.selectArea(ToolName.Select); //get the fragment of canvas
        this.setShapeContainerImage(); //set image to auxCanvas
        this.setSelectBackground('white');
      } else if (this.shapeContainer.componentClass == ToolName.Select2) {
        this.selectArea(ToolName.Select2);
        this.setFreeSelectedArea();
        this.setSelectBackground('transparent');
      }
    }
  }

  private selectArea(select: ToolName): void {
    if (!this.isAreaSelected) {
      const { width, height, top, left } = this.shapeContainer;
      this.selectedImage = this.ctxMainCanvas.getImageData(
        left,
        top,
        width,
        height
      );

      select === ToolName.Select
        ? this.clearSelectedArea()
        : this.clearFreeSelectedArea();

      this.isAreaSelected = true;
    }
  }

  private clearSelectedArea() {
    const { width, height, top, left } = this.shapeContainer;

    this.ctxMainCanvas.clearRect(left, top, width, height);
  }

  private clearFreeSelectedArea() {
    this.resizedImage.onload = () => {
      this.ctxMainCanvas.translate(
        this.shapeContainer.left,
        this.shapeContainer.top
      );
      this.ctxMainCanvas.fillStyle = 'white';
      this.ctxMainCanvas.fill(this.shapePath);
      this.ctxMainCanvas.setTransform(1, 0, 0, 1, 0, 0);
    };
  }

  private setShapeContainerImage(): void {
    if (this.selectedImage != undefined && !this.isImagePlaced) {
      this.imageDataService.setImage(this.selectedImage);
      const auxComponentUrl = this.auxCanvas.nativeElement.toDataURL();
      this.renderer.setAttribute(this.resizedImage, 'src', auxComponentUrl);
      this.imageDataService.setImageDataUrl(auxComponentUrl);
      this.isImagePlaced = true;
    }
  }

  private setFreeSelectedArea() {
    if (this.selectedImage != undefined && !this.isImagePlaced) {
      this.imageDataService.setImage(this.selectedImage);

      const img = new Image();
      img.src = this.auxCanvas.nativeElement.toDataURL();

      img.onload = () => {
        this.ctxAux.clearRect(
          0,
          0,
          this.shapeContainer.width,
          this.shapeContainer.height
        );

        this.shapePath.moveTo(
          this.path[0].x - this.shapeContainer.left,
          this.path[0].y - this.shapeContainer.top
        );

        for (let i = 0; i < this.path.length; i++) {
          this.shapePath.lineTo(
            this.path[i].x - this.shapeContainer.left,
            this.path[i].y - this.shapeContainer.top
          );
        }

        this.shapePath.closePath();

        this.ctxAux.clip(this.shapePath);

        this.ctxAux.drawImage(img, 0, 0);
        const freeSelectedImage = this.auxCanvas.nativeElement.toDataURL();
        this.resizedImage.src = freeSelectedImage;
        this.imageDataService.setImageDataUrl(freeSelectedImage);
      };
      this.isImagePlaced = true;
    }
  }

  private setSelectBackground(background: string) {
    this.shapeContainer.background = background;
  }

  public onShapeContainerMouseDown(event: MouseEvent) {
    const x = event.clientX / this.zoomFactor;
    const y = event.clientY / this.zoomFactor;
    this.isOnShapeContainer = true;
    this.isOnResizeButton = true;

    //console.log(event.clientX, event.clientY);

    this.setDeltaXY(x, y);
  }

  public onShapeContainerMouseUp() {
    //console.log(this.shapeContainer);

    this.dynamicComponentService.setResizeButtonId(0);

    this.isOnShapeContainer = false;
    this.isOnResizeButton = false;

    this.setShapeContainerReferenceProps();

    // console.log('se solto');
  }

  private moveShapeContainer(x: number, y: number): void {
    this.shapeContainer.top = y - this.XY.y;
    this.shapeContainer.left = x - this.XY.x;
    this.shapeContainer.referenceTop = y - this.XY.y;
    this.shapeContainer.referenceLeft = x - this.XY.x;
  }

  private setDeltaXY(offsetX: number, offsetY: number): void {
    this.XY = {
      x: offsetX - this.shapeContainer.left,
      y: offsetY - this.shapeContainer.top,
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
    const movingAngle = Math.atan2(y - halfHeight, x - halfWidth);

    this.angle += ((movingAngle - this.initialAngle) * 180) / Math.PI;

    this.initialAngle = movingAngle;
    this.shapeContainer.rotation = this.angle + 90;
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

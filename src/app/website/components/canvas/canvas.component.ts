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
import { CursorPosition } from 'src/app/website/interfaces/cursor-position.interface';
import { ImageDataService } from '../../../shared/services/image-data.service';
import { Tools } from '../../enums/tools.enum';
import { Cursors } from '../../enums/cursors.enum';
// import { Tools } from 'src/app/website/enums/tools.enum';

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

  @ViewChild('canvas', { static: true }) canvas!: ElementRef;

  @ViewChild(DynamicHostDirective, { read: ViewContainerRef })

  ///////// VARS
  //DYNAMIC COMPONENT
  private dynamicHost!: ViewContainerRef;
  private componentRef!: ComponentRef<AuxDivComponent>;
  private isInsideDynamicComponent = false;
  private isSelectDrawn = false;

  private selectedImage: ImageData | undefined;
  public canvasCursor: Cursors = Cursors.Crosshair;
  private XY: CursorPosition = {
    x: 0,
    y: 0,
  };

  private imagesArray: string[] = [];

  private objectProps: DynamicComponentProperties = {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    background: '',
    outline: '',
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
  private mouseDownPosition: CursorPosition = {
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
    this.canvasStateService.setCanvasDimensions(this.canvasDimensions);
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
      if (!currentState) {
        //check if there is still a last selected area
        if (this.selectedImage != undefined && this.toolName != Tools.Move) {
          this.checkLastSelectedArea();
        }
        //reset values
        this.resetAuxComponent();
        this.resetObjectProperties();
      }
    });
  }

  private resetAuxComponent() {
    this.imageDataService.setImage(undefined);
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
        this.createComponent();
        break;
      case Tools.Select:
        this.deleteComponent();
        this.createComponent();
        this.paintSelectedArea();
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
          // this.drawEllipse(event);
          break;
        case Tools.Select:
          this.drawRectangleDiv(event);
          this.setSelectStyles();
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
        case Tools.Line:
          break;
        case Tools.Rectangle:
          this.drawRectangle(this.objectProps);
          this.deleteComponent(); //delete component when any shape is drawed

          break;
        case Tools.Ellipse:
          break;

        case Tools.Select:
          this.selectImageArea(this.objectProps); //get the fragment of canvas
          this.clearSelectedArea(this.objectProps); //remove fragment from selection
          this.setAuxDivImage(); //set image to auxCanvas

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
    this.ctx.lineWidth = 3;
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
      //console.log('Cuarante 3');
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

  //podria devolver un objeto con las dimensiones del rectangulo recien dibujado para luego poder moverlo
  private drawRectangle(
    dynamicComponentProperties: DynamicComponentProperties
  ): void {
    this.ctx.fillRect(
      dynamicComponentProperties.left,
      dynamicComponentProperties.top,
      dynamicComponentProperties.width,
      dynamicComponentProperties.height
    );
  }

  // private drawEllipse(event: MouseEvent) {
  //   this.ctx.fillStyle = this.color;
  //   const relativeX = event.offsetX - this.x;
  //   const relativeY = event.offsetY - this.y;
  //   let newX = 0;
  //   let newY = 0;
  //   const endAngle = 2 * Math.PI;

  //   // Quadrant 1
  //   if (relativeX > 0 && relativeY < 0) {
  //     newX = this.x + Math.abs(this.x - event.offsetX) / 2;
  //     newY = this.y - Math.abs(this.y - event.offsetY) / 2;
  //   }
  //   // Quadrant 2
  //   else if (relativeX < 0 && relativeY < 0) {
  //     newX = this.x - Math.abs(this.x - event.offsetX) / 2;
  //     newY = this.y - Math.abs(this.y - event.offsetY) / 2;
  //   }
  //   // Quadrant 3
  //   else if (relativeX < 0 && relativeY > 0) {
  //     newX = this.x - Math.abs(this.x - event.offsetX) / 2;
  //     newY = this.y + Math.abs(this.y - event.offsetY) / 2;
  //   }
  //   //Quadrant 4
  //   else {
  //     newX = this.x + Math.abs(this.x - event.offsetX) / 2;
  //     newY = this.y + Math.abs(this.y - event.offsetY) / 2;
  //   }

  //   this.ctx.beginPath();
  //   this.ctx.ellipse(
  //     newX,
  //     newY,
  //     Math.abs(event.offsetX - this.x) / 2,
  //     Math.abs(event.offsetY - this.y) / 2,
  //     0,
  //     0,
  //     endAngle
  //   );
  //   this.ctx.fill();
  // }

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

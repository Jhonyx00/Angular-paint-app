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
import { CursorPosition } from 'src/app/shared/interfaces/cursor-position.interface';
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

  private img!: HTMLCanvasElement;

  private selectedImage!: ImageData;

  public XY: CursorPosition = {
    x: 0,
    y: 0,
  };

  private imagesArray: string[] = [];

  private props = {
    color: '',
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
  private currentDynamicComponentImage = new Image();
  private color: string = '';

  private toolName = '';
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

    this.initContext();
    this.initColor();
    this.initTool();
    this.updateCanvasValue();
  }

  private initContext() {
    this.ctx = this.canvas.nativeElement.getContext('2d', {
      willReadFrequently: true,
    });
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
    // get last value from behavior subject
    this.toolsService.selectedButtonObservable.subscribe((currentTool) => {
      this.toolName = currentTool; //get toolname
      console.log('Tool: ', this.toolName); //

      //check if there is still a last selected area
      this.checkSelectedArea();
    });
  }

  private initAuxDynamicComponent(): void {
    this.drawingStatusService.currentDimension.subscribe((currentShape) => {
      this.objectProps = currentShape;
    });
  }

  ///                     MOUSE EVENTS
  public mouseDown(event: MouseEvent): void {
    this.isDrawing = true;

    this.drawingStatusService.changeButtonState(true);
    this.mouseDownPosition.x = event.offsetX;
    this.mouseDownPosition.y = event.offsetY;

    // if (this.toolName == 'Rectangle' || this.toolName == 'Select') {
    //   this.createComponent();

    //   console.log('hay un select anterior?', this.isSelectDrawn);
    // }

    switch (this.toolName) {
      case 'Rectangle':
      case 'Select':
        this.deleteComponent();

        this.createComponent(); /////////////////////
        break;

      default:
        break;
    }

    // if (this.isSelectDrawn) {
    //   this.deleteComponent();
    // }

    // if (
    //   this.toolName != 'Line' &&
    //   this.toolName != 'Eraser' &&
    //   this.toolName != 'Move'
    // ) {
    //   //puesto que solo las figuras ocupan el componente dinamico
    //   this.createComponent();
    // }

    //borrar el componente dinamico en mousedown

    if (this.toolName == 'Move') {
      this.XY = {
        x: Math.abs(parseFloat(this.objectProps.left) - event.offsetX),
        y: Math.abs(parseFloat(this.objectProps.top) - event.offsetY),
      };
    }

    if (this.selectedImage != undefined && this.toolName === 'Select') {
      this.paintNewImage();

      //mover tool a shared porque se comparten siempre en la misma pagina
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
          // this.drawEllipse(event);
          break;
        case 'Select':
          this.drawRectangleDiv(event);
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
      ///detect if the "select" rectangle is done
      if (this.isSelectDrawn) {
        this.isMouseInside(event);
      } else {
        console.log('ninguna seleccion');
      }
    }

    //SET properties to be accesibble from status component
    this.propertiesService.positionXY({ x: event.offsetX, y: event.offsetY });
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
        //this.paintNewImage();
        break;

      case 'Select':
        this.selectImageArea(this.objectProps); //get the fragment of canvas
        this.clearSelectedArea(this.objectProps); //remove fragment from selection
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

  private moveObject(event: MouseEvent) {
    if (this.isInsideDynamicComponent) {
      //console.log(`Move to x:${event.offsetX}, y:${event.offsetY}`);
      this.objectProps.top = event.offsetY - this.XY.y + 'px';
      this.objectProps.left = event.offsetX - this.XY.x + 'px';

      this.drawingStatusService.setDynamicComponentDimensions(this.objectProps);

      this.setCurrentCanvasImage();
    }
  }

  private isMouseInside(event: MouseEvent) {
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

  private paintNewImage() {
    this.ctx.putImageData(
      this.selectedImage,
      parseFloat(this.objectProps.left),
      parseFloat(this.objectProps.top)
    );
  }

  private selectImageArea(area: DynamicComponentProperties) {
    this.isSelectDrawn = true; // a new rectangle select
    this.selectedImage = this.ctx.getImageData(
      parseFloat(area.left),
      parseFloat(area.top),
      parseFloat(area.width),
      parseFloat(area.height)
    );
  }

  private clearSelectedArea(area: DynamicComponentProperties) {
    this.ctx.clearRect(
      parseFloat(area.left),
      parseFloat(area.top),
      parseFloat(area.width),
      parseFloat(area.height)
    );
  }

  //esta funcion de abajo se ejecuta cada vez que se suelta el mouse
  private setCurrentCanvasImage(): void {
    ///guardarla mejor como imageData en vez de base64
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

  private checkSelectedArea() {
    //esto solo funciona si cambias de herramienta
    if (this.selectedImage != undefined && this.toolName != 'Move') {
      this.paintNewImage();

      console.log('se debe borrar el componente dinamico');

      this.deleteComponent();
      this.isSelectDrawn = false;
    } else {
    }
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
    const w = event.offsetX - this.mouseDownPosition.x;
    const h = event.offsetY - this.mouseDownPosition.y;

    const newX = Math.abs(event.offsetX - this.mouseDownPosition.x);
    const newY = Math.abs(event.offsetY - this.mouseDownPosition.y);

    // Quadrant 1
    if (w > 0 && h < 0) {
      this.objectProps = {
        top: event.offsetY + 'px',
        left: this.mouseDownPosition.x + 'px',
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
        top: this.mouseDownPosition.y + 'px',
        left: event.offsetX + 'px',
        width: newX + 'px',
        height: newY + 'px',
        background: this.color,
      };
    }
    //Quadrant 4
    else {
      this.objectProps = {
        top: this.mouseDownPosition.y + 'px',
        left: this.mouseDownPosition.x + 'px',
        width: newX + 'px',
        height: newY + 'px',
        background: this.color,
      };
    }

    if (this.toolName == 'Select') {
      this.objectProps.background = 'transparent';
    }

    this.drawingStatusService.setDynamicComponentDimensions(this.objectProps);
  }

  //podria devolver un objeto con las dimensiones del rectangulo recien dibujado para luego poder moverlo
  private drawRectangle(
    dynamicComponentProperties: DynamicComponentProperties
  ): void {
    this.ctx.fillRect(
      parseFloat(dynamicComponentProperties.left),
      parseFloat(dynamicComponentProperties.top),
      parseFloat(dynamicComponentProperties.width),
      parseFloat(dynamicComponentProperties.height)
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
    this.div = this.componentRef.location.nativeElement as HTMLElement;
    this.img = this.div.childNodes[0].firstChild as HTMLCanvasElement;
  }

  private deleteComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  // private selectArea(event: MouseEvent, proprs: {}): void {
  //   // console.log(proprs);

  //   this.ctx.setLineDash([5, 5]);
  //   this.ctx.fillStyle = 'transparent';
  //   this.ctx.strokeStyle = 'black';

  //   const w = event.offsetX - this.mouseDownPosition.x;
  //   const h = event.offsetY - this.mouseDownPosition.y;

  //   const newX = Math.abs(event.offsetX - this.mouseDownPosition.x);
  //   const newY = Math.abs(event.offsetY - this.mouseDownPosition.y);

  //   // Quadrant 1
  //   if (w > 0 && h < 0) {
  //     this.objectProps = {
  //       top: event.offsetY + 'px',
  //       left: this.mouseDownPosition.x + 'px',
  //       width: newX + 'px',
  //       height: newY + 'px',
  //       background: this.color,
  //     };
  //   }
  //   // Quadrant 2
  //   else if (w < 0 && h < 0) {
  //     this.objectProps = {
  //       top: event.offsetY + 'px',
  //       left: event.offsetX + 'px',
  //       width: newX + 'px',
  //       height: newY + 'px',
  //       background: this.color,
  //     };
  //   }
  //   // Quadrant 3
  //   else if (w < 0 && h > 0) {
  //     //console.log('Cuarante 3');
  //     this.objectProps = {
  //       top: this.mouseDownPosition.y + 'px',
  //       left: event.offsetX + 'px',
  //       width: newX + 'px',
  //       height: newY + 'px',
  //       background: this.color,
  //     };
  //   }
  //   //Quadrant 4
  //   else {
  //     this.objectProps = {
  //       top: this.mouseDownPosition.y + 'px',
  //       left: this.mouseDownPosition.x + 'px',
  //       width: newX + 'px',
  //       height: newY + 'px',
  //       background: this.props.color,
  //     };
  //   }

  //   this.drawingStatusService.setDynamicComponentDimensions(this.objectProps);
  // }
}

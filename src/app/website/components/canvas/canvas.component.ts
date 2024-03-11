import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { Ellipse } from '../../interfaces/shape.interface';
import { Rectangle } from '../../interfaces/shape.interface';
import { Line } from '../../interfaces/shape.interface';
import { CanvasStateService } from '../../services/canvas-state.service';
import { Cord } from '../../interfaces/cord.interface';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;

  constructor(
    private propertiesService: PropertiesService,
    private canvasStateService: CanvasStateService
  ) {}
  ngOnInit(): void {
    this.initCanvasDimensions();
    this.updateCanvasValue();
  }

  private initCanvasDimensions() {
    this.propertiesService.canvasSize({
      width: this.width,
      height: this.height,
    });
  }

  private updateCanvasValue() {
    this.canvasStateService.updateCanvasValue.subscribe(() => {
      this.paintAllShapes();
    });
  }

  width: number = 800;
  height: number = 500;

  private color: string = '#000000';
  private option = '';

  private toolName = '';
  private ctx!: CanvasRenderingContext2D;
  private isDrawing: boolean = false;

  private lineWidth = 3;
  //position
  private x: number = 0;
  private y: number = 0;

  //SHAPE ARRAY
  private shapeList: (Rectangle | Ellipse | Line)[] = [];
  //SHAPES
  // Objects that represents the shapes in order to be drawn on the canvas before a new drawing
  // is being painted
  private lineDimensions: Line = {
    color: '#000000',
    shapeType: '',
    points: [{ x: 0, y: 0 }],
  };

  private rectangleDimensions: Rectangle = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    color: '#000000',
    shapeType: '',
  };

  private ellipseDimensions: Ellipse = {
    x: 0,
    y: 0,
    radiusX: 0,
    radiusY: 0,
    rotation: 0,
    startAngle: 0,
    endAngle: 0,
    color: '#000000',
    shapeType: '',
  };

  ngAfterViewInit(): void {
    //when canvas is absolutely available
    this.ctx = this.canvas.nativeElement.getContext('2d');

    //GET properties canvas needs
    this.propertiesService.color.subscribe((currentColor) => {
      this.color = currentColor;
      this.ctx.fillStyle = this.color;
    });

    this.propertiesService.selectedShapeValue.subscribe((currentTool) => {
      this.toolName = currentTool;
    });

    //GET properties canvas needs
    this.propertiesService.selectedOptionValue.subscribe((currentOption) => {
      this.option = currentOption;

      if (this.option === 'Save') {
        this.saveWork();
        console.log(this.option);
      }
    });
  }

  //Mouse events
  mouseDown(event: MouseEvent) {
    //press mouse
    this.isDrawing = true;
    this.x = event.offsetX;
    this.y = event.offsetY;
  }

  mouseMove(event: MouseEvent) {
    //this.ctx.fillStyle = this.color;
    if (this.toolName !== 'Line') {
      this.paintAllShapes(); //condicionar este para que solo limpie la pantalla cuando sea diferente de linea
    }

    if (this.isDrawing) {
      //SHAPE SELECTION

      switch (this.toolName) {
        case 'Line':
          this.drawLine(event);
          break;
        case 'Rectangle':
          this.drawRectangle(event);
          //COLOCAR AQUI UNA LLAMADA A LA FUNCION PARA CREAR UN OBJETO DE TIPO RECTANGULO QUE SERÁ ALMACENADO EN EL ARREGLO DE FIGURAS
          //
          break;
        case 'Ellipse':
          this.drawEllipse(event);
          break;
        case '':
          break;
        default:
          break;
      }
    }
    //SET properties to be accesibble from other components
    this.propertiesService.positionXY({ x: event.offsetX, y: event.offsetY });
  }

  mouseUp() {
    this.isDrawing = false;
    switch (this.toolName) {
      case 'Line':
        this.shapeList.push(this.lineDimensions);
        this.points = []; //reset points
        break;
      case 'Rectangle':
        this.shapeList.push(this.rectangleDimensions);
        break;
      case 'Ellipse':
        this.shapeList.push(this.ellipseDimensions);
        break;
      default:
        break;
    }

    console.log('Todas las figuras', this.shapeList);
    this.propertiesService.setShapeList(this.shapeList);
  }

  mouseEnter() {
    this.propertiesService.outsideCanvas(false);
  }

  mouseLeave() {
    this.propertiesService.outsideCanvas(true);
  }

  private paintAllShapes() {
    this.propertiesService.shapeListValue.subscribe((currentShapeList) => {
      this.shapeList = currentShapeList;
    });

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.shapeList.forEach((shape) => {
      switch (shape.shapeType) {
        case 'Line':
          const line = shape as Line;
          this.ctx.strokeStyle = line.color;
          this.ctx.beginPath();
          for (let x = 0; x < line.points.length; x++) {
            this.ctx.lineTo(line.points[x].x, line.points[x].y);
          }
          this.ctx.stroke();
          break;

        case 'Rectangle':
          const rectangle = shape as Rectangle;
          this.ctx.fillStyle = rectangle.color;
          this.ctx.fillRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
          break;

        case 'Ellipse':
          const ellipse = shape as Ellipse;
          this.ctx.beginPath();
          // this.ctx.fillStyle = shape.color;
          this.ctx.fillStyle = ellipse.color;
          this.ctx.ellipse(
            ellipse.x,
            ellipse.y,
            ellipse.radiusX,
            ellipse.radiusY,
            ellipse.rotation,
            ellipse.startAngle,
            ellipse.endAngle
          );
          this.ctx.fill();
          break;
        ///other cases
        default:
          break;
      }
    });
  }
  //DRAWING FUNCTIONS
  //0
  private points: Cord[] = [];

  private drawLine(event: MouseEvent) {
    this.ctx.strokeStyle = this.color;

    this.ctx.lineWidth = 10;

    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
    this.x = event.offsetX;
    this.y = event.offsetY;

    this.points.push({
      x: this.x,
      y: this.y,
    });

    this.lineDimensions = {
      shapeType: 'Line',
      color: this.color,
      points: this.points,
    };
  }

  //1
  private drawRectangle(event: MouseEvent) {
    this.ctx.fillStyle = this.color;
    const w = event.offsetX - this.x;
    const h = event.offsetY - this.y;
    this.ctx.fillRect(this.x, this.y, w, h);
    //SI SE HACE LO DE LA LINEA 129 PODEMOS REMOVER ESTE CODIGO PARA DIBUJAR SOLO UN RECTANGULO
    //Rectangle object
    this.rectangleDimensions = {
      shapeType: 'Rectangle',
      x: this.x,
      y: this.y,
      w: w,
      h: h,
      color: this.color,
    };
  }

  //2
  private drawEllipse(event: MouseEvent) {
    this.ctx.fillStyle = this.color;
    const relativeX = event.offsetX - this.x;
    const relativeY = event.offsetY - this.y;
    let newX = 0;
    let newY = 0;
    const endAngle = 2 * Math.PI;

    // Quadrant 1
    if (relativeX > 0 && relativeY < 0) {
      newX = this.x + Math.abs(this.x - event.offsetX) / 2;
      newY = this.y - Math.abs(this.y - event.offsetY) / 2;
    }
    // Quadrant 2
    else if (relativeX < 0 && relativeY < 0) {
      newX = this.x - Math.abs(this.x - event.offsetX) / 2;
      newY = this.y - Math.abs(this.y - event.offsetY) / 2;
    }
    // Quadrant 3
    else if (relativeX < 0 && relativeY > 0) {
      newX = this.x - Math.abs(this.x - event.offsetX) / 2;
      newY = this.y + Math.abs(this.y - event.offsetY) / 2;
    }
    //Quadrant 4
    else {
      newX = this.x + Math.abs(this.x - event.offsetX) / 2;
      newY = this.y + Math.abs(this.y - event.offsetY) / 2;
    }

    this.ctx.beginPath();
    this.ctx.ellipse(
      newX,
      newY,
      Math.abs(event.offsetX - this.x) / 2,
      Math.abs(event.offsetY - this.y) / 2,
      0,
      0,
      endAngle
    );
    this.ctx.fill();

    //Oval object
    this.ellipseDimensions = {
      shapeType: 'Ellipse',
      x: newX,
      y: newY,
      radiusX: Math.abs(event.offsetX - this.x) / 2,
      radiusY: Math.abs(event.offsetY - this.y) / 2,
      rotation: 0,
      startAngle: 0,
      endAngle: endAngle,
      color: this.color,
    };
  }

  //HACER AQUI LAS FUNCIONES PARA CREAR LOS OBJETOS QUE VAN EN shapeList

  //OPTIONS FROM FILE COMPONENT

  //MOVE THIS FUNCTION TO OPTIONS COMPONENT//////////////////////////////////////////////////////////////////

  private saveWork() {
    const base64ImageData = this.canvas.nativeElement.toDataURL();
    let imageName = prompt('Enter image name');
    const downloadLink = document.createElement('a');
    downloadLink.href = base64ImageData;
    downloadLink.download = imageName || 'image1';
    downloadLink.click();
    window.URL.revokeObjectURL(downloadLink.href);
  }
}

//////////////////////////
/// modificar que tambien pinte los puntos de inicio y de fin de cada trazo
///////

import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PaintXD';
  toolName = 'Rectangle';
  //isDrawing = false;

  // //position
  // private x: number = 0;
  // private y: number = 0;
  // public div!: any;

  ngOnInit(): void {
    // this.div = document.getElementById('drawing-div');
  }

  // @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
  //   //si se esta dibujando
  //   if (this.isDrawing) {
  //     //SHAPE SELECTION
  //     switch (this.toolName) {
  //       case 'Line':
  //         // this.drawLine(event);
  //         break;
  //       case 'Rectangle':
  //         // this.drawRectangle(event);
  //         this.drawRectangleDiv(event);
  //         break;
  //       case 'Ellipse':
  //         //this.drawEllipse(event);
  //         break;

  //       case 'Eraser':
  //         // this.erase(event);
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // }
  // private drawRectangleDiv(event: MouseEvent) {
  //   //console.log('se podria modificar el div');
  //   const w = event.offsetX - this.x;
  //   const h = event.offsetY - this.y;

  //   console.log(event.offsetX, event.offsetY);

  //   this.div.style.top = this.y + 49 + 'px';
  //   this.div.style.left = this.x + 115 + 'px';
  //   this.div.style.width = w + 'px';
  //   this.div.style.height = h + 'px';

  //   //una variable que sea un subject y que el componente de div tenga tambien eventos y qu disminuya su tamaño si se disminuye el offset
  //   //tambien cambiar el componente del div al canvas nuevamente
  // }

  // @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
  //   if (this.toolName === 'Move') {
  //     //this.selectShape(event);
  //   } else {
  //     this.isDrawing = true;
  //     this.x = event.offsetX;
  //     this.y = event.offsetY;
  //     console.log(`Punto inicial x: ${this.x}, y: ${this.y}`);

  //     // en vez de lo anterior puedo usar el objeto de tipo Cord
  //   }
  // }

  // @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
  //   this.isDrawing = false;
  // }
}

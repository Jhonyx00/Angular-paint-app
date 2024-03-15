import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PaintXD';
  toolName = 'Rectangle';

  public div: any;
  ngOnInit(): void {
    this.div = document.getElementById('s');

    // window.addEventListener('wheel', (event) => {
    //   if (event.ctrlKey || event.metaKey) {
    //     event.preventDefault();
    //   }
    //   console.log(event, event.ctrlKey);
    // });
  }

  @HostListener('window:resize', ['$event']) onMouseMove(event: MouseEvent) {
    //si se esta dibujando
    //window.scrollTo(window.scrollX, window.screenY);
    //console.log('resize', event);
    // this.div.style.zoom = '90%';
  }
}
